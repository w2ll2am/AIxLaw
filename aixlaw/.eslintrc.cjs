// ChatBox.tsx
import React, { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperclip, faTimes } from '@fortawesome/free-solid-svg-icons';

interface Message {
  user: string;
  content: string;
  type: 'text' | 'file';
  fileName?: string;
  fileUrl?: string;
}

const ChatBox: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>('');
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(scrollToBottom, [messages]);

  const handleSendMessage = () => {
    if (input.trim() !== '') {
      setMessages([...messages, { user: 'You', content: input, type: 'text' }]);
      setInput('');
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInput(event.target.value);
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSendMessage();
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      const fileUrl = URL.createObjectURL(file);
      setMessages([
        ...messages,
        { user: 'You', content: '', type: 'file', fileName: file.name, fileUrl },
      ]);
      setPdfUrl(fileUrl);
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleClosePdfViewer = () => {
    setPdfUrl(null);
  };

  return (
    <div style={styles.chatBoxContainer}>
      {pdfUrl ? (
        <>
          <button onClick={handleClosePdfViewer} style={styles.closeButton}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
          <div style={styles.pdfViewerContainer}>
          <iframe src={pdfUrl} style={styles.pdfViewer} title="PDF Viewer" />
        </div>
        </>

      ) : (
        <>
          <div style={styles.messagesContainer}>
            {messages.map((message, index) => (
              <div key={index} style={message.type === 'file' ? styles.fileMessage : styles.message}>
                <strong>{message.user}: </strong>
                {message.type === 'text' ? (
                  message.content
                ) : (
                  <a href={message.fileUrl} target="_blank" rel="noopener noreferrer">
                    {message.fileName}
                  </a>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <div style={styles.inputContainer}>
            <FontAwesomeIcon
              icon={faPaperclip}
              style={styles.icon}
              onClick={triggerFileInput}
            />
            <input
              type="text"
              value={input}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              style={styles.input}
              placeholder="Type a message..."
            />
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept="application/pdf"
              style={styles.fileInput}
            />
            <button onClick={handleSendMessage} style={styles.sendButton}>
              Send
            </button>
          </div>
        </>
      )}
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  chatBoxContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    width: '100vw',
    height: '100vh',
    backgroundColor: '#f5f5f5',
    boxSizing: 'border-box',
    fontFamily: 'Arial, sans-serif',
  },
  messagesContainer: {
    flex: 1,
    overflowY: 'auto',
    padding: '10px',
    backgroundColor: '#ffffff',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    margin: '10px',
    borderRadius: '8px',
  },
  message: {
    marginBottom: '10px',
    padding: '10px',
    backgroundColor: '#e1f5fe',
    borderRadius: '8px',
    maxWidth: '80%',
    alignSelf: 'flex-start',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },
  fileMessage: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '10px',
    padding: '10px',
    backgroundColor: '#e1f5fe',
    borderRadius: '8px',
    maxWidth: '80%',
    alignSelf: 'center',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },
  inputContainer: {
    display: 'flex',
    alignItems: 'center',
    padding: '10px',
    borderTop: '1px solid #ccc',
    backgroundColor: '#ffffff',
  },
  icon: {
    cursor: 'pointer',
    marginRight: '10px',
    color: '#007bff',
  },
  input: {
    flex: 1,
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '5px 0 0 5px',
    outline: 'none',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },
  fileInput: {
    display: 'none',
  },
  sendButton: {
    padding: '10px 15px',
    border: 'none',
    borderRadius: '0 5px 5px 0',
    backgroundColor: '#007bff',
    color: 'white',
    cursor: 'pointer',
    marginLeft: '10px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },
  pdfViewerContainer: {
    position: 'relative',
    width: '100vw',
    height: '100vh',
    backgroundColor: '#333',
  },
  pdfViewer: {
    width: '100%',
    height: '100%',
    border: 'none',
  },
  closeButton: {
    position: 'absolute',
    top: '10px',
    right: '10px',
    backgroundColor: 'transparent',
    border: 'none',
    color: '#fff',
    fontSize: '24px',
    cursor: 'pointer',
    zIndex: 10,
  },
};

export default ChatBox;
