import React, { useState, useEffect } from 'react';
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
  FaSearch
} from 'react-icons/fa';

const DMComponent = () => {
  const [mentorMessages, setMentorMessages] = useState({}); // Messages for each mentor
  const [newMessage, setNewMessage] = useState('');
  const [file, setFile] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [replyTo, setReplyTo] = useState(null);
  const [editingMessage, setEditingMessage] = useState(null);
  const [mentors, setMentors] = useState([]); // List of mentors for the module
  const [searchTerm, setSearchTerm] = useState(''); // Search term for mentor search
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false); // Sidebar collapse state
  const [selectedMentor, setSelectedMentor] = useState(null); // Store selected mentor
  const { moduleId } = useParams();
  const currentUser = { id: 'currentUserId', name: 'Mentor Mike', role: 'mentor' };

  useEffect(() => {
    // Mock data for mentors (this should come from an API or backend)
    setMentors([
      { id: 1, name: 'Mentor John', online: true },
      { id: 2, name: 'Mentor Sarah', online: false },
      { id: 3, name: 'Mentor Alex', online: true },
      { id: 4, name: 'Mentor Emma', online: false },
    ]);

    // Initial setup for mentor messages
    setMentorMessages({
      'Mentor John': [
        {
          sender: 'Jane Doe',
          senderId: '1',
          role: 'mentee',
          text: 'Hello everyone!',
          id: 1,
          timestamp: '9:00 AM',
        },
        {
          sender: 'Mentor John',
          senderId: '1',
          role: 'mentor',
          text: 'Good morning! How can I help you today?',
          id: 2,
          timestamp: '9:05 AM',
        }
      ],
      'Mentor Sarah': [
        {
          sender: 'Jane Doe',
          senderId: '1',
          role: 'mentee',
          text: 'Can you help with my assignment?',
          id: 3,
          timestamp: '9:30 AM',
        }
      ],
    });
  }, []);

  const handleSendMessage = () => {
    if (newMessage.trim() || file) {
      const newMsg = {
        sender: currentUser.name,
        senderId: currentUser.id,
        role: currentUser.role,
        text: newMessage,
        fileURL: file ? URL.createObjectURL(file) : '',
        fileName: file ? file.name : '',
        type: file ? file.type.split('/')[0] : null,
        id: editingMessage ? editingMessage.id : Date.now(),
        timestamp: new Date().toLocaleTimeString(),
        replyTo: replyTo,
      };

      const updatedMessages = { ...mentorMessages };
      if (editingMessage) {
        // Update existing message if editing
        updatedMessages[selectedMentor] = updatedMessages[selectedMentor].map((msg) =>
          msg.id === editingMessage.id ? newMsg : msg
        );
        setEditingMessage(null);
      } else {
        // Add new message to the selected mentor's chat
        updatedMessages[selectedMentor] = [...(updatedMessages[selectedMentor] || []), newMsg];
      }

      setMentorMessages(updatedMessages);
      setNewMessage('');
      setFile(null);
      setReplyTo(null);
      setIsTyping(false);
    }
  };

  const handleFileUpload = (event) => {
    const uploadedFile = event.target.files[0];
    if (uploadedFile && uploadedFile.size < 5 * 1024 * 1024) {
      // Allow files less than 5MB
      setFile(uploadedFile);
    } else {
      alert('File size must be less than 5MB');
      setFile(null);
    }
  };

  const handleReply = (message) => {
    setReplyTo(message);
  };

  const handleCancelReply = () => {
    setReplyTo(null);
  };

  const handleCancelFile = () => {
    setFile(null);
  };

  const handleEditMessage = (message) => {
    setNewMessage(message.text);
    setEditingMessage(message);
    setFile(message.fileName ? { name: message.fileName } : null);
  };

  const handleDeleteMessage = (msgId) => {
    const updatedMessages = { ...mentorMessages };
    updatedMessages[selectedMentor] = updatedMessages[selectedMentor].filter((msg) => msg.id !== msgId);
    setMentorMessages(updatedMessages);
  };

  const getFileIcon = (fileName) => {
    const fileExtension = fileName.split('.').pop().toLowerCase();
    return fileExtension === 'pdf' ? <FaFilePdf className={styles.dmFileIcon} /> : <FaFileAlt className={styles.dmFileIcon} />;
  };

  // Filter mentors based on the search term
  const filteredMentors = mentors.filter((mentor) =>
    mentor.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSidebarDoubleClick = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  // Handle mentor selection
  const handleMentorClick = (mentorName) => {
    setSelectedMentor(mentorName); // Set selected mentor for the header and chat
    setNewMessage(''); // Reset new message input
  };

  return (
    <div className={styles.dmPage}>
      {/* Sidebar for mentors */}
      <div
        className={`${styles.dmPageSidebar} ${isSidebarCollapsed ? styles.dmSidebarCollapsed : ''}`}
        onDoubleClick={handleSidebarDoubleClick}
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
            <li key={mentor.id} className={styles.dmMentorItem} onClick={() => handleMentorClick(mentor.name)}>
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
          <h2>{selectedMentor ? selectedMentor : 'Direct Message'}</h2> {/* Update header with mentor name */}
        </div>
        <div className={styles.dmMessages}>
          {selectedMentor &&
            (mentorMessages[selectedMentor] || []).map((message) => (
              <div
                key={message.id}
                className={`${styles.dmMessageItem} ${message.senderId === currentUser.id ? styles.dmSent : styles.dmReceived}`}
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
                  {message.fileURL && (
                    <div className={styles.dmFileAttachment}>
                      {getFileIcon(message.fileName)}
                      <span className={styles.dmFileName}>{message.fileName}</span>
                      <a href={message.fileURL} download={message.fileName} className={styles.dmDownloadButton}>
                        <FaDownload /> Download
                      </a>
                    </div>
                  )}
                  <div className={styles.dmMessageActions}>
                    <FaReply className={styles.dmReplyIcon} onClick={() => handleReply(message)} />
                    {message.senderId === currentUser.id && (
                      <>
                        <FaEdit className={styles.dmEditIcon} onClick={() => handleEditMessage(message)} />
                        <FaTrash className={styles.dmDeleteIcon} onClick={() => handleDeleteMessage(message.id)} />
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          {isTyping && <div className={styles.dmTypingIndicator}>Someone is typing...</div>}
        </div>
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
                <span>File ready to send: </span>
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
            <button className={styles.dmButton} onClick={handleSendMessage} disabled={!newMessage.trim() && !file}>
              <FaPaperPlane />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DMComponent;
