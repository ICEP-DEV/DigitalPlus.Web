import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; // Removed useLocation as we're relying on localStorage
import * as signalR from '@microsoft/signalr';
import styles from './ChatBoard.module.css';
import {
  FaPaperPlane,
  FaPaperclip,
  FaReply,
  FaTimes,
  FaFilePdf,
  FaFileAlt,
} from 'react-icons/fa';

const ChatBoard = () => {
  const { moduleId: moduleCode } = useParams(); // `moduleCode` from the URL
  const [moduleId, setModuleId] = useState(null); // State for moduleId
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [file, setFile] = useState(null);
  const [replyTo, setReplyTo] = useState(null);

  const user = JSON.parse(localStorage.getItem('user'));
  const menteeId = user?.mentee_Id;
  const menteeName = user?.firstName;

  const currentUser = { id: menteeId, name: menteeName, role: 'mentee' };
  const [connection, setConnection] = useState(null);

  useEffect(() => {
    // Retrieve module details from localStorage
    const selectedModule = JSON.parse(localStorage.getItem('selectedModule'));
    if (selectedModule && selectedModule.moduleCode === moduleCode) {
      setModuleId(selectedModule.moduleId);
      console.log('Retrieved moduleId from localStorage:', selectedModule.moduleId);
    } else {
      console.error('Failed to retrieve module details from localStorage.');
    }
  }, [moduleCode]);

  useEffect(() => {
    if (!moduleId) {
      console.error("Module ID is missing. Unable to establish SignalR connection.");
      return;
    }

    const newConnection = new signalR.HubConnectionBuilder()
      .withUrl(`https://localhost:7163/chatBoardHub`)
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Information)
      .build();

    const startConnection = async () => {
      try {
        await newConnection.start();
        console.log(`Connected to ChatBoardHub for moduleId: ${moduleId}`);

        // Listen for incoming messages
        newConnection.on("ReceiveMessage", (module, user, text, fileName, fileUrl, timestamp) => {
          if (module === moduleId) {
            setMessages((prevMessages) => [
              ...prevMessages,
              { sender: user, text, fileName, fileURL: fileUrl, timestamp },
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
            await connection.invoke("SendFileToModule", moduleId, currentUser.name, fileName, fileUrl);
            setMessages([
              ...messages,
              {
                sender: currentUser.name,
                fileName,
                fileURL: fileUrl,
                timestamp,
              },
            ]);
            setFile(null); // Clear the file input after sending
          } catch (err) {
            console.error("Failed to send file:", err);
          }
        };
        reader.readAsDataURL(file);
      } else {
        try {
          await connection.invoke("SendMessageToModule", moduleId, currentUser.name, newMessage);
          setMessages([
            ...messages,
            { sender: currentUser.name, text: newMessage, timestamp },
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
    return fileExtension === 'pdf' ? <FaFilePdf className={styles.chatBoardFileIcon} /> : <FaFileAlt className={styles.chatBoardFileIcon} />;
  };

  return (
    <div className={styles.chatBoard}>
      <div className={styles.chatBoardMain}>
        <div className={styles.chatBoardHeader}>
          <h2>{moduleCode}</h2> {/* Display module_Code in the header */}
        </div>
        <div className={styles.chatBoardMessages}>
          {messages.map((message, index) => (
            <div
              key={index}
              className={`${styles.chatBoardMessageItem} ${
                message.sender === currentUser.name
                  ? styles.chatBoardSent
                  : styles.chatBoardReceived
              }`}
            >
              <div className={styles.chatBoardSenderInfo}>
                <span className={styles.chatBoardSenderName}>{message.sender}</span>
                <span className={styles.chatBoardTimestamp}>{message.timestamp}</span>
              </div>
              {message.text && <p className={styles.chatBoardMessageText}>{message.text}</p>}
              {message.fileURL && (
                <div className={styles.chatBoardFileAttachment}>
                  <a href={message.fileURL} target="_blank" rel="noopener noreferrer">
                    {getFileIcon(message.fileName)}
                    <span className={styles.chatBoardFileName}>{message.fileName}</span>
                  </a>
                </div>
              )}
            </div>
          ))}
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
            <textarea
              className={styles.chatBoardTextArea}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
            />
            <label htmlFor="file-upload" className={styles.chatBoardFileUploadIcon}>
              <FaPaperclip />
            </label>
            <input type="file" id="file-upload" style={{ display: 'none' }} onChange={handleFileUpload} />
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
