import React, { useState, useEffect, useRef } from "react";
import {
  TextField,
  Button,
  Grid,
  Tabs,
  Tab,
  Avatar,
  Typography,
  Box,
} from "@mui/material";
import { UserOutlined } from "@ant-design/icons";
import io from "socket.io-client";
import axios from "axios";
import moment from "moment";

const ConsultantChat = () => {
  const [messages, setMessages] = useState([]); // Messages for the selected user
  const [userMessages, setUserMessages] = useState({}); // Messages of all users
  const [newMessage, setNewMessage] = useState(""); // New message to be sent
  const [selectedUserId, setSelectedUserId] = useState(""); // Selected user ID
  const [userList, setUserList] = useState([]); // List of users who have messaged
  const [socket, setSocket] = useState(null); // Socket connection
  const [chatHistory, setChatHistory] = useState([]); // Chat history of selected user
  const chatContainerRef = useRef(null); // Reference to the chat container

  useEffect(() => {
    const socketConnection = io("http://localhost:5000");
    setSocket(socketConnection);

    socketConnection.on("connect", () => {
      console.log("Admin connected to socket");
      socketConnection.emit("joinAdminRoom");
    });

    socketConnection.on("newMessage", (message) => {
      const { userId: userId, message: messageContent, timestamp } = message;
      setUserMessages((prevUserMessages) => {
        const userMessages = prevUserMessages[userId] || [];
        return {
          ...prevUserMessages,
          [userId]: [
            ...userMessages,
            { sender: "user", message: messageContent, timestamp },
          ],
        };
      });

      if (!userList.includes(userId)) {
        setUserList((prevList) => [...prevList, userId]);
      }
    });

    return () => {
      socketConnection.disconnect();
    };
  }, [userList]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/v1/socket/rooms")
      .then((response) => {
        setUserList(response.data);
      })
      .catch((error) => {
        console.error("Error fetching rooms:", error);
      });
  }, []);

  useEffect(() => {
    if (selectedUserId) {
      axios
        .get(`http://localhost:5000/api/v1/socket/history/${selectedUserId}`)
        .then((response) => {
          setChatHistory(response.data);
        })
        .catch((error) => {
          console.error("Error fetching chat history:", error);
        });

      setMessages(userMessages[selectedUserId] || []);
    }
  }, [selectedUserId, userMessages]);

  const timeAgo = (timestamp) => {
    const now = moment();
    const messageTime = moment(timestamp);
    const diffInSeconds = now.diff(messageTime, "seconds");

    if (diffInSeconds < 60) {
      return `${diffInSeconds} giây trước`;
    }

    const diffInMinutes = now.diff(messageTime, "minutes");
    if (diffInMinutes < 60) {
      return `${diffInMinutes} phút trước`;
    }

    const diffInHours = now.diff(messageTime, "hours");
    if (diffInHours < 24) {
      return `${diffInHours} giờ trước`;
    }

    const diffInDays = now.diff(messageTime, "days");
    return `${diffInDays} ngày trước`;
  };
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight; // Auto-scroll to the bottom
    }
  }, [chatHistory]); // Trigger whenever chatHistory changes

  const sendMessageToUser = () => {
    if (newMessage.trim() && selectedUserId && socket) {
      const message = {
        userId: selectedUserId,
        messageContent: newMessage,
        timestamp: new Date().toISOString(),
      };
      socket.emit("sendMessageToUser", message);

      setUserMessages((prevUserMessages) => ({
        ...prevUserMessages,
        [selectedUserId]: [
          ...(prevUserMessages[selectedUserId] || []),
          {
            sender: "admin",
            message: newMessage,
            timestamp: message.timestamp,
          },
        ],
      }));

      setNewMessage("");
    }
  };

  const formatDate = (timestamp) => {
    return moment(timestamp).format("YYYY-MM-DD HH:mm:ss");
  };

  return (
    <Grid container style={{ height: "100vh", margin: 0 }}>
      {/* User List on the Left (20% width) */}
      <Grid
        item
        xs={12}
        sm={3}
        md={3}
        lg={3}
        style={{
          padding: "16px",
          borderRight: "1px solid #f0f0f0",
          overflowY: "auto",
        }}
      >
        <h4 className="text-center" style={{ marginBottom: "16px" }}>
          Danh Sách Người Dùng
        </h4>
        <Tabs
          orientation="vertical"
          value={selectedUserId}
          onChange={(e, newValue) => setSelectedUserId(newValue)}
          aria-label="User List"
          style={{ height: "100%" }}
        >
          {userList.map((userId) => (
            <Tab
              label={
                <div style={{ display: "flex", alignItems: "center" }}>
                  <Avatar
                    icon={<UserOutlined />}
                    style={{ marginRight: "8px" }}
                  />
                  User {userId}
                </div>
              }
              key={userId}
              value={userId}
            />
          ))}
        </Tabs>
      </Grid>

      {/* Chat Section on the Right (80% width) */}
      <Grid
        item
        xs={12}
        sm={9}
        md={9}
        lg={9}
        style={{
          padding: "16px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Sticky Header */}
        <Box
          style={{
            position: "sticky",
            top: 0,
            zIndex: 1,
            backgroundColor: "#fff",
            paddingBottom: "16px",
            boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Typography variant="h5" align="center">
            Chat with User {selectedUserId}
          </Typography>
        </Box>

        <div
          ref={chatContainerRef}
          style={{
            flex: 1,
            overflowY: "auto",
            marginBottom: "16px",
            paddingRight: "8px",
            maxHeight: "calc(100vh - 160px)", // Adjust height based on header and input
          }}
        >
          {chatHistory.map((msg, index) => (
            <Box
              key={index}
              sx={{
                marginBottom: "12px",
                textAlign: msg.sender === "admin" ? "right" : "left", // Right for admin, Left for user
                display: "block",
                width: "100%", // Adjust the width as needed
              }}
            >
              <Box
                sx={{
                  marginBottom: "12px",
                  textAlign: msg.sender === "admin" ? "right" : "left", // Same here for alignment
                  backgroundColor:
                    msg.sender === "admin" ? "#e1f5fe" : "#f1f1f1", // Different background colors for each sender
                  borderRadius: "8px", // Border radius for rounded edges
                  padding: "8px 16px", // Padding inside the message box
                  boxShadow:
                    msg.sender === "admin"
                      ? "0px 2px 4px rgba(0, 0, 0, 0.1)"
                      : "none", // Shadow for admin's message
                  width: "fit-content", // Make the box adjust its width based on content
                  marginLeft: msg.sender === "admin" ? "auto" : "0", // To push the admin message to the right
                }}
              >
                <Typography variant="body1">
                  <div
                    style={{
                      color: msg.sender === "admin" ? "blue" : "black", // Color for admin's name (blue for admin, black for user)
                    }}
                  >
                    <b>{msg.sender === "admin" ? "You" : "User"}</b>
                  </div>{" "}
                  {msg.content} {/* Display the message content */}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ fontSize: "0.8em", color: "#888", marginTop: "4px" }}
                >
                  {timeAgo(msg.timestamp)}
                </Typography>
              </Box>
            </Box>
          ))}
        </div>

        {/* Message Input and Send Button */}
        <div style={{ display: "flex", alignItems: "center" }}>
          <TextField
            fullWidth
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            label="Type your message"
            variant="outlined"
            style={{ marginRight: "8px", borderRadius: "8px" }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={sendMessageToUser}
            style={{ borderRadius: "8px" }}
          >
            Send
          </Button>
        </div>
      </Grid>
    </Grid>
  );
};

export default ConsultantChat;
