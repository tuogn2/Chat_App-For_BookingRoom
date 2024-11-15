import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const AdminChat = () => {
  const [messages, setMessages] = useState([]);  // Lưu tin nhắn
  const [newMessage, setNewMessage] = useState('');  // Tin nhắn mới
  const [userId, setUserId] = useState('');  // ID của người dùng
  const [socket, setSocket] = useState(null);  // Socket connection

  useEffect(() => {
    const socketConnection = io('http://localhost:5000');  // Kết nối tới server Socket.io

    socketConnection.on('connect', () => {
      console.log('Admin connected to socket');
      socketConnection.emit('joinAdminRoom');  // Tham gia phòng admin
    });

    // Lắng nghe tin nhắn mới từ người dùng
    socketConnection.on('newMessage', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    setSocket(socketConnection);

    return () => {
      socketConnection.disconnect();
    };
  }, []);

  // Gửi tin nhắn đến người dùng cụ thể
  const sendMessageToUser = () => {
    if (newMessage.trim() && userId && socket) {
      const message = {
        userId,
        messageContent: newMessage,
      };
      socket.emit('sendMessageToUser', message);  // Gửi tin nhắn đến user
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: 'admin', message: newMessage },
      ]);
      setNewMessage('');  // Xóa tin nhắn đã gửi
    }
  };

  return (
    <div>
      <h2>Admin Chat</h2>
      
      {/* Input cho ID người dùng */}
      <input
        type="text"
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
        placeholder="Enter User ID"
      />
      
      {/* Hiển thị danh sách tin nhắn */}
      <div>
        {messages.map((msg, index) => (
          <div key={index}>
            <strong>{msg.sender}:</strong> {msg.message}
          </div>
        ))}
      </div>

      {/* Input cho tin nhắn */}
      <input
        type="text"
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        placeholder="Type a message"
      />
      
      {/* Nút gửi tin nhắn */}
      <button onClick={sendMessageToUser}>Send</button>
    </div>
  );
};

export default AdminChat;
