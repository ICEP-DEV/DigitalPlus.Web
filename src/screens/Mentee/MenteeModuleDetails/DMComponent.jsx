import React, { useState, useEffect } from 'react';
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

  // Get current user (mentee) from localStorage
  const user = JSON.parse(localStorage.getItem('user')) || {};
  const currentUser = {
    id: (user.mentee_Id || 0).toString(),
    name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Unknown Mentee',
    role: 'mentee',
  };

  /**
   * 1) Fetch mentors for the module
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

  /**
   * 2) Debugging: list mentors
   */
  useEffect(() => {
    if (mentors.length > 0) {
      console.log('Mentor IDs:');
      mentors.forEach((mentor) => console.log(`Mentor ID: ${mentor.id}`));
    }
  }, [mentors]);

  /**
   * 3) Initialize SignalR connection ONCE
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
        newConnection.on('ReceiveDirectMessage', (senderUserId, senderName, message, timestamp) => {
          setMentorMessages((prev) => ({
            ...prev,
            [senderUserId]: [
              ...(prev[senderUserId] || []),
              {
                id: Date.now(),
                sender: senderName,
                text: message,
                timestamp,
                senderId: senderUserId,
                role: 'mentor',
                // No file attachments in text-only message
                attachments: [],
              },
            ],
          }));
        });

        // Listen for file messages
        newConnection.on(
          'ReceiveFileMessage',
          (senderUserId, senderName, base64File, fileType, timestamp, fileName) => {
            setMentorMessages((prev) => ({
              ...prev,
              [senderUserId]: [
                ...(prev[senderUserId] || []),
                {
                  id: Date.now(),
                  sender: senderName,
                  text: '[File Received]',
                  timestamp,
                  senderId: senderUserId,
                  role: 'mentor',
                  attachments: [
                    {
                      // Here we only have base64 in real-time, but
                      // you might rely on a separate fetch for the actual file.
                      attachmentId: null, // no ID from server's broadcast
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

    // Cleanup
    return () => {
      if (newConnection) newConnection.stop();
    };
  }, [currentUser.id]);

  /**
   * 4) Fetch existing messages for the currently selected mentor
   *    This calls our updated endpoint: GET /api/Messages/get-messages/{senderId}/{receiverId}
   *    which returns an array of messages with an 'attachments' array.
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

        // The updated endpoint returns something like:
        // [
        //   {
        //     messageId, senderId, receiverId, messageText, ...
        //     attachments: [ { attachmentId, fileName, fileType }, ... ]
        //   }, ...
        // ]
        const data = await response.json();

        const mapped = data.map((msg) => {
          const isCurrentUser = msg.senderId.toString() === currentUser.id;
          // Convert each attachment to a front-end friendly object
          const attachments = (msg.attachments || []).map((att) => ({
            attachmentId: att.attachmentId,
            fileName: att.fileName,
            fileType: att.fileType,
            base64: null, // We'll fetch or rely on get-attachment if needed
          }));

          return {
            id: msg.messageId,
            senderId: msg.senderId.toString(),
            sender: isCurrentUser ? currentUser.name : selectedMentor.name,
            role: isCurrentUser ? 'mentee' : 'mentor',
            text: msg.messageText,
            timestamp: new Date(msg.timestamp).toLocaleTimeString(),
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
   * 5) Send message (text or file)
   */
  const handleSendMessage = async () => {
    if (
      (newMessage.trim() || file) &&
      connection &&
      connection.state === signalR.HubConnectionState.Connected &&
      selectedMentor
    ) {
      try {
        // Send to our API
        const formData = new FormData();
        formData.append('SenderId', parseInt(currentUser.id, 10));
        formData.append('ReceiverId', parseInt(selectedMentor.id, 10));
        formData.append('MessageText', newMessage);
        formData.append('ModuleId', moduleId || 1);

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

        // Optionally, read the JSON to see the created Message object
        // const newMsgFromServer = await postResponse.json();

        // If there's a file, we broadcast via SignalR's SendFileMessage
        // If there's no file, we broadcast via SendDirectMessage
        const timestamp = new Date().toLocaleTimeString();
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
          await connection.invoke(
            'SendDirectMessage',
            selectedMentor.id,
            currentUser.id,
            currentUser.name,
            newMessage,
            timestamp
          );
        }

        // Add to local chat
        setMentorMessages((prev) => {
          const newEntry = {
            id: Date.now(),
            sender: currentUser.name,
            senderId: currentUser.id,
            role: currentUser.role,
            text: newMessage || '[File Sent]',
            timestamp,
            attachments: file
              ? [
                  {
                    attachmentId: null, // We don't have an ID yet
                    fileName: file.name,
                    fileType: file.type,
                    base64: null, // we haven't fetched or broadcast this from server
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
   * Helper: get file icon
   */
  const getFileIcon = (fileName) => {
    if (!fileName) return <FaFileAlt className={styles.dmFileIcon} />;
    const ext = fileName.split('.').pop().toLowerCase();
    if (ext === 'pdf') return <FaFilePdf className={styles.dmFileIcon} />;
    // add more checks if needed (image icons, etc.)
    return <FaFileAlt className={styles.dmFileIcon} />;
  };

  /**
   * Sidebar toggling & searching
   */
  const handleSidebarToggle = () => setIsSidebarCollapsed(!isSidebarCollapsed);

  const filteredMentors = mentors.filter((mentor) =>
    mentor.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  /**
   * Selecting a mentor
   */
  const handleMentorClick = (mentor) => {
    setSelectedMentor(mentor);
    setNewMessage('');
    setFile(null);
  };

  return (
    <div className={styles.dmPage}>
      {/* Sidebar */}
      <div
        className={`${styles.dmPageSidebar} ${isSidebarCollapsed ? styles.dmSidebarCollapsed : ''}`}
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
          {selectedMentor &&
            (mentorMessages[selectedMentor.id] || []).map((message) => (
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
                  <span className={styles.dmTimestamp}>{message.timestamp}</span>
                </div>
                <div className={styles.dmMessageText}>
                  <p>{message.text}</p>

                  {/* If there are attachments, list them */}
                  {message.attachments &&
                    message.attachments.map((att, index) => {
                      // If you have "get-attachment" endpoint:
                      //   GET /api/Messages/get-attachment/{attachmentId}
                      // you can create a link or button for each attachment
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
                            // Direct link to download from server
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
                            // If there's no attachmentId (like ephemeral local message),
                            // you could hide or disable this link
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
