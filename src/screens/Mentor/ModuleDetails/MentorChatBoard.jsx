import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styles from './MentorChatBoard.module.css';
import {
  FaPaperPlane,
  FaPaperclip,
  FaReply,
  FaTimes,
  FaFilePdf,
  FaDownload,
  FaFileAlt,
  FaEdit,
  FaTrash
} from 'react-icons/fa';

const MentorChatBoard = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [file, setFile] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [replyTo, setReplyTo] = useState(null);
  const [editingMessage, setEditingMessage] = useState(null);
  const { moduleId } = useParams();
  const currentUser = { id: 'mentorUserId', name: 'Mentor Mike', role: 'mentor' };

  useEffect(() => {
    setMessages([
      {
        sender: 'Mentee Jane',
        senderId: '1',
        role: 'mentee',
        text: 'I need help with my project.',
        id: 1,
        timestamp: '9:00 AM',
      },
      {
        sender: currentUser.name,
        senderId: currentUser.id,
        role: 'mentor',
        text: 'Sure, how can I assist you?',
        id: 2,
        timestamp: '9:05 AM',
      },
      {
        sender: 'Mentee Alex',
        senderId: '2',
        role: 'mentee',
        text: 'I am facing the same issue!',
        id: 3,
        timestamp: '9:10 AM',
      },
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
    return fileExtension === 'pdf' ? (
      <FaFilePdf className={styles.mentorChatBoardFileIcon} />
    ) : (
      <FaFileAlt className={styles.mentorChatBoardFileIcon} />
    );
  };

  return (
    <div className={styles.mentorChatBoard}>
      <div className={styles.mentorChatBoardMain}>
        <div className={styles.mentorChatBoardHeader}>
          <h2>{moduleId ? moduleId.replace(/[^a-zA-Z ]/g, " ").trim() : "Mentor Chat Board"}</h2>
        </div>
        <div className={styles.mentorChatBoardMessages}>
          {messages.map((message) => (
            <div
              key={message.id}
              className={`${styles.mentorChatBoardMessageItem} ${
                message.senderId === currentUser.id
                  ? styles.mentorChatBoardSent
                  : styles.mentorChatBoardReceived
              }`}
            >
              <div className={styles.mentorChatBoardSenderInfo}>
                <span className={styles.mentorChatBoardSenderName}>
                  {message.sender} ({message.role})
                </span>
                <span className={styles.mentorChatBoardTimestamp}>
                  {message.timestamp}
                </span>
              </div>
              {message.replyTo && (
                <div className={styles.mentorChatBoardReplyTo}>
                  <span className={styles.mentorChatBoardReplySender}>
                    {message.replyTo.sender}:
                  </span>{' '}
                  {message.replyTo.text || 'Attachment'}
                </div>
              )}
              <div className={styles.mentorChatBoardMessageText}>
                <p>{message.text}</p>
                {message.fileURL && (
                  <div className={styles.mentorChatBoardFileAttachment}>
                    {getFileIcon(message.fileName)}
                    <span className={styles.mentorChatBoardFileName}>
                      {message.fileName}
                    </span>
                    <a
                      href={message.fileURL}
                      download={message.fileName}
                      className={styles.mentorChatBoardDownloadButton}
                    >
                      <FaDownload /> Download
                    </a>
                  </div>
                )}
                <div className={styles.mentorChatBoardMessageActions}>
                  <FaReply
                    className={styles.mentorChatBoardReplyIcon}
                    onClick={() => handleReply(message)}
                  />
                  {message.senderId === currentUser.id && (
                    <>
                      <FaEdit
                        className={styles.mentorChatBoardEditIcon}
                        onClick={() => handleEditMessage(message)}
                      />
                      <FaTrash
                        className={styles.mentorChatBoardDeleteIcon}
                        onClick={() => handleDeleteMessage(message.id)}
                      />
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className={styles.mentorChatBoardTypingIndicator}>
              Someone is typing...
            </div>
          )}
        </div>
        <div className={styles.mentorChatBoardInputArea}>
          {replyTo && (
            <div className={styles.mentorChatBoardReplyBox}>
              <span>
                Replying to: {replyTo.sender} - {replyTo.text || 'Attachment'}
              </span>
              <FaTimes
                className={styles.mentorChatBoardCancelReplyIcon}
                onClick={handleCancelReply}
              />
            </div>
          )}
          {file && (
            <div className={styles.mentorChatBoardFilePreviewBox}>
              <div className={styles.mentorChatBoardFilePreviewContent}>
                <span>File ready to send: </span>
                <p>{file.name}</p>
              </div>
              <FaTimes
                className={styles.mentorChatBoardCancelFileIcon}
                onClick={handleCancelFile}
              />
            </div>
          )}
          <div className={styles.mentorChatBoardInputRow}>
            <textarea
              className={styles.mentorChatBoardTextArea}
              value={newMessage}
              onChange={handleTyping}
              placeholder="Type a message..."
            />
            <label
              htmlFor="file-upload"
              className={styles.mentorChatBoardFileUploadIcon}
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
              className={styles.mentorChatBoardButton}
              onClick={handleSendMessage}
            >
              <FaPaperPlane />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MentorChatBoard;
