import React, { useState, useEffect, useRef } from 'react';
import * as signalR from '@microsoft/signalr';
import { useParams } from 'react-router-dom';
import styles from './MentorDMComponent.module.css';
import {
  FaPaperPlane,
  FaPaperclip,
  FaReply,
  FaTimes,
  FaFilePdf,
  FaDownload,
  FaFileAlt,
  FaEdit,
  FaTrash,
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

const MentorDMComponent = () => {
  const [connection, setConnection] = useState(null);
  const [mentorMessages, setMentorMessages] = useState({});
  const [newMessage, setNewMessage] = useState('');
  const [file, setFile] = useState(null);
  const [replyTo, setReplyTo] = useState(null);
  const [mentees, setMentees] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [selectedMentee, setSelectedMentee] = useState(null);

  const { moduleId } = useParams();

  // Example: get user info from localStorage
  const user = JSON.parse(localStorage.getItem('user')) || {};
  const currentUser = {
    id: user.mentorId ? user.mentorId.toString() : '0',
    name:
      user.firstName && user.lastName
        ? `${user.firstName} ${user.lastName}`
        : 'Unknown Mentor',
    role: 'mentor',
  };

  // Ref for auto-scroll
  const messagesEndRef = useRef(null);

  // Helper: Group messages by date (e.g. "Mon Jul 31 2023")
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
   * 1) Fetch Mentees for this module
   */
  useEffect(() => {
    const fetchMentees = async () => {
      try {
        const storedModule = localStorage.getItem('selectedModule');
        let actualModuleId = moduleId; // from URL params
        if (storedModule) {
          const parsed = JSON.parse(storedModule);
          if (parsed && parsed.moduleId) {
            actualModuleId = parsed.moduleId;
          }
        }
        const response = await fetch(
          `https://localhost:7163/api/AssignMod/getmenteesBy_ModuleId/${actualModuleId}`
        );
        if (response.ok) {
          const menteeData = await response.json();
          const mappedMentees = menteeData.map((mentee) => ({
            id: mentee.menteeId.toString(),
            name: `${mentee.firstName} ${mentee.lastName}`,
            email: mentee.studentEmail,
            online: false,
          }));
          setMentees(mappedMentees);
        } else {
          const errorText = await response.text();
          console.error('Failed to fetch mentees:', response.status, errorText);
        }
      } catch (error) {
        console.error('Error fetching mentees:', error);
      }
    };
    fetchMentees();
  }, [moduleId]);

  // Debug: log mentee IDs
  useEffect(() => {
    if (mentees.length > 0) {
      console.log('Mentee IDs:', mentees.map((m) => m.id));
    }
  }, [mentees]);

  /**
   * 2) Set up SignalR connection
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
        console.log('Connected to SignalR hub as Mentor');

        newConnection.on('ReceiveDirectMessage', (senderUserId, senderName, cipherText, timestamp) => {
          // Decrypt the incoming message text
          const decryptedMessage = decryptText(cipherText);
          if (selectedMentee && senderUserId === selectedMentee.id) {
            const ts = new Date(timestamp);
            setMentorMessages((prev) => ({
              ...prev,
              [selectedMentee.id]: [
                ...(prev[selectedMentee.id] || []),
                {
                  id: Date.now(),
                  sender: senderName,
                  text: decryptedMessage,
                  timestamp: ts,
                  senderId: senderUserId,
                  role: 'mentee',
                  attachments: [],
                },
              ],
            }));
          }
        });

        newConnection.on(
          'ReceiveFileMessage',
          (senderUserId, senderName, base64File, fileType, timestamp, fileName) => {
            if (selectedMentee && senderUserId === selectedMentee.id) {
              const ts = new Date(timestamp);
              setMentorMessages((prev) => ({
                ...prev,
                [selectedMentee.id]: [
                  ...(prev[selectedMentee.id] || []),
                  {
                    id: Date.now(),
                    sender: senderName,
                    text: '[File Received]',
                    timestamp: ts,
                    senderId: senderUserId,
                    role: 'mentee',
                    attachments: [
                      {
                        attachmentId: null,
                        fileName,
                        fileType,
                        base64File,
                      },
                    ],
                  },
                ],
              }));
            }
          }
        );

        setConnection(newConnection);
      })
      .catch((err) => console.error('Connection failed:', err));

    return () => {
      if (newConnection) newConnection.stop();
    };
  }, [selectedMentee, currentUser.id]);

  /**
   * 3) Fetch existing messages whenever a new mentee is selected
   */
  useEffect(() => {
    if (!selectedMentee) return;
    const fetchMessages = async () => {
      try {
        const response = await fetch(
          `https://localhost:7163/api/Messages/get-messages/${currentUser.id}/${selectedMentee.id}`
        );
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(errorText || 'Failed to fetch messages');
        }
        const data = await response.json();
        const mapped = data.map((msg) => {
          const isMentor = msg.senderId.toString() === currentUser.id;

          // 3a) Decrypt the stored ciphertext from DB
          const decryptedText = decryptText(msg.messageText);

          const attachments = (msg.attachments || []).map((att) => ({
            attachmentId: att.attachmentId,
            fileName: att.fileName,
            fileType: att.fileType,
            base64File: null,
          }));
          return {
            id: msg.messageId,
            senderId: msg.senderId.toString(),
            sender: isMentor ? currentUser.name : selectedMentee.name,
            role: isMentor ? 'mentor' : 'mentee',
            text: decryptedText,
            timestamp: new Date(msg.timestamp),
            attachments,
            replyTo: msg.replyTo || null,
          };
        });
        setMentorMessages((prev) => ({
          ...prev,
          [selectedMentee.id]: mapped,
        }));
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };
    fetchMessages();
  }, [selectedMentee, currentUser.id]);

  /**
   * 4) Auto-scroll
   */
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [mentorMessages, selectedMentee]);

  /**
   * 5) Handle sending a message (text or file)
   */
  const handleSendMessage = async () => {
    if (
      (newMessage.trim() || file) &&
      connection &&
      connection.state === signalR.HubConnectionState.Connected &&
      selectedMentee
    ) {
      try {
        const timestamp = new Date();

        // 5a) Encrypt the message before sending to the server
        const plainText = newMessage.trim() || (file ? '..' : '..');
        const encryptedText = encryptText(plainText);

        const formData = new FormData();
        formData.append('SenderId', parseInt(currentUser.id, 10));
        formData.append('ReceiverId', parseInt(selectedMentee.id, 10));
        // Store the ciphertext in the DB
        formData.append('MessageText', encryptedText);
        formData.append('ModuleId', 1); // Hard-coded ModuleId

        if (file) {
          formData.append('File', file);
        }

        const response = await fetch('https://localhost:7163/api/Messages/send-message', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          const errorText = await response.text();
          alert(`Error sending message: ${errorText}`);
          return;
        }

        if (file) {
          const reader = new FileReader();
          reader.onloadend = async () => {
            const base64String = reader.result.split(',')[1];
            await connection.invoke(
              'SendFileMessage',
              selectedMentee.id,
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
          // Send the ciphertext to the other user as well
          await connection.invoke(
            'SendDirectMessage',
            selectedMentee.id,
            currentUser.id,
            currentUser.name,
            encryptedText,  // <--- we pass the encrypted text to the hub
            timestamp
          );
        }

        // Locally show the plaintext in our state:
        setMentorMessages((prev) => {
          const newEntry = {
            id: Date.now(),
            sender: currentUser.name,
            senderId: currentUser.id,
            role: currentUser.role,
            text: plainText, // store decrypted text in local UI
            timestamp,
            attachments: file
              ? [
                  {
                    attachmentId: null,
                    fileName: file.name,
                    fileType: file.type,
                    base64File: null,
                  },
                ]
              : [],
            replyTo: replyTo,
          };
          return {
            ...prev,
            [selectedMentee.id]: [...(prev[selectedMentee.id] || []), newEntry],
          };
        });

        setNewMessage('');
        setReplyTo(null);
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
    if (uploadedFile) {
      setFile(uploadedFile);
    }
  };

  /**
   * 7) Reply logic (optional)
   */
  const handleReply = (message) => setReplyTo(message);
  const handleCancelReply = () => setReplyTo(null);
  const handleCancelFile = () => setFile(null);

  /**
   * 8) Sidebar / searching
   */
  const handleSidebarToggle = () => setIsSidebarCollapsed(!isSidebarCollapsed);
  const handleMenteeClick = (mentee) => {
    setSelectedMentee(mentee);
    setNewMessage('');
    setReplyTo(null);
    setFile(null);
  };

  const filteredMentees = mentees.filter((mentee) =>
    mentee.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  /**
   * 9) Download file helper (if using base64)
   */
  const downloadFile = (base64Data, fileName, fileType) => {
    const byteCharacters = atob(base64Data);
    const byteNumbers = Array.from(byteCharacters, (char) => char.charCodeAt(0));
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: fileType });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  /**
   * 10) Choose an icon for the file
   */
  const getFileIcon = (fileName) => {
    if (!fileName) return <FaFileAlt className={styles.dmFileIcon} />;
    const fileExtension = fileName.split('.').pop().toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif'].includes(fileExtension)) {
      return <FaFileAlt className={styles.dmFileIcon} />;
    } else if (fileExtension === 'pdf') {
      return <FaFilePdf className={styles.dmFileIcon} />;
    }
    return <FaFileAlt className={styles.dmFileIcon} />;
  };

  return (
    <div className={styles.mentorDMComponentPage}>
      {/* Sidebar */}
      <div
        className={`${styles.mentorDMComponentSidebar} ${
          isSidebarCollapsed ? styles.mentorDMComponentSidebarCollapsed : ''
        }`}
        onDoubleClick={handleSidebarToggle}
      >
        <div className={styles.mentorDMComponentSidebarHeader}>
          <h3>Mentees</h3>
          <div className={styles.mentorDMComponentSearchContainer}>
            <FaSearch className={styles.mentorDMComponentSearchIcon} />
            <input
              type="text"
              placeholder="Search for a mentee"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.mentorDMComponentSearchInput}
            />
          </div>
        </div>
        <ul className={styles.mentorDMComponentMenteeList}>
          {filteredMentees.map((mentee) => (
            <li
              key={mentee.id}
              className={styles.mentorDMComponentMenteeItem}
              onClick={() => handleMenteeClick(mentee)}
            >
              <span
                className={
                  mentee.online
                    ? styles.mentorDMComponentOnline
                    : styles.mentorDMComponentOffline
                }
              >
                {mentee.name}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Main Chat Area */}
      <div className={styles.mentorDMComponentMain}>
        <div className={styles.mentorDMComponentHeader}>
          <h2>{selectedMentee ? selectedMentee.name : 'Select a Mentee'}</h2>
        </div>

        <div className={styles.mentorDMComponentMessages}>
          {selectedMentee && mentorMessages[selectedMentee.id] && (
            Object.entries(groupMessagesByDate(mentorMessages[selectedMentee.id])).map(([date, msgs]) => (
              <div key={date}>
                <div className={styles.dmDateDivider}>
                  <span>{date}</span>
                </div>
                {msgs.map((message) => (
                  <div
                    key={message.id}
                    className={`${styles.mentorDMComponentMessageItem} ${
                      message.senderId === currentUser.id
                        ? styles.mentorDMComponentSent
                        : styles.mentorDMComponentReceived
                    }`}
                  >
                    <div className={styles.mentorDMComponentSenderInfo}>
                      <span className={styles.mentorDMComponentSenderName}>
                        {message.sender} ({message.role})
                      </span>
                      <span className={styles.mentorDMComponentTimestamp}>
                        {message.timestamp.toLocaleTimeString()}
                      </span>
                    </div>

                    {message.replyTo && (
                      <div className={styles.mentorDMComponentReplyTo}>
                        <span className={styles.mentorDMComponentReplySender}>
                          {message.replyTo.sender}:
                        </span>{' '}
                        {message.replyTo.text || 'Attachment'}
                      </div>
                    )}

                    <div className={styles.mentorDMComponentMessageText}>
                      <p>{message.text}</p>
                      {message.attachments &&
                        message.attachments.map((att, idx) => {
                          const downloadUrl = att.attachmentId
                            ? `https://localhost:7163/api/Messages/get-attachment/${att.attachmentId}`
                            : null;
                          return (
                            <div key={idx} className={styles.mentorDMComponentFileAttachment}>
                              {getFileIcon(att.fileName)}
                              <span className={styles.mentorDMComponentFileName}>
                                {att.fileName || 'Attachment'}
                              </span>
                              {downloadUrl ? (
                                <a
                                  href={downloadUrl}
                                  className={styles.mentorDMComponentDownloadButton}
                                  download
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <FaDownload /> Download
                                </a>
                              ) : att.base64File ? (
                                <button
                                  onClick={() =>
                                    downloadFile(att.base64File, att.fileName, att.fileType)
                                  }
                                  className={styles.mentorDMComponentDownloadButton}
                                >
                                  <FaDownload /> Download
                                </button>
                              ) : (
                                <span style={{ opacity: 0.5 }}>No Download</span>
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
          {/* Dummy div for auto-scroll */}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className={styles.mentorDMComponentInputArea}>
          {replyTo && (
            <div className={styles.mentorDMComponentReplyBox}>
              <span>
                Replying to: {replyTo.sender} - {replyTo.text || 'Attachment'}
              </span>
              <FaTimes
                className={styles.mentorDMComponentCancelReplyIcon}
                onClick={handleCancelReply}
              />
            </div>
          )}

          {file && (
            <div className={styles.mentorDMComponentFilePreviewBox}>
              <div className={styles.mentorDMComponentFilePreviewContent}>
                <span>File ready to send:</span>
                <p>{file.name}</p>
              </div>
              <FaTimes
                className={styles.mentorDMComponentCancelFileIcon}
                onClick={handleCancelFile}
              />
            </div>
          )}

          <div className={styles.mentorDMComponentInputRow}>
            <textarea
              className={styles.mentorDMComponentTextArea}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
            />
            <label htmlFor="file-upload" className={styles.mentorDMComponentFileUploadIcon}>
              <FaPaperclip />
            </label>
            <input
              type="file"
              id="file-upload"
              style={{ display: 'none' }}
              onChange={handleFileUpload}
            />
            <button
              className={styles.mentorDMComponentButton}
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

export default MentorDMComponent;
