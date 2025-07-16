import React, { useState, useRef, useEffect, useCallback } from "react";
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
  Divider,
  CircularProgress,
  Chip,
  Badge,
} from "@mui/material";
import {
  Chat as ChatIcon,
  Send as SendIcon,
  Close as CloseIcon,
  SmartToy as BotIcon,
  Person as PersonIcon,
  DeleteForever,
} from "@mui/icons-material";
import { fetchCourses } from "../../services/courseService";
import ProductModal from "../ui/ProductModal";
import AIllectaLogo from "../../assets/logoAIllecta.png";

const CHAT_STATES = {
  CLOSED: "closed",
  OPEN: "open",
  MINIMIZED: "minimized",
};

const MESSAGE_TYPES = {
  USER: "user",
  BOT: "bot",
};

const QUICK_ACTIONS = [
  // { label: "Tìm khóa học phù hợp", keyword: "khóa học" },
  { label: "Tư vấn giá cả", keyword: "giá" },
  { label: "Hướng dẫn học tập", keyword: "học" },
  { label: "Hỗ trợ kỹ thuật", keyword: "hỗ trợ" },
];

const ChatBot = ({ user }) => {
  // State management
  const [chatState, setChatState] = useState(CHAT_STATES.CLOSED);
  const [courseList, setCourseList] = useState([]);
  const [isLoadingCourses, setIsLoadingCourses] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [suggestedCourses, setSuggestedCourses] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // Refs
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Initialize welcome message
  const welcomeMessage = {
    id: 1,
    text: `Xin chào${
      user?.name ? ` ${user.name}` : ""
    }! Tôi là trợ lý AI của bạn. Tôi có thể giúp bạn tìm kiếm khóa học, tư vấn học tập, hoặc trả lời các câu hỏi về nền tảng. Bạn cần hỗ trợ gì?`,
    sender: MESSAGE_TYPES.BOT,
    timestamp: new Date(),
  };

  // Utility functions
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const formatTime = useCallback((timestamp) => {
    return new Date(timestamp).toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }, []);

  const addMessage = useCallback(
    (message) => {
      const newMessage = {
        id: Date.now() + Math.random(),
        timestamp: new Date(),
        ...message,
      };

      setMessages((prev) => [...prev, newMessage]);

      // Increment unread count if chat is closed and message is from bot
      if (
        chatState === CHAT_STATES.CLOSED &&
        message.sender === MESSAGE_TYPES.BOT
      ) {
        setUnreadCount((prev) => prev + 1);
      }

      return newMessage;
    },
    [chatState]
  );

  // Load courses on mount
  useEffect(() => {
    const loadCourses = async () => {
      setIsLoadingCourses(true);
      try {
        const response = await fetchCourses();
        setCourseList(response.data || []);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách khóa học:", error);
        // Add error message to chat
        addMessage({
          text: "Xin lỗi, tôi không thể tải danh sách khóa học lúc này. Vui lòng thử lại sau.",
          sender: MESSAGE_TYPES.BOT,
        });
      } finally {
        setIsLoadingCourses(false);
      }
    };

    loadCourses();
  }, [addMessage]);

  // Initialize chat with welcome message
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([welcomeMessage]);
    }
  }, []);

  // Auto scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Focus input when chat opens
  useEffect(() => {
    if (chatState === CHAT_STATES.OPEN) {
      setUnreadCount(0);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [chatState]);

  const findCoursesByKeyword = useCallback(
    (keyword) => {
      if (!courseList.length) return [];

      const lowerKeyword = keyword.toLowerCase();
      return courseList.filter(
        (course) =>
          course.name.toLowerCase().includes(lowerKeyword) ||
          course.description?.toLowerCase().includes(lowerKeyword) ||
          course.tags?.some((tag) =>
            tag.toLowerCase().includes(lowerKeyword)
          ) ||
          course.category?.toLowerCase().includes(lowerKeyword)
      );
    },
    [courseList]
  );
  const generateAIResponse = useCallback(
    async (userMessage) => {
      setIsTyping(true);
      setSuggestedCourses([]);

      await new Promise((resolve) =>
        setTimeout(resolve, 800 + Math.random() * 1200)
      );

      const lowerMessage = userMessage.toLowerCase().trim();
      let response = "";
      let courseSuggestions = [];

      // Ưu tiên lọc theo giá trước
      const matchPriceAbove = lowerMessage.match(
        /(trên|>=|lớn hơn|hơn)\s*(\d+)/
      );
      const matchPriceBelow = lowerMessage.match(
        /(dưới|<=|nhỏ hơn|ít hơn)\s*(\d+)/
      );
      const matchPriceRange = lowerMessage.match(/(\d+)\s*(?:đến|-|~)\s*(\d+)/);
      const parsePrice = (text) => {
        const number = parseInt(text);
        if (text.includes("k") || text.includes("000")) {
          return number * 1000; // xử lý nếu người dùng viết 'k' hay 000
        }
        return number * 1000; // mặc định nhân 1000 vì người dùng hay nói "500K"
      };

      try {
        if (matchPriceRange) {
          const min = parsePrice(matchPriceRange[1]);
          const max = parsePrice(matchPriceRange[2]);

          courseSuggestions = courseList.filter(
            (c) => c.price >= min && c.price <= max
          );
          setSuggestedCourses(courseSuggestions.slice(0, 3));
          response = `Tôi tìm thấy ${courseSuggestions.length} khóa học trong khoảng từ ${min} đến ${max}K.`;
          setIsTyping(false);
          return response;
        } else if (matchPriceAbove) {
          const min = parsePrice(matchPriceAbove[2]);

          const filteredCourses = courseList.filter((c) => c.price >= min);
          setSuggestedCourses(filteredCourses.slice(0, 3));
          response = `Tôi tìm thấy ${filteredCourses.length} khóa học có giá từ ${min}K trở lên.`;
          setIsTyping(false);
          return response;
        } else if (matchPriceBelow) {
          const max = parsePrice(matchPriceBelow[2]);

          const filteredCourses = courseList.filter((c) => c.price <= max);
          setSuggestedCourses(filteredCourses.slice(0, 3));

          response = `Tôi tìm thấy ${filteredCourses.length} khóa học có giá dưới ${max}K.`;
          setIsTyping(false);
          return response;
        } else {
          // Xử lý keyword nếu không phải câu hỏi về giá
          const extractKeyword = (text) => {
            const stopWords = [
              "khóa",
              "về",
              "có",
              "nào",
              "học",
              "môn",
              "là",
              "cần",
              "tìm",
              "tìm kiếm",
              "xem",
              "các",
              "của",
              "muốn",
            ];
            return text
              .split(" ")
              .filter((word) => !stopWords.includes(word.toLowerCase()))
              .join(" ")
              .trim();
          };

          const cleanedKeyword = extractKeyword(lowerMessage);
          const keywordCourses = findCoursesByKeyword(cleanedKeyword);

          const isCourseSearch =
            lowerMessage.includes("khóa học") ||
            lowerMessage.includes("course") ||
            lowerMessage.includes("chủ đề") ||
            keywordCourses.length > 0;

          if (isCourseSearch) {
            courseSuggestions = keywordCourses;

            if (courseSuggestions.length > 0) {
              response = `Tôi tìm thấy ${courseSuggestions.length} khóa học phù hợp. Nhấn vào tên khóa học để xem chi tiết.`;
              setSuggestedCourses(courseSuggestions.slice(0, 3));
            } else {
              response = `Không tìm thấy khóa học nào với từ khóa "${cleanedKeyword}". Bạn có thể thử lại với chủ đề như "React", "Java", "thiết kế"...`;
            }
          } else if (
            lowerMessage.includes("giá") ||
            lowerMessage.includes("price")
          ) {
            if (courseList.length > 0) {
              const sortedCourses = [...courseList]
                .filter((course) => course.price > 0)
                .sort((a, b) => a.price - b.price);
              courseSuggestions = sortedCourses.slice(0, 3);
              setSuggestedCourses(courseSuggestions);
              response = `Dưới đây là các khóa học có giá tốt nhất hiện tại:`;
            } else {
              response = `Tôi đang tải thông tin về giá khóa học. Vui lòng đợi một chút.`;
            }
          } else if (
            lowerMessage.includes("học") ||
            lowerMessage.includes("tư vấn") ||
            lowerMessage.includes("advice")
          ) {
            response = `Để học hiệu quả, tôi khuyên bạn nên:\n\n1. Đặt mục tiêu học tập rõ ràng\n2. Học đều đặn mỗi ngày (20-30 phút)\n3. Thực hành qua bài tập thực tế\n4. Tham gia cộng đồng học tập\n5. Ghi chú và tóm tắt kiến thức\n\nBạn đang muốn học về chủ đề nào cụ thể?`;
          } else if (
            lowerMessage.includes("xin chào") ||
            lowerMessage.includes("hello") ||
            lowerMessage.includes("hi") ||
            lowerMessage.includes("chào")
          ) {
            const userName = user?.name || "bạn";
            response = `Xin chào ${userName}! Tôi rất vui được hỗ trợ bạn hôm nay. Tôi có thể giúp bạn:\n\n• Tìm khóa học phù hợp\n• Tư vấn lộ trình học tập\n• Giải đáp thắc mắc về nền tảng\n\nBạn muốn bắt đầu với gì?`;
          } else if (
            lowerMessage.includes("giúp") ||
            lowerMessage.includes("help") ||
            lowerMessage.includes("hỗ trợ")
          ) {
            response = `Tôi có thể hỗ trợ bạn trong các vấn đề sau:\n\n**Tìm kiếm khóa học:**\n- Theo tên, chủ đề, hoặc giá cả\n- Gợi ý khóa học phù hợp\n\n**Tư vấn học tập:**\n- Lộ trình học tập cá nhân\n- Phương pháp học hiệu quả\n\n**Hỗ trợ kỹ thuật:**\n- Hướng dẫn sử dụng nền tảng\n- Giải đáp thắc mắc\n\nBạn cần hỗ trợ gì cụ thể?`;
          } else if (
            lowerMessage.includes("lỗi") ||
            lowerMessage.includes("error") ||
            lowerMessage.includes("bug")
          ) {
            response = `Tôi hiểu bạn đang gặp vấn đề kỹ thuật. Để hỗ trợ tốt nhất, bạn có thể:\n\n1. Thử làm mới trang (F5)\n2. Xóa cache trình duyệt\n3. Kiểm tra kết nối internet\n4. Thử trên thiết bị khác\n\nNếu vẫn gặp vấn đề, hãy mô tả chi tiết lỗi để tôi hỗ trợ bạn tốt hơn.`;
          } else {
            const suggestions = [
              '"Tìm khóa học React"',
              '"Giá khóa học dưới 500K"',
              '"Tư vấn học lập trình"',
              '"Hỗ trợ kỹ thuật"',
            ];

            response = `Tôi chưa hiểu rõ yêu cầu của bạn. Bạn có thể hỏi cụ thể hơn về:\n\n• Tìm kiếm khóa học\n• Tư vấn học tập\n• Hỗ trợ kỹ thuật\n\nVí dụ: ${suggestions.join(
              ", "
            )}`;
          }
        }
      } catch (error) {
        console.error("Error generating AI response:", error);
        response =
          "Xin lỗi, tôi đang gặp vấn đề kỹ thuật. Vui lòng thử lại sau.";
      } finally {
        setIsTyping(false);
      }

      return response;
    },
    [courseList, findCoursesByKeyword, user?.name]
  );

  const handleSendMessage = useCallback(
    async (e) => {
      e.preventDefault();
      if (!inputMessage.trim() || isTyping) return;

      const userMessage = inputMessage.trim();
      setInputMessage("");

      addMessage({
        text: userMessage,
        sender: MESSAGE_TYPES.USER,
      });

      const aiResponse = await generateAIResponse(userMessage);
      addMessage({
        text: aiResponse,
        sender: MESSAGE_TYPES.BOT,
      });
    },
    [inputMessage, isTyping, addMessage, generateAIResponse]
  );

  const handleQuickAction = useCallback((action) => {
    setInputMessage(action.label);
    setTimeout(() => inputRef.current?.focus(), 100);
  }, []);

  const toggleChat = useCallback(() => {
    setChatState((prev) =>
      prev === CHAT_STATES.CLOSED ? CHAT_STATES.OPEN : CHAT_STATES.CLOSED
    );
  }, []);

  const clearChat = useCallback(() => {
    setMessages([
      {
        id: Date.now(),
        text: "Cuộc trò chuyện đã được xóa. Tôi có thể giúp gì khác cho bạn?",
        sender: MESSAGE_TYPES.BOT,
        timestamp: new Date(),
      },
    ]);
    setSuggestedCourses([]);
  }, []);

  const handleProductSelect = useCallback((product) => {
    setSelectedProduct(product);
    setModalOpen(true);
  }, []);

  const handleModalClose = useCallback(() => {
    setModalOpen(false);
    setSelectedProduct(null);
  }, []);

  return (
    <>
      {/* Chat Toggle Button */}
      <Box
        sx={{
          position: "fixed",
          bottom: 30,
          right: 20,
          zIndex: 1300,
        }}
      >
        <Badge badgeContent={unreadCount} color="error">
          <Fab
            color="primary"
            aria-label="chat"
            onClick={toggleChat}
            sx={{
              background: "#00897b",
              "&:hover": {
                background: "#d4af37",
              },
            }}
          >
            {chatState === CHAT_STATES.OPEN ? <CloseIcon /> : <ChatIcon />}
          </Fab>
        </Badge>
      </Box>

      {/* Chat Window */}
      <Collapse in={chatState === CHAT_STATES.OPEN} unmountOnExit>
        <Paper
          elevation={8}
          sx={{
            position: "fixed",
            bottom: 90,
            right: 20,
            width: 350,
            height: 450,
            // maxHeight: "calc(100vh - 120px)",
            zIndex: 1300,
            borderRadius: 3,
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            bgcolor: "linear-gradient(90deg, #00897b, #d4af37)",
          }}
        >
          {/* Header */}
          <Box
            sx={{
              p: 2,
              background: "linear-gradient(90deg, #00897b, #d4af37)",
              color: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Avatar
                src={AIllectaLogo}
                alt="AIlecta"
                sx={{ width: 40, height: 40, bgcolor: "transparent", mr: 1.5 }}
              />
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  Trợ lý AI
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.9 }}>
                  {isTyping ? "Đang soạn tin..." : "Sẵn sàng hỗ trợ"}
                </Typography>
              </Box>
            </Box>
            <IconButton
              size="small"
              onClick={clearChat}
              sx={{ color: "white" }}
              title="Xóa cuộc trò chuyện"
            >
              <DeleteForever />
            </IconButton>
          </Box>

          {/* Messages Area */}
          <Box sx={{ flex: 1, overflow: "auto", p: 1 }}>
            {isLoadingCourses && (
              <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
                <CircularProgress size={20} />
                <Typography variant="body2" sx={{ ml: 1 }}>
                  Đang tải thông tin khóa học...
                </Typography>
              </Box>
            )}

            <List sx={{ py: 0 }}>
              {messages.map((message) => (
                <ListItem
                  key={message.id}
                  sx={{
                    display: "flex",
                    justifyContent:
                      message.sender === MESSAGE_TYPES.USER
                        ? "flex-end"
                        : "flex-start",
                    px: 1,
                    py: 0.5,
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "flex-end",
                      maxWidth: "85%",
                      flexDirection:
                        message.sender === MESSAGE_TYPES.USER
                          ? "row-reverse"
                          : "row",
                    }}
                  >
                    <Avatar
                      sx={{
                        width: 32,
                        height: 32,
                        bgcolor:
                          message.sender === MESSAGE_TYPES.USER
                            ? "#1976d2"
                            : "#f5f5f5",
                        mx: 1,
                      }}
                    >
                      {message.sender === MESSAGE_TYPES.USER ? (
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
                        bgcolor:
                          message.sender === MESSAGE_TYPES.USER
                            ? "#1976d2"
                            : "#f8f9fa",
                        color:
                          message.sender === MESSAGE_TYPES.USER
                            ? "white"
                            : "text.primary",
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{
                          whiteSpace: "pre-line",
                          wordBreak: "break-word",
                        }}
                      >
                        {message.text}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{
                          opacity: 0.7,
                          display: "block",
                          mt: 0.5,
                          textAlign:
                            message.sender === MESSAGE_TYPES.USER
                              ? "right"
                              : "left",
                        }}
                      >
                        {formatTime(message.timestamp)}
                      </Typography>
                    </Paper>
                  </Box>
                </ListItem>
              ))}

              {/* Course Suggestions */}
              {suggestedCourses.length > 0 && (
                <Box sx={{ px: 2, mt: 1 }}>
                  <Divider sx={{ my: 1 }} />
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ mb: 1, display: "block" }}
                  >
                    Gợi ý khóa học:
                  </Typography>
                  {suggestedCourses.map((course) => (
                    <Paper
                      key={course.id}
                      elevation={1}
                      sx={{
                        p: 1.5,
                        mb: 1,
                        borderRadius: 2,
                        cursor: "pointer",
                        transition: "all 0.2s",
                        border: "1px solid #e0e0e0",
                        "&:hover": {
                          bgcolor: "primary.light",
                          color: "white",
                          transform: "translateY(-1px)",
                          boxShadow: 2,
                        },
                      }}
                      onClick={() => handleProductSelect(course)}
                    >
                      <Typography
                        variant="subtitle2"
                        sx={{ fontWeight: 600, mb: 0.5 }}
                      >
                        {course.name}
                      </Typography>
                      <Typography variant="body2" sx={{ opacity: 0.8 }}>
                        {course.price?.toLocaleString() || "Miễn phí"}{" "}
                        {course.price ? "VNĐ" : ""}
                      </Typography>
                      {course.rating && (
                        <Typography
                          variant="caption"
                          sx={{ display: "block", mt: 0.5 }}
                        >
                          ⭐ {course.rating}/5
                        </Typography>
                      )}
                    </Paper>
                  ))}
                </Box>
              )}

              {/* Typing Indicator */}
              {isTyping && (
                <ListItem sx={{ px: 1, py: 0.5 }}>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Avatar
                      sx={{ width: 32, height: 32, bgcolor: "#f5f5f5", mr: 1 }}
                    >
                      <BotIcon sx={{ fontSize: 18, color: "#1976d2" }} />
                    </Avatar>
                    <Paper
                      elevation={1}
                      sx={{
                        p: 1.5,
                        borderRadius: 2,
                        bgcolor: "#f8f9fa",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <CircularProgress size={16} sx={{ mr: 1 }} />
                      <Typography variant="body2">Đang soạn tin...</Typography>
                    </Paper>
                  </Box>
                </ListItem>
              )}
            </List>
            <div ref={messagesEndRef} />
          </Box>

          {/* Quick Actions */}
          <Box
            sx={{ p: 1, borderTop: "1px solid #e0e0e0", bgcolor: "#fafafa" }}
          >
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ mb: 1, display: "block" }}
            >
              Gợi ý nhanh:
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
              {QUICK_ACTIONS.map((action) => (
                <Chip
                  key={action.label}
                  label={action.label}
                  size="small"
                  variant="outlined"
                  onClick={() => handleQuickAction(action)}
                  sx={{
                    fontSize: "0.75rem",
                    "&:hover": {
                      bgcolor: "primary.main",
                      color: "white",
                    },
                  }}
                />
              ))}
            </Box>
          </Box>

          {/* Input Area */}
          <Box
            sx={{ p: 1.5, borderTop: "1px solid #e0e0e0", bgcolor: "white" }}
          >
            <form
              onSubmit={handleSendMessage}
              style={{ display: "flex", gap: 8 }}
            >
              <TextField
                ref={inputRef}
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
                  bgcolor: "#00897b",
                  color: "white",
                  "&:hover": { bgcolor: "#d4af37" },
                  "&:disabled": { bgcolor: "grey.300" },
                }}
              >
                <SendIcon />
              </IconButton>
            </form>
          </Box>
        </Paper>
      </Collapse>

      {/* Product Modal */}
      <ProductModal
        product={selectedProduct}
        open={modalOpen}
        onClose={handleModalClose}
      />
    </>
  );
};

export default ChatBot;
