import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Ai = () => {
    const [userMessage, setUserMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [userId, setUserId] = useState('');

    // Tạo user_id ngẫu nhiên khi bắt đầu phiên trò chuyện
    useEffect(() => {
        // Tạo user_id ngẫu nhiên (hoặc bạn có thể dùng user_id từ hệ thống đăng nhập)
        const generatedUserId = `user_${Math.random().toString(36).substr(2, 9)}`;
        setUserId(generatedUserId);
    }, []);

    const handleSendMessage = async () => {
        if (userMessage.trim()) {
            // Cập nhật tin nhắn người dùng vào UI
            const newMessages = [...messages, { sender: 'user', text: userMessage }];
            setMessages(newMessages);

            try {
                // Gửi tin nhắn tới API chat của bạn
                const response = await axios.post('http://127.0.0.1:8080/chat', {
                    message: userMessage,
                    user_id: userId, // Truyền user_id cùng với tin nhắn
                });

                console.log("tuong", response);

                // Giả sử API trả về phản hồi từ AI trong trường 'response'
                const aiResponse = response.data.response;

                // Cập nhật tin nhắn phản hồi của AI vào UI
                setMessages([
                    ...newMessages,
                    { sender: 'ai', text: aiResponse }
                ]);

            } catch (error) {
                console.error("Error sending message to API:", error);
                setMessages([
                    ...newMessages,
                    { sender: 'ai', text: 'Có lỗi xảy ra khi kết nối tới API.' }
                ]);
            }

            // Dọn dẹp ô nhập tin nhắn sau khi gửi
            setUserMessage('');
        }
    };

    return (
        <div style={styles.container}>
            <h1>AI Chat</h1>
            
            <div style={styles.chatBox}>
                {messages.map((message, index) => (
                    <div key={index} style={styles.messageContainer}>
                        <div
                            style={{
                                ...styles.message,
                                backgroundColor: message.sender === 'user' ? '#d1f7c4' : '#f1f1f1',
                                alignSelf: message.sender === 'user' ? 'flex-end' : 'flex-start',
                            }}
                        >
                            {message.text}
                        </div>
                    </div>
                ))}
            </div>
            
            <div style={styles.inputContainer}>
                <input
                    type="text"
                    value={userMessage}
                    onChange={(e) => setUserMessage(e.target.value)}
                    placeholder="Type your message..."
                    style={styles.input}
                />
                <button onClick={handleSendMessage} style={styles.sendButton}>
                    Send
                </button>
            </div>
        </div>
    );
};

// Các phần style không thay đổi
const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '80vh',
        maxWidth: '600px',
        margin: '0 auto',
        padding: '20px',
        border: '1px solid #ccc',
        borderRadius: '8px',
        backgroundColor: '#fff',
    },
    chatBox: {
        flex: 1,
        overflowY: 'auto',
        padding: '10px',
        border: '1px solid #ddd',
        borderRadius: '8px',
        marginBottom: '10px',
    },
    messageContainer: {
        margin: '10px 0',
    },
    message: {
        padding: '10px',
        borderRadius: '8px',
        maxWidth: '80%',
        wordBreak: 'break-word',
    },
    inputContainer: {
        display: 'flex',
        justifyContent: 'space-between',
    },
    input: {
        width: '85%',
        padding: '10px',
        borderRadius: '4px',
        border: '1px solid #ddd',
    },
    sendButton: {
        width: '10%',
        padding: '10px',
        backgroundColor: '#007bff',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontWeight: 'bold',
    },
};

export default Ai;
