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
  FaSearch
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

  const currentUser = { id: 'mentee1', name: 'Karabo Nechivhangani', role: 'mentee' };

  useEffect(() => {
    setMentors([
      { id: 'mentor1', name: 'Sifiso Vinjwa', online: true },
      { id: 'mentor2', name: 'Ntsako Sithole', online: false },
      { id: 'mentor3', name: 'Matete Sekgotodi', online: true },
      { id: 'mentor4', name: 'Bathabile Mohabela', online: false },
    ]);

    setMentorMessages({
      'mentor1': [
        
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
        console.log('Connected to SignalR hub as Mentee');

        newConnection.on('ReceiveDirectMessage', (senderUserId, senderName, message, timestamp) => {
          if (selectedMentor) {
            setMentorMessages(prevMessages => ({
              ...prevMessages,
              [selectedMentor.id]: [
                ...(prevMessages[selectedMentor.id] || []),
                { id: Date.now(), sender: senderName, text: message, timestamp, senderId: senderUserId, role: 'mentor' }
              ]
            }));
          }
        });

        newConnection.on('ReceiveFileMessage', (senderUserId, senderName, base64File, fileType, timestamp, fileName) => {
          if (selectedMentor) {
            setMentorMessages(prevMessages => ({
              ...prevMessages,
              [selectedMentor.id]: [
                ...(prevMessages[selectedMentor.id] || []),
                { id: Date.now(), sender: senderName, text: '[File Received]', base64File, fileType, timestamp, isFile: true, senderId: senderUserId, role: 'mentor', fileName }
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
  }, [selectedMentor]);

  const handleSendMessage = async () => {
    if ((newMessage.trim() || file) && connection && connection.state === signalR.HubConnectionState.Connected && selectedMentor) {
      const timestamp = new Date().toLocaleTimeString();
      try {
        if (file) {
          const reader = new FileReader();
          reader.onloadend = async () => {
            const base64String = reader.result.split(',')[1];
            await connection.invoke('SendFileMessage', selectedMentor.id, currentUser.id, currentUser.name, base64String, file.type, timestamp, file.name);
            setFile(null);
          };
          reader.readAsDataURL(file);
        } else {
          await connection.invoke('SendDirectMessage', selectedMentor.id, currentUser.id, currentUser.name, newMessage, timestamp);
        }

        setMentorMessages(prevMessages => ({
          ...prevMessages,
          [selectedMentor.id]: [
            ...(prevMessages[selectedMentor.id] || []),
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

  const handleMentorClick = (mentor) => {
    setSelectedMentor(mentor); // Store the full mentor object
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

  const filteredMentors = mentors.filter((mentor) => mentor.name.toLowerCase().includes(searchTerm.toLowerCase()));
  
  
  return (
    <div className={styles.dmPage}>
      <div className={`${styles.dmPageSidebar} ${isSidebarCollapsed ? styles.dmSidebarCollapsed : ''}`} onDoubleClick={handleSidebarToggle}>
        <div className={styles.dmSidebarHeader}>
          <h3>Mentors</h3>
          <div className={styles.dmSearchContainer}>
            <FaSearch className={styles.dmSearchIcon} />
            <input type="text" placeholder="Search for a mentor" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className={styles.dmSearchInput} />
          </div>
        </div>
        <ul className={styles.dmMentorList}>
          {filteredMentors.map((mentor) => (
            <li key={mentor.id} className={styles.dmMentorItem} onClick={() => handleMentorClick(mentor)}>
              <span className={mentor.online ? styles.dmPageOnline : styles.dmPageOffline}>{mentor.name}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className={styles.dmMain}>
        <div className={styles.dmHeader}>
          <h2>{selectedMentor ? selectedMentor.name : 'Direct Message'}</h2>
        </div>
        <div className={styles.dmMessages}>
          {selectedMentor && (mentorMessages[selectedMentor.id] || []).map((message) => (
            <div key={message.id} className={`${styles.dmMessageItem} ${message.senderId === currentUser.id ? styles.dmSent : styles.dmReceived}`}>
              <div className={styles.dmSenderInfo}>
                <span className={styles.dmSenderName}>{message.sender} ({message.role})</span>
                <span className={styles.dmTimestamp}>{message.timestamp}</span>
              </div>
              {message.replyTo && (
                <div className={styles.dmReplyTo}>
                  <span className={styles.dmReplySender}>{message.replyTo.sender}:</span> {message.replyTo.text || 'Attachment'}
                </div>
              )}
              <div className={styles.dmMessageText}>
                <p>{message.text}</p>
                {message.isFile && (
                  <div className={styles.dmFileAttachment}>
                    {getFileIcon(message.fileName || 'file')}
                    <span className={styles.dmFileName}>{message.fileName || 'Attachment'}</span>
                    <button onClick={() => downloadFile(message.base64File, message.fileName, message.fileType)} className={styles.dmDownloadButton}>
                      <FaDownload /> Download
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className={styles.dmInputArea}>
          {replyTo && (
            <div className={styles.dmReplyBox}>
              <span>Replying to: {replyTo.sender} - {replyTo.text || 'Attachment'}</span>
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
            <textarea className={styles.dmTextArea} value={newMessage} onChange={(e) => setNewMessage(e.target.value)} placeholder="Type a message..." />
            <label htmlFor="file-upload" className={styles.dmFileUploadIcon}><FaPaperclip /></label>
            <input type="file" id="file-upload" style={{ display: 'none' }} onChange={handleFileUpload} />
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
