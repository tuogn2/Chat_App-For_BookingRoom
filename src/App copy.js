import React from 'react';
// import { useEffect, useState } from 'react';
// import io from 'socket.io-client';
import Ai from './Ai';

// const socket = io('http://localhost:4000');

function App() {
  // const [message, setMessage] = useState('');
  // const [messages, setMessages] = useState([]);
  // const [room, setRoom] = useState('');
  // const [sender, setSender] = useState('User1'); // Thay đổi tùy theo người dùng

  // useEffect(() => {
  //   // Nhận lịch sử tin nhắn
  //   socket.on('chatHistory', (history) => {
  //     setMessages(history);
  //   });

  //   // Nhận tin nhắn mới
  //   socket.on('receiveMessage', (newMessage) => {
  //     setMessages((prevMessages) => [...prevMessages, newMessage]);
  //   });

  //   return () => {
  //     socket.off('chatHistory');
  //     socket.off('receiveMessage');
  //   };
  // }, []);

  // const joinRoom = () => {
  //   if (room) {
  //     socket.emit('joinRoom', room);
  //   }
  // };

  // const sendMessage = () => {
  //   if (message.trim() && room) {
  //     const msgData = { room, sender, content: message };
  //     socket.emit('sendMessage', msgData);
  //     setMessage('');
  //   }
  // };

  return (
    // <div className="App">
    //   <h2>Phòng Chat</h2>
    //   <input
    //     type="text"
    //     placeholder="Nhập tên phòng..."
    //     value={room}
    //     onChange={(e) => setRoom(e.target.value)}
    //   />
    //   <button onClick={joinRoom}>Tham gia phòng</button>

    //   <div className="chat-box">
    //     {messages.map((msg, index) => (
    //       <p key={index}><strong>{msg.sender}:</strong> {msg.content}</p>
    //     ))}
    //   </div>

    //   <input
    //     type="text"
    //     placeholder="Nhập tin nhắn..."
    //     value={message}
    //     onChange={(e) => setMessage(e.target.value)}
    //   />
    //   <button onClick={sendMessage}>Gửi</button>
    // </div>
    <Ai />
  );
}

export default App;
