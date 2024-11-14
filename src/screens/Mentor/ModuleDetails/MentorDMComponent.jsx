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
  FaSearch
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

  const currentUser = { id: 'mentor1', name: 'Mentor John', role: 'mentor' };

  useEffect(() => {
    setMentees([
      { id: 'mentee1', name: 'Mentee Jane', online: true },
      { id: 'mentee2', name: 'Mentee Sarah', online: false },
      { id: 'mentee3', name: 'Mentee Alex', online: true },
      { id: 'mentee4', name: 'Mentee Emma', online: false },
    ]);

    setMentorMessages({
      'mentee1': [
        { id: 1, sender: 'Mentee Jane', senderId: 'mentee1', role: 'mentee', text: 'Hello Mentor!', timestamp: '9:00 AM' },
        { id: 2, sender: 'Mentor John', senderId: 'mentor123', role: 'mentor', text: 'Good morning, how can I assist you today?', timestamp: '9:05 AM' }
      ],
    });

    const newConnection = new signalR.HubConnectionBuilder()
      .withUrl(`https://localhost:7163/communicationHub?userId=${currentUser.id}`, {
        transport: signalR.HttpTransportType.WebSockets
      })
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Information)
      .build();

    newConnection.start()
      .then(() => {
        console.log('Connected to SignalR hub as Mentor');

        newConnection.on('ReceiveDirectMessage', (senderUserId, senderName, message, timestamp) => {
          if (selectedMentee) {
            setMentorMessages(prevMessages => ({
              ...prevMessages,
              [selectedMentee.id]: [
                ...(prevMessages[selectedMentee.id] || []),
                { id: Date.now(), sender: senderName, text: message, timestamp, senderId: senderUserId, role: 'mentee' }
              ]
            }));
          }
        });

        newConnection.on('ReceiveFileMessage', (senderUserId, senderName, base64File, fileType, timestamp, fileName) => {
          if (selectedMentee) {
            setMentorMessages(prevMessages => ({
              ...prevMessages,
              [selectedMentee.id]: [
                ...(prevMessages[selectedMentee.id] || []),
                { id: Date.now(), sender: senderName, text: '[File Received]', base64File, fileType, timestamp, isFile: true, senderId: senderUserId, role: 'mentee', fileName }
              ]
            }));
          }
        });

        setConnection(newConnection);
      })
      .catch(err => console.error('Connection failed:', err));

    return () => {
      if (newConnection) newConnection.stop();
    };
  }, [selectedMentee]);

  const handleSendMessage = async () => {
    if ((newMessage.trim() || file) && connection && connection.state === signalR.HubConnectionState.Connected && selectedMentee) {
      const timestamp = new Date().toLocaleTimeString();
      try {
        if (file) {
          const reader = new FileReader();
          reader.onloadend = async () => {
            const base64String = reader.result.split(',')[1];
            await connection.invoke('SendFileMessage', selectedMentee.id, currentUser.id, currentUser.name, base64String, file.type, timestamp, file.name);
            setFile(null);
          };
          reader.readAsDataURL(file);
        } else {
          await connection.invoke('SendDirectMessage', selectedMentee.id, currentUser.id, currentUser.name, newMessage, timestamp);
        }

        setMentorMessages(prevMessages => ({
          ...prevMessages,
          [selectedMentee.id]: [
            ...(prevMessages[selectedMentee.id] || []),
            { id: Date.now(), sender: currentUser.name, senderId: currentUser.id, role: currentUser.role, text: newMessage, timestamp, isFile: !!file, fileType: file ? file.type : null, fileName: file ? file.name : null }
          ]
        }));

        setNewMessage('');
        setReplyTo(null);
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  };

  const handleFileUpload = (event) => {
    const uploadedFile = event.target.files[0];
    if (uploadedFile) setFile(uploadedFile);
  };

  const handleReply = (message) => setReplyTo(message);
  const handleCancelReply = () => setReplyTo(null);
  const handleCancelFile = () => setFile(null);
  const handleSidebarToggle = () => setIsSidebarCollapsed(!isSidebarCollapsed);

  const handleMenteeClick = (mentee) => {
    setSelectedMentee(mentee); // Store the full mentee object
    setNewMessage('');
    setReplyTo(null);
  };

  const downloadFile = (base64Data, fileName, fileType) => {
    const byteCharacters = atob(base64Data);
    const byteNumbers = Array.from(byteCharacters, char => char.charCodeAt(0));
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

  const getFileIcon = (fileName) => {
    const fileExtension = fileName.split('.').pop().toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif'].includes(fileExtension)) {
      return <img src={`data:image/${fileExtension};base64,${fileName}`} alt="Preview" className={styles.filePreview} />;
    } else if (fileExtension === 'pdf') {
      return <FaFilePdf className={styles.dmFileIcon} />;
    } else {
      return <FaFileAlt className={styles.dmFileIcon} />;
    }
  };

  const filteredMentees = mentees.filter((mentee) => mentee.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className={styles.mentorDMComponentPage}>
      <div className={`${styles.mentorDMComponentSidebar} ${isSidebarCollapsed ? styles.mentorDMComponentSidebarCollapsed : ''}`} onDoubleClick={handleSidebarToggle}>
        <div className={styles.mentorDMComponentSidebarHeader}>
          <h3>Mentees</h3>
          <div className={styles.mentorDMComponentSearchContainer}>
            <FaSearch className={styles.mentorDMComponentSearchIcon} />
            <input type="text" placeholder="Search for a mentee" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className={styles.mentorDMComponentSearchInput} />
          </div>
        </div>
        <ul className={styles.mentorDMComponentMenteeList}>
          {filteredMentees.map((mentee) => (
            <li key={mentee.id} className={styles.mentorDMComponentMenteeItem} onClick={() => handleMenteeClick(mentee)}>
              <span className={mentee.online ? styles.mentorDMComponentOnline : styles.mentorDMComponentOffline}>{mentee.name}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className={styles.mentorDMComponentMain}>
        <div className={styles.mentorDMComponentHeader}>
          <h2>{selectedMentee ? selectedMentee.name : 'Select a Mentee'}</h2>
        </div>
        <div className={styles.mentorDMComponentMessages}>
          {selectedMentee && (mentorMessages[selectedMentee.id] || []).map((message) => (
            <div key={message.id} className={`${styles.mentorDMComponentMessageItem} ${message.senderId === currentUser.id ? styles.mentorDMComponentSent : styles.mentorDMComponentReceived}`}>
              <div className={styles.mentorDMComponentSenderInfo}>
                <span className={styles.mentorDMComponentSenderName}>{message.sender} ({message.role})</span>
                <span className={styles.mentorDMComponentTimestamp}>{message.timestamp}</span>
              </div>
              {message.replyTo && (
                <div className={styles.mentorDMComponentReplyTo}>
                  <span className={styles.mentorDMComponentReplySender}>{message.replyTo.sender}:</span> {message.replyTo.text || 'Attachment'}
                </div>
              )}
              <div className={styles.mentorDMComponentMessageText}>
                <p>{message.text}</p>
                {message.isFile && (
                  <div className={styles.mentorDMComponentFileAttachment}>
                    {getFileIcon(message.fileName || 'file')}
                    <span className={styles.mentorDMComponentFileName}>{message.fileName || 'Attachment'}</span>
                    <button onClick={() => downloadFile(message.base64File, message.fileName, message.fileType)} className={styles.mentorDMComponentDownloadButton}>
                      <FaDownload /> Download
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className={styles.mentorDMComponentInputArea}>
          {replyTo && (
            <div className={styles.mentorDMComponentReplyBox}>
              <span>Replying to: {replyTo.sender} - {replyTo.text || 'Attachment'}</span>
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
            <textarea className={styles.mentorDMComponentTextArea} value={newMessage} onChange={(e) => setNewMessage(e.target.value)} placeholder="Type a message..." />
            <label htmlFor="file-upload" className={styles.mentorDMComponentFileUploadIcon}><FaPaperclip /></label>
            <input type="file" id="file-upload" style={{ display: 'none' }} onChange={handleFileUpload} />
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
