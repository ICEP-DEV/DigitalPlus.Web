import React, { useState, useEffect } from 'react';
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

  // Debugging: log mentee IDs
  useEffect(() => {
    if (mentees.length > 0) {
      console.log('Mentee IDs:', mentees.map((m) => m.id));
    }
  }, [mentees]);

  /**
   * 2) Set up SignalR connection ONCE (or re-init if needed)
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

        // Listen for text messages
        newConnection.on('ReceiveDirectMessage', (senderUserId, senderName, message, timestamp) => {
          // If it's from the currently selected mentee, update local chat
          if (selectedMentee && senderUserId === selectedMentee.id) {
            setMentorMessages((prev) => ({
              ...prev,
              [selectedMentee.id]: [
                ...(prev[selectedMentee.id] || []),
                {
                  id: Date.now(),
                  sender: senderName,
                  text: message,
                  timestamp,
                  senderId: senderUserId,
                  role: 'mentee',
                  attachments: [],
                },
              ],
            }));
          }
        });

        // Listen for file messages
        newConnection.on(
          'ReceiveFileMessage',
          (senderUserId, senderName, base64File, fileType, timestamp, fileName) => {
            if (selectedMentee && senderUserId === selectedMentee.id) {
              setMentorMessages((prev) => ({
                ...prev,
                [selectedMentee.id]: [
                  ...(prev[selectedMentee.id] || []),
                  {
                    id: Date.now(),
                    sender: senderName,
                    text: '[File Received]',
                    timestamp,
                    senderId: senderUserId,
                    role: 'mentee',
                    attachments: [
                      {
                        attachmentId: null, // real ID not broadcast
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
        // data is an array of messages. Each message has an "attachments" array.
        // Example shape:
        // [
        //   {
        //     messageId: 1,
        //     senderId: 10,
        //     ...
        //     attachments: [{attachmentId:123, fileName:"doc.pdf", fileType:"application/pdf"}]
        //   }
        // ]
        const mapped = data.map((msg) => {
          const isMentor = msg.senderId.toString() === currentUser.id;
          const attachments = (msg.attachments || []).map((att) => ({
            attachmentId: att.attachmentId,
            fileName: att.fileName,
            fileType: att.fileType,
            base64File: null, // not included in server response by default
          }));

          return {
            id: msg.messageId,
            senderId: msg.senderId.toString(),
            sender: isMentor ? currentUser.name : selectedMentee?.name || 'Mentee',
            role: isMentor ? 'mentor' : 'mentee',
            text: msg.messageText,
            timestamp: new Date(msg.timestamp).toLocaleTimeString(),
            attachments,
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
   * 4) Handle sending a message (text or file)
   */
  const handleSendMessage = async () => {
    if (
      (newMessage.trim() || file) &&
      connection &&
      connection.state === signalR.HubConnectionState.Connected &&
      selectedMentee
    ) {
      try {
        const timestamp = new Date().toLocaleTimeString();

        // 1) Upload to server
        const formData = new FormData();
        formData.append('SenderId', parseInt(currentUser.id, 10));
        formData.append('ReceiverId', parseInt(selectedMentee.id, 10));
        formData.append('MessageText', newMessage);
        // If your ModuleId is needed:
        formData.append('ModuleId', 1);

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

        // 2) Fire real-time events
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
          await connection.invoke(
            'SendDirectMessage',
            selectedMentee.id,
            currentUser.id,
            currentUser.name,
            newMessage,
            timestamp
          );
        }

        // 3) Add to local state so we see our own message
        setMentorMessages((prev) => {
          const newEntry = {
            id: Date.now(),
            sender: currentUser.name,
            senderId: currentUser.id,
            role: currentUser.role,
            text: newMessage,
            timestamp,
            attachments: file
              ? [
                  {
                    attachmentId: null, // won't have an ID until re-fetched from server
                    fileName: file.name,
                    fileType: file.type,
                    base64File: null,
                  },
                ]
              : [],
          };

          return {
            ...prev,
            [selectedMentee.id]: [...(prev[selectedMentee.id] || []), newEntry],
          };
        });

        // 4) Reset
        setNewMessage('');
        setReplyTo(null);
        setFile(null);
      } catch (error) {
        console.error('Error sending message:', error);
        alert(`Error sending message: ${error.message}`);
      }
    }
  };

  // 5) File selection
  const handleFileUpload = (event) => {
    const uploadedFile = event.target.files[0];
    if (uploadedFile) {
      setFile(uploadedFile);
    }
  };

  // 6) Reply logic (optional)
  const handleReply = (message) => setReplyTo(message);
  const handleCancelReply = () => setReplyTo(null);
  const handleCancelFile = () => setFile(null);

  // 7) Sidebar / searching
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

  // 8) Download from base64 (only if you want to support that scenario)
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

  // 9) Choose an icon for the file
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
          {selectedMentee &&
            (mentorMessages[selectedMentee.id] || []).map((message) => (
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
                    {message.timestamp}
                  </span>
                </div>

                {/* If you're supporting replies */}
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

                  {/* If the message has attachments, list them */}
                  {message.attachments &&
                    message.attachments.map((att, idx) => {
                      // For real downloads, use get-attachment endpoint
                      const downloadUrl = att.attachmentId
                        ? `https://localhost:7163/api/Messages/get-attachment/${att.attachmentId}`
                        : null;

                      return (
                        <div key={idx} className={styles.mentorDMComponentFileAttachment}>
                          {getFileIcon(att.fileName)}
                          <span className={styles.mentorDMComponentFileName}>
                            {att.fileName || 'Attachment'}
                          </span>

                          {/* If we have an attachmentId, we can link directly to the server */}
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
                            // Or if we only have base64 in real time
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
