import React, { useState, useEffect } from 'react';
import styles from './MentorDmPage.module.css'; // Make sure the CSS module is correctly linked
import { FaPaperPlane, FaPaperclip, FaEllipsisV } from 'react-icons/fa';

const MentorDmPage = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMentee, setSelectedMentee] = useState(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(null);

  const mentees = [
    { id: 1, name: 'Jane Doe', messages: [] },
    { id: 2, name: 'John Smith', messages: [] },
    { id: 3, name: 'Alice Johnson', messages: [] },
    { id: 4, name: 'Chris Lee', messages: [] },
    { id: 5, name: 'Debra Young', messages: [] },
    { id: 6, name: 'Erin Sanders', messages: [] },
    { id: 7, name: 'Frank Brown', messages: [] },
  ];

  useEffect(() => {
    if (selectedMentee) {
      setMessages(selectedMentee.messages);
    }
  }, [selectedMentee]);

  const handleSendMessage = () => {
    if (newMessage.trim() !== '' || file) {
      const fileType = file ? file.type.split('/')[0] : null;
      const fileURL = file ? URL.createObjectURL(file) : null;
      const newMsg = {
        sender: 'mentor',
        text: newMessage,
        fileURL: fileURL || '',
        fileName: file ? file.name : '',
        type: fileType,
        id: Date.now(),
      };
      setMessages([...messages, newMsg]);
      setSelectedMentee({ ...selectedMentee, messages: [...selectedMentee.messages, newMsg] });
      setNewMessage('');
      setFile(null);
      setFilePreview(null);
    }
  };

  const handleFileUpload = (event) => {
    const uploadedFile = event.target.files[0];
    setFile(uploadedFile);
    setFilePreview(uploadedFile);
  };

  const toggleDropdown = (msgId) => {
    setDropdownVisible(dropdownVisible === msgId ? null : msgId);
  };

  const handleEditMessage = (msgId) => {
    const newText = prompt('Edit your message:');
    setMessages(messages.map((msg) => (msg.id === msgId ? { ...msg, text: newText } : msg)));
    setDropdownVisible(null);
  };

  const handleDeleteMessage = (msgId) => {
    const confirmDelete = window.confirm('Delete this message?');
    if (confirmDelete) {
      setMessages(messages.filter((msg) => msg.id !== msgId));
    }
    setDropdownVisible(null);
  };

  const renderMedia = (message) => {
    if (message.type === 'image') {
      return <img className={styles.messageImage} src={message.fileURL} alt={message.fileName} />;
    }
    if (message.type === 'video') {
      return <video className={styles.messageVideo} src={message.fileURL} controls />;
    }
    return (
      <div className={styles.filePreview}>
        <p>{message.fileName}</p>
        <a href={message.fileURL} download={message.fileName} className={styles.messageDownload}>
          Download
        </a>
      </div>
    );
  };

  return (
    <div className={styles.dmPage}>
      <div
        className={`${styles.chatSidebar} ${sidebarCollapsed ? styles.collapsed : ''}`}
        onDoubleClick={() => setSidebarCollapsed(!sidebarCollapsed)}
      >
        <input
          type="text"
          placeholder="Search for a mentee..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles.menteeSearchBar}
        />
        {!sidebarCollapsed ? (
          <ul>
            {mentees.filter((mentee) => mentee.name.toLowerCase().includes(searchTerm.toLowerCase())).map((mentee) => (
              <li key={mentee.id} onClick={() => setSelectedMentee(mentee)}>
                {mentee.name}
              </li>
            ))}
          </ul>
        ) : (
          <div className={styles.collapsedSidebarIcons}>
            {mentees.map((mentee) => (
              <div key={mentee.id} className={styles.chatInitials}>
                {mentee.name[0]}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className={styles.chatMain}>
        {selectedMentee ? (
          <>
            <div className={styles.chatHeader}>
              <h2>{selectedMentee.name}</h2>
            </div>
            <div className={styles.chatMessages}>
              {messages.map((message) => (
                <div key={message.id} className={`${styles.messageItem} ${styles[message.sender === 'mentor' ? 'mentee' : 'mentor']}`}>
                  <div className={`${styles.messageText} ${styles[message.sender]}`}>
                    {message.text && <p>{message.text}</p>}
                    {message.fileURL && renderMedia(message)}
                    <FaEllipsisV className={styles.dropdownToggle} onClick={() => toggleDropdown(message.id)} />
                    {dropdownVisible === message.id && (
                      <div className={styles.dropdownMenu}>
                        <p onClick={() => handleEditMessage(message.id)}>Edit</p>
                        <p onClick={() => handleDeleteMessage(message.id)}>Delete</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className={styles.chatInputArea}>
              <textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message"
              />
              <div className={styles.fileDropArea}>
                <label htmlFor="file-upload">
                  <FaPaperclip className={styles.fileUploadIcon} />
                </label>
                <input
                  type="file"
                  id="file-upload"
                  style={{ display: 'none' }}
                  onChange={handleFileUpload}
                />
              </div>
              <button onClick={handleSendMessage}>
                <FaPaperPlane />
              </button>
            </div>
            {filePreview && (
              <div className={styles.filePreview}>
                <p>File ready to send: {filePreview.name}</p>
              </div>
            )}
          </>
        ) : (
          <div className={styles.chatPlaceholder}>
            <p>Select a chat to start messaging.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MentorDmPage;
