import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import * as signalR from '@microsoft/signalr';
import styles from './MentorChatBoard.module.css';
import {
  FaPaperPlane,
  FaPaperclip,
  FaReply,
  FaTimes,
  FaFilePdf,
  FaFileAlt,
} from 'react-icons/fa';

const MentorChatBoard = () => {
  const { moduleId: moduleCode } = useParams();
  const [moduleId, setModuleId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [file, setFile] = useState(null);
  const [replyTo, setReplyTo] = useState(null);

  const user = JSON.parse(localStorage.getItem('user'));
  const mentorId = user?.mentorId;
  const mentorName = user?.firstName;

  const currentUser = { id: mentorId, name: mentorName, role: 'mentor' };
  const [connection, setConnection] = useState(null);

  useEffect(() => {
    const selectedModule = JSON.parse(localStorage.getItem('selectedModule'));
    if (selectedModule && selectedModule.moduleCode === moduleCode) {
      setModuleId(selectedModule.moduleId);
    } else {
      console.error('Failed to retrieve module details from localStorage.');
    }
  }, [moduleCode]);

  useEffect(() => {
    if (!moduleId) return;

    const newConnection = new signalR.HubConnectionBuilder()
      .withUrl(`https://localhost:7163/chatBoardHub`)
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Information)
      .build();

    const startConnection = async () => {
      try {
        await newConnection.start();
        console.log(`Connected to ChatBoardHub for moduleId: ${moduleId}`);

        newConnection.on("ReceiveMessage", (module, sender, text, fileName, fileUrl, timestamp, role) => {
          if (module === moduleId) {
            setMessages((prevMessages) => [
              ...prevMessages,
              { sender, text, fileName, fileURL: fileUrl, timestamp, role },
            ]);
          }
        });
      } catch (error) {
        console.error("SignalR connection failed:", error);
      }
    };

    startConnection();
    setConnection(newConnection);

    return () => {
      if (newConnection) newConnection.stop();
    };
  }, [moduleId]);

  const handleSendMessage = async () => {
    if ((newMessage.trim() || file) && connection?.state === signalR.HubConnectionState.Connected) {
      const timestamp = new Date().toLocaleTimeString();
      if (file) {
        const reader = new FileReader();
        reader.onload = async (e) => {
          const fileUrl = e.target.result;
          const fileName = file.name;
          try {
            await connection.invoke("SendFileToModule", moduleId, currentUser.name, fileName, fileUrl, currentUser.role);
            setMessages([
              ...messages,
              {
                sender: currentUser.name,
                fileName,
                fileURL: fileUrl,
                timestamp,
                role: currentUser.role,
              },
            ]);
            setFile(null);
          } catch (err) {
            console.error("Failed to send file:", err);
          }
        };
        reader.readAsDataURL(file);
      } else {
        try {
          await connection.invoke("SendMessageToModule", moduleId, currentUser.name, newMessage, currentUser.role);
          setMessages([
            ...messages,
            { sender: currentUser.name, text: newMessage, timestamp, role: currentUser.role },
          ]);
          setNewMessage('');
        } catch (err) {
          console.error("Failed to send message:", err);
        }
      }
    }
  };

  const handleFileUpload = (event) => {
    const uploadedFile = event.target.files[0];
    if (uploadedFile) {
      setFile(uploadedFile);
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

  const getFileIcon = (fileName) => {
    const fileExtension = fileName.split('.').pop().toLowerCase();
    return fileExtension === 'pdf' ? <FaFilePdf className={styles.mentorChatBoardFileIcon} /> : <FaFileAlt className={styles.mentorChatBoardFileIcon} />;
  };

  return (
    <div className={styles.mentorChatBoard}>
      <div className={styles.mentorChatBoardMain}>
        <div className={styles.mentorChatBoardHeader}>
          <h2>{moduleCode}</h2>
        </div>
        <div className={styles.mentorChatBoardMessages}>
          {messages.map((message, index) => (
            <div
              key={index}
              className={`${styles.mentorChatBoardMessageItem} ${
                message.sender === currentUser.name
                  ? styles.mentorChatBoardSent // Sent messages on the right
                  : styles.mentorChatBoardReceived // Received messages on the left
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
              {message.text && (
                <p className={styles.mentorChatBoardMessageText}>{message.text}</p>
              )}
              {message.fileURL && (
                <div className={styles.mentorChatBoardFileAttachment}>
                  <a href={message.fileURL} target="_blank" rel="noopener noreferrer">
                    {getFileIcon(message.fileName)}
                    <span className={styles.mentorChatBoardFileName}>{message.fileName}</span>
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
        <div className={styles.mentorChatBoardInputArea}>
          {replyTo && (
            <div className={styles.mentorChatBoardReplyBox}>
              <span>
                Replying to: {replyTo.sender} - {replyTo.text || 'Attachment'}
              </span>
              <FaTimes className={styles.mentorChatBoardCancelReplyIcon} onClick={handleCancelReply} />
            </div>
          )}
          {file && (
            <div className={styles.mentorChatBoardFilePreviewBox}>
              <div className={styles.mentorChatBoardFilePreviewContent}>
                <span>File ready to send: </span>
                <p>{file.name}</p>
              </div>
              <FaTimes className={styles.mentorChatBoardCancelFileIcon} onClick={handleCancelFile} />
            </div>
          )}
          <div className={styles.mentorChatBoardInputRow}>
            <textarea
              className={styles.mentorChatBoardTextArea}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
            />
            <label htmlFor="file-upload" className={styles.mentorChatBoardFileUploadIcon}>
              <FaPaperclip />
            </label>
            <input type="file" id="file-upload" style={{ display: 'none' }} onChange={handleFileUpload} />
            <button className={styles.mentorChatBoardButton} onClick={handleSendMessage}>
              <FaPaperPlane />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MentorChatBoard;
