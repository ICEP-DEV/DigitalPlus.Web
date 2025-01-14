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
   * Fetch Mentees for this module
   */
  useEffect(() => {
    const fetchMentees = async () => {
      try {
        // Check localStorage for "selectedModule"
        const storedModule = localStorage.getItem('selectedModule');
        let actualModuleId = moduleId; // from URL params, if any

        if (storedModule) {
          // e.g. storedModule = '{"moduleId":123}'
          const parsed = JSON.parse(storedModule);
          // If there's a property called moduleId, override
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

  // Debugging
  useEffect(() => {
    if (mentees.length > 0) {
      console.log('Mentee IDs:');
      mentees.forEach((mentee) => console.log(`Mentee ID: ${mentee.id}`));
    }
  }, [mentees]);

  /**
   * Set up the SignalR connection
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

        newConnection.on(
          'ReceiveDirectMessage',
          (senderUserId, senderName, message, timestamp) => {
            // If the message is from the currently selected mentee,
            // push it into the conversation.
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
                  },
                ],
              }));
            }
          }
        );

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
                    base64File,
                    fileType,
                    timestamp,
                    isFile: true,
                    senderId: senderUserId,
                    role: 'mentee',
                    fileName,
                  },
                ],
              }));
            }
          }
        );

        setConnection(newConnection);
      })
      .catch((err) => console.error('Connection failed:', err));

    // Cleanup
    return () => {
      if (newConnection) newConnection.stop();
    };
  }, [selectedMentee, currentUser.id]);

  /**
   * Fetch existing messages whenever a new mentee is selected
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
        // Map server response to local shape
        const mapped = data.map((msg) => ({
          id: msg.messageId,
          senderId: msg.senderId.toString(),
          sender:
            msg.senderId.toString() === currentUser.id
              ? currentUser.name
              : selectedMentee?.name || 'Mentee',
          role: msg.senderId.toString() === currentUser.id ? 'mentor' : 'mentee',
          text: msg.messageText,
          timestamp: new Date(msg.timestamp).toLocaleTimeString(),
          // If your server includes file fields:
          isFile: !!msg.filePath,
          fileType: msg.fileType || null,
          fileName: msg.fileName || null,
          base64File: null, // or if you store base64 in your DB, populate it
        }));

        // Put them in the state under the mentee’s ID
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
   * Handle sending a message via FormData
   */
  const handleSendMessage = async () => {
    if (
      (newMessage.trim() || file) &&
      connection &&
      connection.state === signalR.HubConnectionState.Connected &&
      selectedMentee
    ) {
      const timestamp = new Date().toLocaleTimeString();

      try {
        // 1) Build FormData for [FromForm] on .NET
        const formData = new FormData();
        formData.append('SenderId', parseInt(currentUser.id, 10));
        formData.append('ReceiverId', parseInt(selectedMentee.id, 10));
        formData.append('MessageText', newMessage);

        
        formData.append('ModuleId', 1);

        // If a file was selected
        if (file) {
          formData.append('File', file); // must match your DTO property
        }

        // 2) POST to your back-end
        const response = await fetch(
          'https://localhost:7163/api/Messages/send-message',
          {
            method: 'POST',
            body: formData,
          }
        );

        if (!response.ok) {
          const errorText = await response.text();
          console.error('Server responded with error:', response.status, errorText);
          alert(`Error sending message: ${errorText}`);
          return;
        }

        // 3) Fire SignalR so the mentee sees it in real time
        if (file) {
          // Convert file to base64
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
          // Text-only
          await connection.invoke(
            'SendDirectMessage',
            selectedMentee.id,
            currentUser.id,
            currentUser.name,
            newMessage,
            timestamp
          );
        }

        // 4) Update local message state so Mentor sees their own message
        setMentorMessages((prev) => ({
          ...prev,
          [selectedMentee.id]: [
            ...(prev[selectedMentee.id] || []),
            {
              id: Date.now(),
              sender: currentUser.name,
              senderId: currentUser.id,
              role: currentUser.role,
              text: newMessage,
              timestamp,
              isFile: !!file,
              fileType: file ? file.type : null,
              fileName: file ? file.name : null,
            },
          ],
        }));

        // Reset
        setNewMessage('');
        setReplyTo(null);
        setFile(null);
      } catch (error) {
        console.error('Error sending message:', error);
        alert(`Error sending message: ${error.message}`);
      }
    }
  };

  // Handle file selection
  const handleFileUpload = (event) => {
    const uploadedFile = event.target.files[0];
    if (uploadedFile) {
      setFile(uploadedFile);
    }
  };

  const handleReply = (message) => setReplyTo(message);
  const handleCancelReply = () => setReplyTo(null);
  const handleCancelFile = () => setFile(null);
  const handleSidebarToggle = () => setIsSidebarCollapsed(!isSidebarCollapsed);

  const handleMenteeClick = (mentee) => {
    setSelectedMentee(mentee);
    setNewMessage('');
    setReplyTo(null);
  };

  // Helper: Download file from base64 data
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

  // Choose an icon for the file
  const getFileIcon = (fileName) => {
    const fileExtension = fileName.split('.').pop().toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif'].includes(fileExtension)) {
      return <FaFileAlt className={styles.dmFileIcon} />;
    } else if (fileExtension === 'pdf') {
      return <FaFilePdf className={styles.dmFileIcon} />;
    } else {
      return <FaFileAlt className={styles.dmFileIcon} />;
    }
  };

  const filteredMentees = mentees.filter((mentee) =>
    mentee.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
                  {message.isFile && (
                    <div className={styles.mentorDMComponentFileAttachment}>
                      {getFileIcon(message.fileName || 'file')}
                      <span className={styles.mentorDMComponentFileName}>
                        {message.fileName || 'Attachment'}
                      </span>
                      {/* Download button (for base64 data in state) */}
                      {message.base64File && (
                        <button
                          onClick={() =>
                            downloadFile(
                              message.base64File,
                              message.fileName,
                              message.fileType
                            )
                          }
                          className={styles.mentorDMComponentDownloadButton}
                        >
                          <FaDownload /> Download
                        </button>
                      )}
                    </div>
                  )}
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
            <label
              htmlFor="file-upload"
              className={styles.mentorDMComponentFileUploadIcon}
            >
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
