import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane, faPaperclip, faTimes } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
// import contractPayload from './contract_payload.json';
// import contractPayload from './contract_payload_bad.json';

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
  // Local file URL
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  // Bucket file URI
  const [pdfUri, setPdfUri] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [contractPayload, setContractPayload] = useState(null); 

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
    if (pdfUri) {
      console.log(pdfUri);
    }
    if (contractPayload) {
      console.log(contractPayload)
      // Send alerts on tenancy and bill info
      const sublet = extractTenancyDetails(contractPayload);
      showSubletInfo(sublet);
      const billInfo = extractBillInfo(contractPayload);
      showBillInfo(billInfo);
      const depositCheck = checkDepositExceedsRent(contractPayload);
      showDepositInfo(depositCheck);
    }
  }, [pdfUrl, pdfUri, contractPayload]);

  const extractTenancyDetails = (jsonObject) => {
    if (!jsonObject || !jsonObject.tenancy_details) {
      return {}; // Return empty object if input is invalid or missing required structure
    }
    const {
      is_assignment_or_sublet_allowed,
    } = jsonObject.tenancy_details;

    const sublet = `
       - <strong>Assignment or subletting:</strong> ${is_assignment_or_sublet_allowed === 'True' ? 'Yes' : 'No'}
    `;

    return sublet.trim();
  };

  const extractBillInfo = (jsonObject) => {
    if (!jsonObject || !jsonObject.tenancy_details) {
      return {}; // Return empty object if input is invalid or missing required structure
    }
    const {
      responsibilities: {
        is_included_in_rent_council_tax,
        is_included_in_rent_gas,
        is_included_in_rent_water,
        is_included_in_rent_electricity,
        is_included_in_rent_internet,
        is_included_in_rent_telephone,
        is_included_in_rent_tv_licence
      }
    } = jsonObject.tenancy_details;

    const includedInBill = `
      - <strong>Council Tax:</strong> ${is_included_in_rent_council_tax === 'True' ? 'Landlord' : 'Tenant'}<br/>
      - <strong>Gas:</strong> ${is_included_in_rent_gas === 'True' ? 'Landlord' : 'Tenant'}<br/>
      - <strong>Water:</strong> ${is_included_in_rent_water === 'True' ? 'Landlord' : 'Tenant'}<br/>
      - <strong>Electricity:</strong> ${is_included_in_rent_electricity === 'True' ? 'Landlord' : 'Tenant'}<br/>
      - <strong>Internet:</strong> ${is_included_in_rent_internet === 'True' ? 'Landlord' : 'Tenant'}<br/>
      - <strong>Telephone:</strong> ${is_included_in_rent_telephone === 'True' ? 'Landlord' : 'Tenant'}<br/>
      - <strong>TV Licence:</strong> ${is_included_in_rent_tv_licence === 'True' ? 'Landlord' : 'Tenant'}<br/>
    `;

    return includedInBill.trim();
  };


  const checkDepositExceedsRent = (jsonObject) => {
    if (!jsonObject || !jsonObject.tenancy_details) {
        return false; // Return false if input is invalid or missing required structure
    }

    const { rent_amount, deposit_amount } = jsonObject.tenancy_details;

    // Remove commas and convert to numeric values
    const rentAmountNumeric = parseFloat(rent_amount.replace(/,/g, ''));
    const depositAmountNumeric = parseFloat(deposit_amount.replace(/,/g, ''));

    // Check if deposit amount exceeds 5 times the rent amount
    return (depositAmountNumeric > 5 * rentAmountNumeric) ? 'Deposit exceeds 5 weeks of rent: Yes' : 'Deposit exceeds 5 weeks of rent: No';
};

  const handleSendMessage = async () => {
    if (input.trim() !== '') {
      setMessages([...messages, { user: 'You', content: input, type: 'text' }]);
      setInput('');

      // Post PDF to backend
      const formData = new FormData();
      formData.append('message', input)

      const response = await axios.post('http://127.0.0.1:8000/chat_message', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setMessages([...messages, { user: 'Ally', content: response.data.response, type: 'text' }]);

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

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      
      // Create PDF object and display in the frontend
      const fileUrl = URL.createObjectURL(file);
      setMessages([
        ...messages,
        { user: 'You', content: '', type: 'file', fileName: file.name, fileUrl },
      ]);
      setPdfUrl(fileUrl);

      // Post PDF to backend
      const formData = new FormData();
      formData.append('file', file);

      // Send POST request to backend
      const response = await axios.post('http://127.0.0.1:8000/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      const entities = response.data.entities;
      setContractPayload(entities);

      setPdfUri(response.data["uri"]);
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

  const showSubletInfo = (message: string) => {
    // Check if the message contains the words 'No'
    const messageIncludesNo = /\bNo\b/.test(message);
      toast.error(<div dangerouslySetInnerHTML={{ __html: message }} />, {
      position: "top-left",
      autoClose: pdfUrl==null ? true : false,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      style: {
        background: messageIncludesNo ? '#ffe6e6' : '#e6ffe6',
        color: '#000000', 
        fontSize: '13px', 
        textAlign: 'left', 
      },
    });
  };

  const showBillInfo = (message: string) => {
    // Check if the message contains the words 'Tenant'
    const messageIncludesTenant = /\Tenant\b/.test(message);
      toast.error(<div dangerouslySetInnerHTML={{ __html: message }}/>, {
        position: "top-left",
        autoClose: false,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        style: {
          background: messageIncludesTenant ? '#FFD699' : '#e6ffe6',
          color: '#000000',
          fontSize: '13px', 
          textAlign: 'left', 
        },
      });
  };
  
  const showDepositInfo = (message: string) => {
    // Check if the message contains the words 'Yes'
    const depositError = /\Yes\b/.test(message);
    toast.error(<div dangerouslySetInnerHTML={{ __html: message }} />, {
    position: "top-left",
    autoClose: false,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    style: {
      background: depositError ? '#FFD699' : '#e6ffe6', 
      color: '#000000', 
      fontSize: '13px', 
      textAlign: 'left', 
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

export default ChatBox;