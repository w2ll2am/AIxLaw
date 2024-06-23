import React, { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane, faPaperclip, faTimes } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';

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

  useEffect(() => {
    if (pdfUrl) {
      console.log(pdfUrl);
    }
  }, [pdfUrl]);

  const handleSendMessage = () => {
    if (input.trim() !== '') {
      setMessages([...messages, { user: 'You', content: input, type: 'text' }]);
      setInput('');
    } else {
      showAlertMessage('Please enter a message.');
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

  const closePdf = () => {
    setMessages([]);
    setPdfUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const showAlertMessage = (message: string) => {
    toast.error(message, {
      position: "top-left",
      autoClose: 3000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      style: {
        background: '#f0f0f0', 
        color: '#000000', 
        fontSize: '16px', 
        textAlign: 'center', 
      },
    });
  };

  return (
    <div style={styles.screen}>
    {pdfUrl && (
        <iframe src={pdfUrl} style={styles.pdfViewer} title="PDF Viewer" />
    )}
    <div style={pdfUrl==null ? styles.ChatBoxContainerWithoutPdf : styles.ChatBoxContainerWithPdf}>
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
        {pdfUrl==null ? <></> : <FontAwesomeIcon
          icon={faTimes}
          style={styles.icon}
          onClick={closePdf}
        />}
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
        <FontAwesomeIcon
          icon={faPaperPlane}
          style={styles.icon}
          onClick={handleSendMessage}
        />
      </div>
    </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  screen: {
    display: 'flex',
    flexDirection: 'row',
  },
  ChatBoxContainerWithoutPdf: {
    display: 'flex',
    justifyContent: 'flex-start',
    flexDirection: 'column',
    width: '100vw',
    height: '100vh',
    fontFamily: 'Arial, sans-serif',
  },
  ChatBoxContainerWithPdf: {
    display: 'flex',
    justifyContent: 'flex-start',
    flexDirection: 'column',
    width: '30vw',
    height: '100vh',
    fontFamily: 'Arial, sans-serif',
  },
  pdfViewer: {
    display: 'flex',
    justifyContent: 'flex-start',
    width: '70vw',
    height: '100vh',
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
    maxWidth: '100vw',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },
  fileMessage: {
    marginBottom: '10px',
    padding: '10px',
    backgroundColor: '#e1f5fe',
    borderRadius: '8px',
    maxWidth: '100vw',
    alignItems: 'center',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },
  inputContainer: {
    display: 'flex',
    alignItems: 'center',
    padding: '10px',
    backgroundColor: '#ffffff',
  },
  icon: {
    cursor: 'pointer',
    marginLeft: '5px',
    marginRight: '5px',
    color: '#007bff',
  },
  input: {
    flex: 1,
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '5px 5px 5px 5px',
    outline: 'none',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    marginLeft: '5px',
    marginRight: '5px',
  },
  fileInput: {
    display: 'none',
  },
};

export default ChatBox;
