import React, { useState, useEffect } from 'react';
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
  FaSearch
} from 'react-icons/fa';

const MentorDMComponent = () => {
  const [mentorMessages, setMentorMessages] = useState({}); // Messages with mentees
  const [newMessage, setNewMessage] = useState('');
  const [file, setFile] = useState(null);
  const [replyTo, setReplyTo] = useState(null);
  const [editingMessage, setEditingMessage] = useState(null);
  const [mentees, setMentees] = useState([]); // List of mentees
  const [searchTerm, setSearchTerm] = useState(''); // Search term for mentee search
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false); // Sidebar collapse state
  const [selectedMentee, setSelectedMentee] = useState(null); // Store selected mentee
  const { moduleId } = useParams();
  const currentUser = { id: 'currentMentorId', name: 'Mentor John', role: 'mentor' };

  useEffect(() => {
    // Mock data for mentees (this should come from an API or backend)
    setMentees([
      { id: 1, name: 'Mentee Jane', online: true },
      { id: 2, name: 'Mentee Sarah', online: false },
      { id: 3, name: 'Mentee Alex', online: true },
      { id: 4, name: 'Mentee Emma', online: false },
    ]);

    // Initial setup for mentor messages with mentees
    setMentorMessages({
      'Mentee Jane': [
        {
          sender: 'Mentee Jane',
          senderId: '1',
          role: 'mentee',
          text: 'Hello Mentor!',
          id: 1,
          timestamp: '9:00 AM',
        },
        {
          sender: 'Mentor John',
          senderId: 'currentMentorId',
          role: 'mentor',
          text: 'Good morning, how can I assist you today?',
          id: 2,
          timestamp: '9:05 AM',
        }
      ],
      'Mentee Sarah': [
        {
          sender: 'Mentee Sarah',
          senderId: '2',
          role: 'mentee',
          text: 'I need help with my assignment.',
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
        updatedMessages[selectedMentee] = updatedMessages[selectedMentee].map((msg) =>
          msg.id === editingMessage.id ? newMsg : msg
        );
        setEditingMessage(null);
      } else {
        // Add new message to the selected mentee's chat
        updatedMessages[selectedMentee] = [...(updatedMessages[selectedMentee] || []), newMsg];
      }

      setMentorMessages(updatedMessages);
      setNewMessage('');
      setFile(null);
      setReplyTo(null);
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
    updatedMessages[selectedMentee] = updatedMessages[selectedMentee].filter((msg) => msg.id !== msgId);
    setMentorMessages(updatedMessages);
  };

  const getFileIcon = (fileName) => {
    const fileExtension = fileName.split('.').pop().toLowerCase();
    return fileExtension === 'pdf' ? <FaFilePdf className={styles.mentorDMComponentFileIcon} /> : <FaFileAlt className={styles.mentorDMComponentFileIcon} />;
  };

  // Filter mentees based on the search term
  const filteredMentees = mentees.filter((mentee) =>
    mentee.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSidebarDoubleClick = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  // Handle mentee selection
  const handleMenteeClick = (menteeName) => {
    setSelectedMentee(menteeName); // Set selected mentee for the header and chat
    setNewMessage(''); // Reset new message input
  };

  return (
    <div className={styles.mentorDMComponentPage}>
      {/* Sidebar for mentees */}
      <div
        className={`${styles.mentorDMComponentSidebar} ${isSidebarCollapsed ? styles.mentorDMComponentSidebarCollapsed : ''}`}
        onDoubleClick={handleSidebarDoubleClick}
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
            <li key={mentee.id} className={styles.mentorDMComponentMenteeItem} onClick={() => handleMenteeClick(mentee.name)}>
              <span className={mentee.online ? styles.mentorDMComponentOnline : styles.mentorDMComponentOffline}>
                {mentee.name}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Main chat area */}
      <div className={styles.mentorDMComponentMain}>
        <div className={styles.mentorDMComponentHeader}>
          <h2>{selectedMentee ? selectedMentee : 'Select a Mentee'}</h2> {/* Update header with mentee name */}
        </div>
        <div className={styles.mentorDMComponentMessages}>
          {selectedMentee &&
            (mentorMessages[selectedMentee] || []).map((message) => (
              <div
                key={message.id}
                className={`${styles.mentorDMComponentMessageItem} ${message.senderId === currentUser.id ? styles.mentorDMComponentSent : styles.mentorDMComponentReceived}`}
              >
                <div className={styles.mentorDMComponentSenderInfo}>
                  <span className={styles.mentorDMComponentSenderName}>
                    {message.sender} ({message.role})
                  </span>
                  <span className={styles.mentorDMComponentTimestamp}>{message.timestamp}</span>
                </div>
                {message.replyTo && (
                  <div className={styles.mentorDMComponentReplyTo}>
                    <span className={styles.mentorDMComponentReplySender}>{message.replyTo.sender}:</span>{' '}
                    {message.replyTo.text || 'Attachment'}
                  </div>
                )}
                <div className={styles.mentorDMComponentMessageText}>
                  <p>{message.text}</p>
                  {message.fileURL && (
                    <div className={styles.mentorDMComponentFileAttachment}>
                      {getFileIcon(message.fileName)}
                      <span className={styles.mentorDMComponentFileName}>{message.fileName}</span>
                      <a href={message.fileURL} download={message.fileName} className={styles.mentorDMComponentDownloadButton}>
                        <FaDownload /> Download
                      </a>
                    </div>
                  )}
                  <div className={styles.mentorDMComponentMessageActions}>
                    <FaReply className={styles.mentorDMComponentReplyIcon} onClick={() => handleReply(message)} />
                    {message.senderId === currentUser.id && (
                      <>
                        <FaEdit className={styles.mentorDMComponentEditIcon} onClick={() => handleEditMessage(message)} />
                        <FaTrash className={styles.mentorDMComponentDeleteIcon} onClick={() => handleDeleteMessage(message.id)} />
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
        </div>
        <div className={styles.mentorDMComponentInputArea}>
          {replyTo && (
            <div className={styles.mentorDMComponentReplyBox}>
              <span>
                Replying to: {replyTo.sender} - {replyTo.text || 'Attachment'}
              </span>
              <FaTimes className={styles.mentorDMComponentCancelReplyIcon} onClick={handleCancelReply} />
            </div>
          )}
          {file && (
            <div className={styles.mentorDMComponentFilePreviewBox}>
              <div className={styles.mentorDMComponentFilePreviewContent}>
                <span>File ready to send: </span>
                <p>{file.name}</p>
              </div>
              <FaTimes className={styles.mentorDMComponentCancelFileIcon} onClick={handleCancelFile} />
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
            <button className={styles.mentorDMComponentButton} onClick={handleSendMessage} disabled={!newMessage.trim() && !file}>
              <FaPaperPlane />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MentorDMComponent;
