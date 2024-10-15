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
        return <FaFilePdf className={styles.chatBoardFileIcon} />;
      default:
        return <FaFileAlt className={styles.chatBoardFileIcon} />;
    }
  };

  return (
    <div className={styles.chatBoard}>
    
      <div className={styles.chatBoardMain}>
        <div className={styles.chatBoardHeader}>
          <h2>{moduleId ? moduleId.replace(/[^a-zA-Z ]/g, " ").trim() : "Chat Board"}</h2>
        </div>
        <div className={styles.chatBoardMessages}>
          {messages.map((message) => (
            <div key={message.id} className={`${styles.chatBoardMessageItem} ${message.senderId === currentUser.id ? styles.chatBoardSent : styles.chatBoardReceived}`}>
              <div className={styles.chatBoardSenderInfo}>
                <span className={styles.chatBoardSenderName}>{message.sender} ({message.role})</span>
                <span className={styles.chatBoardTimestamp}>{message.timestamp}</span>
              </div>
              {message.replyTo && (
                <div className={styles.chatBoardReplyTo}>
                  <span className={styles.chatBoardReplySender}>{message.replyTo.sender}:</span> {message.replyTo.text || 'Attachment'}
                </div>
              )}
              <div className={styles.chatBoardMessageText}>
                <p>{message.text}</p>
                {message.fileURL && (
                  <div className={styles.chatBoardFileAttachment}>
                    {getFileIcon(message.fileName)}
                    <span className={styles.chatBoardFileName}>{message.fileName}</span>
                    <a href={message.fileURL} download={message.fileName} className={styles.chatBoardDownloadButton}>
                      <FaDownload /> Download
                    </a>
                  </div>
                )}
                <div className={styles.chatBoardMessageActions}>
                  <FaReply className={styles.chatBoardReplyIcon} onClick={() => handleReply(message)} />
                  {message.senderId === currentUser.id && (
                    <>
                      <FaEdit className={styles.chatBoardEditIcon} onClick={() => handleEditMessage(message)} />
                      <FaTrash className={styles.chatBoardDeleteIcon} onClick={() => handleDeleteMessage(message.id)} />
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
          {isTyping && <div className={styles.chatBoardTypingIndicator}>Someone is typing...</div>}
        </div>
        <div className={styles.chatBoardInputArea}>
          {replyTo && (
            <div className={styles.chatBoardReplyBox}>
              <span>Replying to: {replyTo.sender} - {replyTo.text || 'Attachment'}</span>
              <FaTimes className={styles.chatBoardCancelReplyIcon} onClick={handleCancelReply} />
            </div>
          )}
          {file && (
            <div className={styles.chatBoardFilePreviewBox}>
              <div className={styles.chatBoardFilePreviewContent}>
                <span>File ready to send: </span>
                <p>{file.name}</p>
              </div>
              <FaTimes className={styles.chatBoardCancelFileIcon} onClick={handleCancelFile} />
            </div>
          )}
          <div className={styles.chatBoardInputRow}>
            <textarea className={styles.chatBoardTextArea}
              value={newMessage}
              onChange={handleTyping}
              placeholder="Type a message..."
            />
            <label htmlFor="file-upload" className={styles.chatBoardFileUploadIcon}>
              <FaPaperclip />
            </label>
            <input
              type="file"
              id="file-upload"
              style={{ display: 'none' }}
              onChange={handleFileUpload}
            />
            <button className={styles.chatBoardButton} onClick={handleSendMessage}>
              <FaPaperPlane />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatBoard;
