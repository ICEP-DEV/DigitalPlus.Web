import React, { useState, useEffect, useRef } from 'react';
import * as signalR from '@microsoft/signalr';
import { useParams } from 'react-router-dom';
import styles from './DmPage.module.css';
import {
  FaPaperPlane,
  FaPaperclip,
  FaTimes,
  FaFilePdf,
  FaDownload,
  FaFileAlt,
  FaSearch,
} from 'react-icons/fa';

// 1) Import crypto-js and define a secret key:
import CryptoJS from 'crypto-js';
const SECRET_KEY = 'YOUR_SECRET_KEY_HERE'; // For demo only

// 2) Helper functions for encryption/decryption:
function encryptText(plainText) {
  return CryptoJS.AES.encrypt(plainText, SECRET_KEY).toString();
}

function decryptText(cipherText) {
  try {
    const bytes = CryptoJS.AES.decrypt(cipherText, SECRET_KEY);
    return bytes.toString(CryptoJS.enc.Utf8) || '[Decryption Failed]';
  } catch {
    return '[Decryption Error]';
  }
}

const DMComponent = () => {
  const [connection, setConnection] = useState(null);
  const [mentorMessages, setMentorMessages] = useState({});
  const [newMessage, setNewMessage] = useState('');
  const [file, setFile] = useState(null);
  const [mentors, setMentors] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [selectedMentor, setSelectedMentor] = useState(null);

  const { moduleId } = useParams();

  // Current user (mentee)
  const user = JSON.parse(localStorage.getItem('user')) || {};
  const currentUser = {
    id: (user.mentee_Id || 0).toString(),
    name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Unknown Mentee',
    role: 'mentee',
  };

  // Auto-scroll ref
  const messagesEndRef = useRef(null);

  // Group by date
  const groupMessagesByDate = (messagesArray) => {
    const sorted = [...messagesArray].sort((a, b) => a.timestamp - b.timestamp);
    return sorted.reduce((groups, msg) => {
      const dateKey = msg.timestamp.toDateString();
      if (!groups[dateKey]) groups[dateKey] = [];
      groups[dateKey].push(msg);
      return groups;
    }, {});
  };

  /**
   * 1) Fetch mentors
   */
  useEffect(() => {
    const fetchMentors = async () => {
      try {
        const storedModule = localStorage.getItem('selectedModule');
        let actualModuleId = moduleId;
        if (storedModule) {
          const parsed = JSON.parse(storedModule);
          if (parsed && parsed.moduleId) actualModuleId = parsed.moduleId;
        }

        const response = await fetch(
          `https://localhost:7163/api/AssignMod/getmentorsBy_ModuleId/${actualModuleId}`
        );
        if (!response.ok) {
          console.error('Failed to fetch mentors:', response.statusText);
          return;
        }

        const data = await response.json();
        setMentors(
          data.map((mentor) => ({
            id: mentor.mentorId.toString(),
            name: `${mentor.firstName} ${mentor.lastName}`,
            email: mentor.studentEmail,
            contactNo: mentor.contactNo,
            online: false,
          }))
        );
      } catch (error) {
        console.error('Error fetching mentors:', error);
      }
    };

    if (moduleId) {
      fetchMentors();
    }
  }, [moduleId]);

  // Debug
  useEffect(() => {
    if (mentors.length > 0) {
      console.log('Mentor IDs:');
      mentors.forEach((mentor) => console.log(`Mentor ID: ${mentor.id}`));
    }
  }, [mentors]);

  /**
   * 2) Initialize SignalR connection
   */
  useEffect(() => {
    const newConnection = new signalR.HubConnectionBuilder()
      .withUrl(`https://localhost:7163/communicationHub?userId=${currentUser.id}`, {
        transport: signalR.HttpTransportType.WebSockets,
      })
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Information)
      .build();

    newConnection
      .start()
      .then(() => {
        console.log('Connected to SignalR hub as Mentee');

        // Listen for text messages
        newConnection.on('ReceiveDirectMessage', (senderUserId, senderName, cipherText, timestamp) => {
          // Decrypt the incoming message
          const decryptedText = decryptText(cipherText);

          const ts = new Date(timestamp);
          setMentorMessages((prev) => ({
            ...prev,
            [senderUserId]: [
              ...(prev[senderUserId] || []),
              {
                id: Date.now(),
                sender: senderName,
                text: decryptedText,
                timestamp: ts,
                senderId: senderUserId,
                role: 'mentor',
                attachments: [],
              },
            ],
          }));
        });

        // Listen for file messages
        newConnection.on(
          'ReceiveFileMessage',
          (senderUserId, senderName, base64File, fileType, timestamp, fileName) => {
            const ts = new Date(timestamp);
            setMentorMessages((prev) => ({
              ...prev,
              [senderUserId]: [
                ...(prev[senderUserId] || []),
                {
                  id: Date.now(),
                  sender: senderName,
                  text: '[File Received]',
                  timestamp: ts,
                  senderId: senderUserId,
                  role: 'mentor',
                  attachments: [
                    {
                      attachmentId: null,
                      fileName,
                      fileType,
                      base64: base64File,
                    },
                  ],
                },
              ],
            }));
          }
        );

        setConnection(newConnection);
      })
      .catch((err) => console.error('Connection failed:', err));

    return () => {
      if (newConnection) newConnection.stop();
    };
  }, [currentUser.id]);

  /**
   * 3) Fetch existing messages for the currently selected mentor
   */
  useEffect(() => {
    if (!selectedMentor) return;

    const fetchMessages = async () => {
      try {
        const url = `https://localhost:7163/api/Messages/get-messages/${currentUser.id}/${selectedMentor.id}`;
        const response = await fetch(url);
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(errorText || 'Failed to fetch messages');
        }

        const data = await response.json();

        const mapped = data.map((msg) => {
          const isCurrentUser = msg.senderId.toString() === currentUser.id;

          // Decrypt the stored ciphertext
          const decryptedText = decryptText(msg.messageText);

          const attachments = (msg.attachments || []).map((att) => ({
            attachmentId: att.attachmentId,
            fileName: att.fileName,
            fileType: att.fileType,
            base64: null,
          }));

          return {
            id: msg.messageId,
            senderId: msg.senderId.toString(),
            sender: isCurrentUser ? currentUser.name : selectedMentor.name,
            role: isCurrentUser ? 'mentee' : 'mentor',
            text: decryptedText,
            timestamp: new Date(msg.timestamp),
            attachments,
          };
        });

        setMentorMessages((prev) => ({
          ...prev,
          [selectedMentor.id]: mapped,
        }));
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchMessages();
  }, [selectedMentor, currentUser.id]);

  /**
   * 4) Auto-scroll
   */
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [mentorMessages, selectedMentor]);

  /**
   * 5) Send message (text or file)
   * Hard code ModuleId as 1.
   */
  const handleSendMessage = async () => {
    if (
      (newMessage.trim() || file) &&
      connection &&
      connection.state === signalR.HubConnectionState.Connected &&
      selectedMentor
    ) {
      try {
        const formData = new FormData();
        // 5a) Encrypt the text before sending
        const plainText = newMessage.trim() || (file ? '..' : '..');
        const encryptedText = encryptText(plainText);

        formData.append('SenderId', parseInt(currentUser.id, 10));
        formData.append('ReceiverId', parseInt(selectedMentor.id, 10));
        formData.append('MessageText', encryptedText);
        formData.append('ModuleId', 1);

        if (file) {
          formData.append('File', file);
        }

        const postResponse = await fetch('https://localhost:7163/api/Messages/send-message', {
          method: 'POST',
          body: formData,
        });

        if (!postResponse.ok) {
          const errorText = await postResponse.text();
          console.error('Server error:', postResponse.status, errorText);
          alert(`Error sending message: ${errorText}`);
          return;
        }

        const timestamp = new Date();
        if (file) {
          const reader = new FileReader();
          reader.onloadend = async () => {
            const base64String = reader.result.split(',')[1];
            await connection.invoke(
              'SendFileMessage',
              selectedMentor.id,
              currentUser.id,
              currentUser.name,
              base64String,
              file.type,
              timestamp,
              file.name
            );
          };
          reader.readAsDataURL(file);
        } else {
          // Send the encrypted text to the other user
          await connection.invoke(
            'SendDirectMessage',
            selectedMentor.id,
            currentUser.id,
            currentUser.name,
            encryptedText,  // <--- ciphertext
            timestamp
          );
        }

        // Update local chat with plaintext
        setMentorMessages((prev) => {
          const newEntry = {
            id: Date.now(),
            sender: currentUser.name,
            senderId: currentUser.id,
            role: currentUser.role,
            text: plainText, // keep it readable in our UI
            timestamp,
            attachments: file
              ? [
                  {
                    attachmentId: null,
                    fileName: file.name,
                    fileType: file.type,
                    base64: null,
                  },
                ]
              : [],
          };

          return {
            ...prev,
            [selectedMentor.id]: [...(prev[selectedMentor.id] || []), newEntry],
          };
        });

        setNewMessage('');
        setFile(null);
      } catch (error) {
        console.error('Error sending message:', error);
        alert(`Error sending message: ${error.message}`);
      }
    }
  };

  /**
   * 6) File selection
   */
  const handleFileUpload = (event) => {
    const uploadedFile = event.target.files[0];
    if (uploadedFile) setFile(uploadedFile);
  };

  /**
   * 7) Sidebar toggling & searching
   */
  const handleSidebarToggle = () => setIsSidebarCollapsed(!isSidebarCollapsed);

  const filteredMentors = mentors.filter((mentor) =>
    mentor.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  /**
   * 8) Selecting a mentor
   */
  const handleMentorClick = (mentor) => {
    setSelectedMentor(mentor);
    setNewMessage('');
    setFile(null);
  };

  /**
   * 9) Get file icon
   */
  const getFileIcon = (fileName) => {
    if (!fileName) return <FaFileAlt className={styles.dmFileIcon} />;
    const ext = fileName.split('.').pop().toLowerCase();
    if (ext === 'pdf') return <FaFilePdf className={styles.dmFileIcon} />;
    return <FaFileAlt className={styles.dmFileIcon} />;
  };

  return (
    <div className={styles.dmPage}>
      {/* Sidebar */}
      <div
        className={`${styles.dmPageSidebar} ${
          isSidebarCollapsed ? styles.dmSidebarCollapsed : ''
        }`}
        onDoubleClick={handleSidebarToggle}
      >
        <div className={styles.dmSidebarHeader}>
          <h3>Mentors</h3>
          <div className={styles.dmSearchContainer}>
            <FaSearch className={styles.dmSearchIcon} />
            <input
              type="text"
              placeholder="Search for a mentor"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.dmSearchInput}
            />
          </div>
        </div>
        <ul className={styles.dmMentorList}>
          {filteredMentors.map((mentor) => (
            <li
              key={mentor.id}
              className={styles.dmMentorItem}
              onClick={() => handleMentorClick(mentor)}
            >
              <span className={mentor.online ? styles.dmPageOnline : styles.dmPageOffline}>
                {mentor.name}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Main chat area */}
      <div className={styles.dmMain}>
        <div className={styles.dmHeader}>
          <h2>{selectedMentor ? selectedMentor.name : 'Direct Message'}</h2>
        </div>

        {/* Messages */}
        <div className={styles.dmMessages}>
          {selectedMentor && mentorMessages[selectedMentor.id] && (
            Object.entries(groupMessagesByDate(mentorMessages[selectedMentor.id])).map(([date, msgs]) => (
              <div key={date}>
                <div className={styles.dmDateDivider}>
                  <span>{date}</span>
                </div>
                {msgs.map((message) => (
                  <div
                    key={message.id}
                    className={`${styles.dmMessageItem} ${
                      message.senderId === currentUser.id ? styles.dmSent : styles.dmReceived
                    }`}
                  >
                    <div className={styles.dmSenderInfo}>
                      <span className={styles.dmSenderName}>
                        {message.sender} ({message.role})
                      </span>
                      <span className={styles.dmTimestamp}>
                        {message.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                    <div className={styles.dmMessageText}>
                      <p>{message.text}</p>
                      {message.attachments &&
                        message.attachments.map((att, index) => {
                          const downloadUrl = att.attachmentId
                            ? `https://localhost:7163/api/Messages/get-attachment/${att.attachmentId}`
                            : null;
                          return (
                            <div key={index} className={styles.dmFileAttachment}>
                              {getFileIcon(att.fileName)}
                              <span className={styles.dmFileName}>
                                {att.fileName || 'Attachment'}
                              </span>
                              {downloadUrl ? (
                                <a
                                  href={downloadUrl}
                                  className={styles.dmDownloadButton}
                                  download
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <FaDownload /> Download
                                </a>
                              ) : (
                                <span className={styles.dmDownloadButton} style={{ opacity: 0.5 }}>
                                  No Download
                                </span>
                              )}
                            </div>
                          );
                        })}
                    </div>
                  </div>
                ))}
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input area */}
        <div className={styles.dmInputArea}>
          {file && (
            <div className={styles.dmFilePreviewBox}>
              <div className={styles.dmFilePreviewContent}>
                <span>File ready to send:</span>
                <p>{file.name}</p>
              </div>
              <FaTimes className={styles.dmCancelFileIcon} onClick={() => setFile(null)} />
            </div>
          )}
          <div className={styles.dmInputRow}>
            <textarea
              className={styles.dmTextArea}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
            />
            <label htmlFor="file-upload" className={styles.dmFileUploadIcon}>
              <FaPaperclip />
            </label>
            <input
              type="file"
              id="file-upload"
              style={{ display: 'none' }}
              onChange={handleFileUpload}
            />
            <button
              className={styles.dmButton}
              onClick={handleSendMessage}
              disabled={!newMessage.trim() && !file}
            >
              <FaPaperPlane />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DMComponent;
