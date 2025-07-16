import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  IconButton,
  Avatar,
  Fab,
  Collapse,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider,
  CircularProgress,
  Chip,
} from "@mui/material";
import {
  Chat as ChatIcon,
  Send as SendIcon,
  Close as CloseIcon,
  SmartToy as BotIcon,
  Person as PersonIcon,
  Clear as ClearIcon,
  DeleteForever
} from "@mui/icons-material";

const ChatBox = ({ user, products }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Xin chào! Tôi là trợ lý AI của bạn. Tôi có thể giúp bạn tìm kiếm khóa học, tư vấn học tập, hoặc trả lời các câu hỏi về nền tảng. Bạn cần hỗ trợ gì?",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Simulate AI response
  const generateAIResponse = async (userMessage) => {
    setIsTyping(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
    
    const lowerMessage = userMessage.toLowerCase();
    let response = "";

    // Course search responses
    if (lowerMessage.includes("khóa học") || lowerMessage.includes("course")) {
      const courseCount = products ? products.length : 0;
      response = `Hiện tại chúng tôi có ${courseCount} khóa học đa dạng. Bạn có thể tìm kiếm theo tên khóa học, giá cả, hoặc chủ đề. Bạn muốn tìm khóa học về lĩnh vực nào?`;
    }
    // Price inquiry
    else if (lowerMessage.includes("giá") || lowerMessage.includes("price")) {
      response = "Các khóa học của chúng tôi có mức giá từ 200,000 VNĐ đến 2,000,000 VNĐ. Bạn có thể lọc theo mức giá: Thấp (dưới 500K), Trung bình (500K-1M), Cao (trên 1M). Bạn muốn xem khóa học ở mức giá nào?";
    }
    // Learning advice
    else if (lowerMessage.includes("học") || lowerMessage.includes("tư vấn")) {
      response = "Để học hiệu quả, tôi khuyên bạn nên: 1) Đặt mục tiêu cụ thể, 2) Lên lịch học đều đặn, 3) Thực hành thường xuyên, 4) Tham gia thảo luận với cộng đồng. Bạn đang quan tâm đến lĩnh vực nào?";
    }
    // Greeting
    else if (lowerMessage.includes("xin chào") || lowerMessage.includes("hello") || lowerMessage.includes("hi")) {
      const userName = user ? user.name : "bạn";
      response = `Xin chào ${userName}! Tôi rất vui được hỗ trợ bạn. Bạn có câu hỏi gì về khóa học hay cần tư vấn học tập không?`;
    }
    // Help
    else if (lowerMessage.includes("giúp") || lowerMessage.includes("help")) {
      response = "Tôi có thể giúp bạn: Tìm kiếm khóa học phù hợp, Tư vấn về giá cả, Đưa ra lời khuyên học tập, Thông tin về tiến độ học, Hỗ trợ kỹ thuật. Bạn cần hỗ trợ về vấn đề gì?";
    }
    // Default response
    else {
      const responses = [
        "Tôi hiểu bạn đang quan tâm đến điều này. Bạn có thể chia sẻ thêm chi tiết để tôi hỗ trợ tốt hơn không?",
        "Đây là câu hỏi thú vị! Tôi cần thêm thông tin để đưa ra câu trả lời chính xác nhất.",
        "Cảm ơn bạn đã chia sẻ. Bạn có thể diễn đạt lại hoặc hỏi về khóa học cụ thể không?",
        "Tôi sẽ cố gắng hỗ trợ bạn tốt nhất. Bạn có thể hỏi về khóa học, giá cả, hoặc tư vấn học tập."
      ];
      response = responses[Math.floor(Math.random() * responses.length)];
    }

    setIsTyping(false);
    return response;
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: inputMessage,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");

    // Generate AI response
    const aiResponse = await generateAIResponse(inputMessage);
    
    const botMessage = {
      id: Date.now() + 1,
      text: aiResponse,
      sender: "bot",
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, botMessage]);
  };

  const clearChat = () => {
    setMessages([
      {
        id: 1,
        text: "Cuộc trò chuyện đã được xóa. Tôi có thể giúp gì cho bạn?",
        sender: "bot",
        timestamp: new Date(),
      },
    ]);
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const quickActions = [
    "Tìm khóa học phù hợp",
    "Tư vấn giá cả",
    "Hướng dẫn học tập",
    "Hỗ trợ kỹ thuật",
  ];

  return (
    <>
      {/* Chat Toggle Button */}
      <Fab
        color="primary"
        aria-label="chat"
        sx={{
          position: "fixed",
          bottom: 20,
          right: 20,
          zIndex: 1300,
          background: "linear-gradient(45deg, #1976d2, #42a5f5)",
        }}
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <CloseIcon /> : <ChatIcon />}
      </Fab>

      {/* Chat Window */}
      <Collapse in={isOpen}>
        <Paper
          elevation={8}
          sx={{
            position: "fixed",
            bottom: 90,
            right: 20,
            width: 360,
            height: 450,
            zIndex: 1300,
            borderRadius: 3,
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Header */}
          <Box
            sx={{
              p: 2,
              background: "linear-gradient(45deg, #1976d2, #42a5f5)",
              color: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Avatar sx={{ bgcolor: "rgba(255,255,255,0.2)", mr: 1 }}>
                <BotIcon />
              </Avatar>
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  Trợ lý AI
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.8 }}>
                  Luôn sẵn sàng hỗ trợ bạn
                </Typography>
              </Box>
            </Box>
            <IconButton size="small" onClick={clearChat} sx={{ color: "white" }}>
              <DeleteForever />
            </IconButton>
          </Box>

          {/* Messages */}
          <Box sx={{ flex: 1, overflow: "auto", p: 1 }}>
            <List sx={{ py: 0 }}>
              {messages.map((message) => (
                <ListItem
                  key={message.id}
                  sx={{
                    display: "flex",
                    justifyContent: message.sender === "user" ? "flex-end" : "flex-start",
                    px: 1,
                    py: 0.5,
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "flex-end",
                      maxWidth: "80%",
                      flexDirection: message.sender === "user" ? "row-reverse" : "row",
                    }}
                  >
                    <Avatar
                      sx={{
                        width: 32,
                        height: 32,
                        bgcolor: message.sender === "user" ? "#1976d2" : "#f5f5f5",
                        mx: 1,
                      }}
                    >
                      {message.sender === "user" ? (
                        <PersonIcon sx={{ fontSize: 18, color: "white" }} />
                      ) : (
                        <BotIcon sx={{ fontSize: 18, color: "#1976d2" }} />
                      )}
                    </Avatar>
                    <Paper
                      elevation={1}
                      sx={{
                        p: 1.5,
                        borderRadius: 2,
                        bgcolor: message.sender === "user" ? "#1976d2" : "#f5f5f5",
                        color: message.sender === "user" ? "white" : "text.primary",
                      }}
                    >
                      <Typography variant="body2">{message.text}</Typography>
                      <Typography
                        variant="caption"
                        sx={{
                          opacity: 0.7,
                          display: "block",
                          mt: 0.5,
                          textAlign: message.sender === "user" ? "right" : "left",
                        }}
                      >
                        {formatTime(message.timestamp)}
                      </Typography>
                    </Paper>
                  </Box>
                </ListItem>
              ))}
              
              {/* Typing indicator */}
              {isTyping && (
                <ListItem sx={{ px: 1, py: 0.5 }}>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Avatar sx={{ width: 32, height: 32, bgcolor: "#f5f5f5", mr: 1 }}>
                      <BotIcon sx={{ fontSize: 18, color: "#1976d2" }} />
                    </Avatar>
                    <Paper
                      elevation={1}
                      sx={{
                        p: 1.5,
                        borderRadius: 2,
                        bgcolor: "#f5f5f5",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <CircularProgress size={16} sx={{ mr: 1 }} />
                      <Typography variant="body2">Đang nhập...</Typography>
                    </Paper>
                  </Box>
                </ListItem>
              )}
            </List>
            <div ref={messagesEndRef} />
          </Box>

          {/* Quick Actions */}
          <Box sx={{ p: 1, borderTop: "1px solid #e0e0e0" }}>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
              {quickActions.map((action) => (
                <Chip
                  key={action}
                  label={action}
                  size="small"
                  variant="outlined"
                  onClick={() => setInputMessage(action)}
                  sx={{ fontSize: "0.7rem" }}
                />
              ))}
            </Box>
          </Box>

          {/* Input */}
          <Box sx={{ p: 1, borderTop: "1px solid #e0e0e0" }}>
            <form onSubmit={handleSendMessage} style={{ display: "flex", gap: 8 }}>
              <TextField
                fullWidth
                size="small"
                placeholder="Nhập tin nhắn..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                disabled={isTyping}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                  },
                }}
              />
              <IconButton
                type="submit"
                color="primary"
                disabled={!inputMessage.trim() || isTyping}
                sx={{
                  bgcolor: "primary.main",
                  color: "white",
                  "&:hover": { bgcolor: "primary.dark" },
                  "&:disabled": { bgcolor: "grey.300" },
                }}
              >
                <SendIcon />
              </IconButton>
            </form>
          </Box>
        </Paper>
      </Collapse>
    </>
  );
};

export default ChatBox;