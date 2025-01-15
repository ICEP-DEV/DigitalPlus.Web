import React, { useState, useEffect } from 'react';
import * as signalR from '@microsoft/signalr';
import { useParams } from 'react-router-dom';
import styles from './DmPage.module.css';
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

const DMComponent = () => {
  const [connection, setConnection] = useState(null);
  const [mentorMessages, setMentorMessages] = useState({});
  const [newMessage, setNewMessage] = useState('');
  const [file, setFile] = useState(null);
  const [replyTo, setReplyTo] = useState(null);
  const [editingMessage, setEditingMessage] = useState(null);
  const [mentors, setMentors] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [selectedMentor, setSelectedMentor] = useState(null);

  const { moduleId } = useParams();

  // Get current user (Mentee) from localStorage
  const user = JSON.parse(localStorage.getItem('user')) || {};
  const currentUser = {
    id: (user.mentee_Id || 0).toString(),
    name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Unknown Mentee',
    role: 'mentee',
  };

  /**
   * 1) Fetch Mentors for this module
   */
  useEffect(() => {
    const fetchMentors = async () => {
      try {
        // We can read the moduleId from localStorage if needed
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
            online: false, // or true if your API includes an online/offline status
          }))
        );
      } catch (error) {
        console.error('Error fetching mentors:', error);
      }
    };

    // Only fetch if moduleId is present
    if (moduleId) {
      fetchMentors();
    }
  }, [moduleId]);

  // Debugging: see the mentors
  useEffect(() => {
    if (mentors.length > 0) {
      console.log('Mentor IDs:');
      mentors.forEach((mentor) => console.log(`Mentor ID: ${mentor.id}`));
    }
  }, [mentors]);

  /**
   * 2) Set up the SignalR connection
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

        // Handle receiving a text message
        newConnection.on(
          'ReceiveDirectMessage',
          (senderUserId, senderName, message, timestamp) => {
            // If it's from the currently-selected mentor, add to local state
            if (selectedMentor && senderUserId === selectedMentor.id) {
              setMentorMessages((prev) => ({
                ...prev,
                [selectedMentor.id]: [
                  ...(prev[selectedMentor.id] || []),
                  {
                    id: Date.now(),
                    sender: senderName,
                    text: message,
                    timestamp,
                    senderId: senderUserId,
                    role: 'mentor', // because the sender is the mentor
                  },
                ],
              }));
            }
          }
        );

        // Handle receiving a file message
        newConnection.on(
          'ReceiveFileMessage',
          (senderUserId, senderName, base64File, fileType, timestamp, fileName) => {
            if (selectedMentor && senderUserId === selectedMentor.id) {
              setMentorMessages((prev) => ({
                ...prev,
                [selectedMentor.id]: [
                  ...(prev[selectedMentor.id] || []),
                  {
                    id: Date.now(),
                    sender: senderName,
                    text: '[File Received]',
                    base64File,
                    fileType,
                    timestamp,
                    isFile: true,
                    senderId: senderUserId,
                    role: 'mentor',
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

    // Cleanup on unmount
    return () => {
      if (newConnection) newConnection.stop();
    };
  }, [selectedMentor, currentUser.id]);

  /**
   * 3) Fetch existing messages whenever we select a mentor
   */
  useEffect(() => {
    if (!selectedMentor) return;

    const fetchMessages = async () => {
      try {
        // GET all messages between this Mentee (currentUser) and the selected Mentor
        const url = `https://localhost:7163/api/Messages/get-messages/${currentUser.id}/${selectedMentor.id}`;
        const response = await fetch(url);
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(errorText || 'Failed to fetch messages');
        }

        const data = await response.json();
        // data might look like:
        // [
        //   {
        //     messageId: 29,
        //     senderId: 123,
        //     receiverId: 456,
        //     messageText: "Hello Mentee",
        //     timestamp: "2025-01-10T14:45:24.1308853",
        //     ...
        //   }
        // ]

        // Convert them to the shape we use in local state
        const mapped = data.map((msg) => {
          const isCurrentUser = msg.senderId.toString() === currentUser.id;
          return {
            id: msg.messageId,
            senderId: msg.senderId.toString(),
            sender: isCurrentUser ? currentUser.name : selectedMentor.name,
            role: isCurrentUser ? 'mentee' : 'mentor',
            text: msg.messageText,
            timestamp: new Date(msg.timestamp).toLocaleTimeString(), 
            isFile: !!msg.filePath, // or any logic that your back-end uses
            fileType: msg.fileType || null,
            fileName: msg.fileName || null,
            base64File: null, // fill if your API returns base64 data
          };
        });

        // Put them under the selected mentor's ID
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
   * 4) Sending a message (POST) to the server
   */
  const handleSendMessage = async () => {
    if (
      (newMessage.trim() || file) &&
      connection &&
      connection.state === signalR.HubConnectionState.Connected &&
      selectedMentor
    ) {
      const timestamp = new Date().toLocaleTimeString();

      try {
        // 1) Build FormData for the .NET back-end [FromForm]
        const formData = new FormData();
        formData.append('SenderId', parseInt(currentUser.id, 10));
        formData.append('ReceiverId', parseInt(selectedMentor.id, 10));
        formData.append('MessageText', newMessage);

        // If your server expects a numeric moduleId
        const numericModuleId = moduleId ? parseInt(moduleId, 10) : 1;
        formData.append('ModuleId',1);

        // If a file was selected
        if (file) {
          formData.append('File', file);
        }

        // 2) POST to your backend
        const postResponse = await fetch('https://localhost:7163/api/Messages/send-message', {
          method: 'POST',
          body: formData,
        });

        if (!postResponse.ok) {
          const errorText = await postResponse.text();
          console.error('Server responded with error:', postResponse.status, errorText);
          alert(`Error sending message: ${errorText}`);
          return;
        }

        // 3) SignalR broadcast so the Mentor sees it in real time
        if (file) {
          // Convert the file to base64 for real-time
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
          // Text-only
          await connection.invoke(
            'SendDirectMessage',
            selectedMentor.id,
            currentUser.id,
            currentUser.name,
            newMessage,
            timestamp
          );
        }

        // 4) Update local state so we see our own message instantly
        setMentorMessages((prev) => ({
          ...prev,
          [selectedMentor.id]: [
            ...(prev[selectedMentor.id] || []),
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

        // Reset input
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
    if (uploadedFile) setFile(uploadedFile);
  };

  // For replies (optional)
  const handleReply = (message) => setReplyTo(message);
  const handleCancelReply = () => setReplyTo(null);
  const handleCancelFile = () => setFile(null);
  const handleSidebarToggle = () => setIsSidebarCollapsed(!isSidebarCollapsed);

  // When user clicks a mentor in the sidebar
  const handleMentorClick = (mentor) => {
    setSelectedMentor(mentor);
    setNewMessage('');
    setReplyTo(null);
  };

  // File download helper
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
      // If you want an inline image preview, that would be different logic.
      // For now, we just show a generic "file" icon or an image icon:
      return <FaFileAlt className={styles.dmFileIcon} />;
    } else if (fileExtension === 'pdf') {
      return <FaFilePdf className={styles.dmFileIcon} />;
    } else {
      return <FaFileAlt className={styles.dmFileIcon} />;
    }
  };

  // Filter mentors by search
  const filteredMentors = mentors.filter((mentor) =>
    mentor.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        <div className={styles.dmMessages}>
          {selectedMentor &&
            (mentorMessages[selectedMentor.id] || []).map((message) => (
              <div
                key={message.id}
                className={`${styles.dmMessageItem} ${
                  // If the message's senderId is the current user (mentee),
                  // show it on the right. Otherwise, on the left.
                  message.senderId === currentUser.id ? styles.dmSent : styles.dmReceived
                }`}
              >
                <div className={styles.dmSenderInfo}>
                  <span className={styles.dmSenderName}>
                    {message.sender} ({message.role})
                  </span>
                  <span className={styles.dmTimestamp}>{message.timestamp}</span>
                </div>
                {message.replyTo && (
                  <div className={styles.dmReplyTo}>
                    <span className={styles.dmReplySender}>{message.replyTo.sender}:</span>{' '}
                    {message.replyTo.text || 'Attachment'}
                  </div>
                )}
                <div className={styles.dmMessageText}>
                  <p>{message.text}</p>
                  {message.isFile && (
                    <div className={styles.dmFileAttachment}>
                      {getFileIcon(message.fileName || 'file')}
                      <span className={styles.dmFileName}>
                        {message.fileName || 'Attachment'}
                      </span>
                      {/* If you have base64 file content, show a download button */}
                      {message.base64File && (
                        <button
                          onClick={() =>
                            downloadFile(message.base64File, message.fileName, message.fileType)
                          }
                          className={styles.dmDownloadButton}
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
        <div className={styles.dmInputArea}>
          {replyTo && (
            <div className={styles.dmReplyBox}>
              <span>
                Replying to: {replyTo.sender} - {replyTo.text || 'Attachment'}
              </span>
              <FaTimes className={styles.dmCancelReplyIcon} onClick={handleCancelReply} />
            </div>
          )}
          {file && (
            <div className={styles.dmFilePreviewBox}>
              <div className={styles.dmFilePreviewContent}>
                <span>File ready to send:</span>
                <p>{file.name}</p>
              </div>
              <FaTimes className={styles.dmCancelFileIcon} onClick={handleCancelFile} />
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
