import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styles from './ChatBoard.module.css';
import { FaPaperPlane, FaPaperclip, FaReply, FaTimes, FaFilePdf, FaDownload, FaFileAlt, FaEdit, FaTrash } from 'react-icons/fa';

const ChatBoard = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [file, setFile] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [activeUsers, setActiveUsers] = useState([]);
  const [replyTo, setReplyTo] = useState(null);
  const [editingMessage, setEditingMessage] = useState(null); // Track the message being edited
  const { moduleId } = useParams();

  // Dummy user for demonstration (in real use case, this would come from authentication)
  const currentUser = { id: 'currentUserId', name: 'Mentor Mike', role: 'mentor' };

  // Preloaded messages for demonstration purposes
  useEffect(() => {
    setMessages([
      {
        sender: 'Jane Doe',
        senderId: '1',
        role: 'mentee',
        text: 'Hello everyone!',
        id: 1,
        timestamp: '9:00 AM',
      },
      {
        sender: 'John Smith',
        senderId: '2',
        role: 'mentor',
        text: 'Good morning! How can I help you today?',
        id: 2,
        timestamp: '9:05 AM',
      },
      {
        sender: currentUser.name,
        senderId: currentUser.id,
        role: currentUser.role,
        text: 'I need some help with my assignment.',
        id: 3,
        timestamp: '9:10 AM',
      },
      {
        sender: 'Jane Doe',
        senderId: '1',
        role: 'mentee',
        text: 'I also have the same issue!',
        id: 4,
        timestamp: '9:12 AM',
      },
    ]);

    setActiveUsers([
      { id: 1, name: 'Jane Doe', role: 'mentee', online: true },
      { id: 2, name: 'John Smith', role: 'mentor', online: false },
    ]);
  }, []);

  const handleSendMessage = () => {
    if (newMessage.trim() !== '' || file) {
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

      if (editingMessage) {
        setMessages(
          messages.map((msg) => (msg.id === editingMessage.id ? newMsg : msg))
        );
        setEditingMessage(null);
      } else {
        setMessages([...messages, newMsg]);
      }

      setNewMessage('');
      setFile(null);
      setReplyTo(null);
      setIsTyping(false);
    }
  };

  const handleFileUpload = (event) => {
    setFile(event.target.files[0]);
  };

  const handleTyping = (e) => {
    setNewMessage(e.target.value);
    setIsTyping(e.target.value.trim() !== '');
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
    setMessages(messages.filter((msg) => msg.id !== msgId));
  };

  const getFileIcon = (fileName) => {
    const fileExtension = fileName.split('.').pop().toLowerCase();
    switch (fileExtension) {
      case 'pdf':
        return <FaFilePdf className={styles.fileIcon} />;
      default:
        return <FaFileAlt className={styles.fileIcon} />;
    }
  };

  return (
    <div className={styles.chatBoard}>
      <div className={styles.chatSidebar}>
        <ul>
          {activeUsers.map((user) => (
            <li key={user.id} className={user.online ? styles.online : styles.offline}>
              {user.name} ({user.role}) {user.online ? '(Online)' : '(Offline)'}
            </li>
          ))}
        </ul>
      </div>
      <div className={styles.chatMain}>
        <div className={styles.chatHeader}>
          <h2>{moduleId ? moduleId.replace(/[^a-zA-Z ]/g, " ").trim() : "Chat Board"}</h2>
        </div>
        <div className={styles.chatMessages}>
          {messages.map((message) => (
            <div key={message.id} className={`${styles.messageItem} ${message.senderId === currentUser.id ? styles.sent : styles.received}`}>
              <div className={styles.senderInfo}>
                <span className={styles.senderName}>{message.sender} ({message.role})</span>
                <span className={styles.timestamp}>{message.timestamp}</span>
              </div>
              {message.replyTo && (
                <div className={styles.replyTo}>
                  <span className={styles.replySender}>{message.replyTo.sender}:</span> {message.replyTo.text || 'Attachment'}
                </div>
              )}
              <div className={styles.messageText}>
                <p>{message.text}</p>
                {message.fileURL && (
                  <div className={styles.fileAttachment}>
                    {getFileIcon(message.fileName)}
                    <span className={styles.fileName}>{message.fileName}</span>
                    <a href={message.fileURL} download={message.fileName} className={styles.downloadButton}>
                      <FaDownload /> Download
                    </a>
                  </div>
                )}
                <div className={styles.messageActions}>
                  <FaReply className={styles.replyIcon} onClick={() => handleReply(message)} />
                  {message.senderId === currentUser.id && (
                    <>
                      <FaEdit className={styles.editIcon} onClick={() => handleEditMessage(message)} />
                      <FaTrash className={styles.deleteIcon} onClick={() => handleDeleteMessage(message.id)} />
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
          {isTyping && <div className={styles.typingIndicator}>Someone is typing...</div>}
        </div>
        <div className={styles.chatInputArea}>
          {replyTo && (
            <div className={styles.replyBox}>
              <span>Replying to: {replyTo.sender} - {replyTo.text || 'Attachment'}</span>
              <FaTimes className={styles.cancelReplyIcon} onClick={handleCancelReply} />
            </div>
          )}
          {file && (
            <div className={styles.filePreviewBox}>
              <div className={styles.filePreviewContent}>
                <span>File ready to send: </span>
                <p>{file.name}</p>
              </div>
              <FaTimes className={styles.cancelFileIcon} onClick={handleCancelFile} />
            </div>
          )}
          <div className={styles.inputRow}>
            <textarea
              value={newMessage}
              onChange={handleTyping}
              placeholder="Type a message..."
            />
            <label htmlFor="file-upload" className={styles.fileUploadIcon}>
              <FaPaperclip />
            </label>
            <input
              type="file"
              id="file-upload"
              style={{ display: 'none' }}
              onChange={handleFileUpload}
            />
            <button onClick={handleSendMessage}>
              <FaPaperPlane />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatBoard;
