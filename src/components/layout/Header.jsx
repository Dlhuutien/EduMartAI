import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Container,
  Box,
  Typography,
  IconButton,
  Badge,
  useTheme,
  useMediaQuery,
  Menu,
  MenuItem,
  Divider,
} from "@mui/material";
import {
  School,
  AccountCircle,
  History,
  Menu as MenuIcon,
  Favorite,
  ViewList,
} from "@mui/icons-material";
import LoginWithGoogle from "../ui/LoginWithGoogle";
import { signOut } from "firebase/auth";
import { auth } from "../../config/firebase";
import { useNavigate } from "react-router-dom";
import AIllectaLogo from "../../assets/logoAIllecta.png";

const Header = ({ onToggleDrawer, user, onLogin, onSelectHistoryItem }) => {
  const [scrolled, setScrolled] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [history, setHistory] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const navigate = useNavigate();

  const [mobileMenuAnchor, setMobileMenuAnchor] = useState(null);
  const [historyMenuAnchor, setHistoryMenuAnchor] = useState(null);
  const [userMenuAnchor, setUserMenuAnchor] = useState(null);

  const handleLogout = async () => {
    await signOut(auth);
    setUserMenuAnchor(null);
    localStorage.removeItem("user");
    onLogin(null);
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const loadHistory = () => {
      const savedHistory =
        JSON.parse(localStorage.getItem("courseHistory")) || [];
      setHistory(savedHistory);
    };

    const loadFavorites = () => {
      const savedFavorites =
        JSON.parse(localStorage.getItem("courseFavorites")) || [];
      setFavorites(savedFavorites);
    };

    loadHistory();
    loadFavorites();

    const handleStorageChange = (e) => {
      if (e.key === "courseHistory") {
        loadHistory();
      }
      if (e.key === "courseFavorites") {
        loadFavorites();
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const handleMobileMenuSelect = (action) => {
    if (action === "toggleDrawer") {
      onToggleDrawer();
    } else {
      onSelectHistoryItem(action);
    }
    setMobileMenuAnchor(null);
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        background: scrolled
          ? "rgba(255, 255, 255, 0.95)"
          : "linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)",
        backdropFilter: scrolled ? "blur(10px)" : "none",
        boxShadow: scrolled ? "0 4px 20px rgba(0,0,0,0.1)" : "none",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        color: scrolled ? "#1976d2" : "white",
      }}
    >
      <Toolbar sx={{ py: 1 }}>
        <Container
          maxWidth="xl"
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {/* Mobile Menu Button */}
            <IconButton
              edge="start"
              onClick={(e) => setMobileMenuAnchor(e.currentTarget)}
              sx={{
                display: { xs: "flex", md: "none" },
                color: "inherit",
                "&:hover": { bgcolor: "rgba(255,255,255,0.1)" },
              }}
            >
              <MenuIcon />
            </IconButton>

            {/* Logo */}
            <Box sx={{ display: "flex", alignItems: "center"}}>
              <img
                src={AIllectaLogo}
                alt="AIlecta Logo"
                style={{ height: 36, borderRadius: 4 }}
              />
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  color: scrolled ? "primary.main" : "white",
                }}
              >
                <Box
                  component="span"
                  sx={{ color: "secondary.main", display: "inline" }}
                >
                  AI
                </Box>
                llecta
              </Typography>
            </Box>
          </Box>

          {/* Desktop Right Side */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {/* Desktop History Menu */}
            {/* User Avatar/Login */}
            {!user ? (
              <LoginWithGoogle onLoginSuccess={onLogin} />
            ) : (
              <IconButton
                onClick={(e) => setUserMenuAnchor(e.currentTarget)}
                sx={{ p: 0 }}
              >
                <img
                  src={user.photoURL}
                  alt="avatar"
                  style={{ width: 36, height: 36, borderRadius: "50%" }}
                />
              </IconButton>
            )}
            <IconButton
              onClick={(e) => setHistoryMenuAnchor(e.currentTarget)}
              sx={{
                display: { xs: "none", md: "flex" },
                color: "inherit",
                "&:hover": { bgcolor: "rgba(255,255,255,0.1)" },
              }}
            >
              <MenuIcon />
            </IconButton>
          </Box>

          {/* Mobile Menu */}
          <Menu
            anchorEl={mobileMenuAnchor}
            open={Boolean(mobileMenuAnchor)}
            onClose={() => setMobileMenuAnchor(null)}
            PaperProps={{
              sx: {
                mt: 1,
                minWidth: 200,
                borderRadius: 2,
                boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
              },
            }}
          >
            <Divider />
            <MenuItem
              onClick={() => handleMobileMenuSelect("history")}
              sx={{
                py: 1.5,
                "&:hover": {
                  bgcolor: "primary.light",
                  color: "primary.contrastText",
                },
              }}
            >
              <History sx={{ mr: 2 }} />
              Lịch sử xem ({history.length})
            </MenuItem>
            {user && (
              <MenuItem
                onClick={() => handleMobileMenuSelect("favorites")}
                sx={{
                  py: 1.5,
                  "&:hover": {
                    bgcolor: "primary.light",
                    color: "primary.contrastText",
                  },
                }}
              >
                <Favorite sx={{ mr: 2 }} />
                Yêu thích ({favorites.length})
              </MenuItem>
            )}

            <MenuItem
              onClick={() => {
                handleMobileMenuSelect(null);
                navigate("/");
              }}
              sx={{
                py: 1.5,
                "&:hover": {
                  bgcolor: "primary.light",
                  color: "primary.contrastText",
                },
              }}
            >
              <ViewList sx={{ mr: 2 }} />
              Xem tất cả
            </MenuItem>
          </Menu>

          {/* Desktop History Menu */}
          <Menu
            anchorEl={historyMenuAnchor}
            open={Boolean(historyMenuAnchor)}
            onClose={() => setHistoryMenuAnchor(null)}
            PaperProps={{
              sx: {
                mt: 1,
                minWidth: 200,
                borderRadius: 2,
                boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
              },
            }}
          >
            <MenuItem
              onClick={() => {
                onSelectHistoryItem("history");
                setHistoryMenuAnchor(null);
                navigate("/");
              }}
              sx={{
                py: 1.5,
                "&:hover": {
                  bgcolor: "primary.light",
                  color: "primary.contrastText",
                },
              }}
            >
              <History sx={{ mr: 2 }} />
              Lịch sử xem ({history.length})
            </MenuItem>
            {user && (
              <MenuItem
                onClick={() => {
                  onSelectHistoryItem("favorites");
                  setHistoryMenuAnchor(null);
                }}
                sx={{
                  py: 1.5,
                  "&:hover": {
                    bgcolor: "primary.light",
                    color: "primary.contrastText",
                  },
                }}
              >
                <Favorite sx={{ mr: 2 }} />
                Yêu thích ({favorites.length})
              </MenuItem>
            )}

            <MenuItem
              onClick={() => {
                onSelectHistoryItem(null);
                setHistoryMenuAnchor(null);
                navigate("/");
              }}
              sx={{
                py: 1.5,
                "&:hover": {
                  bgcolor: "primary.light",
                  color: "primary.contrastText",
                },
              }}
            >
              <ViewList sx={{ mr: 2 }} />
              Xem tất cả
            </MenuItem>
          </Menu>

          {/* User Menu */}
          <Menu
            anchorEl={userMenuAnchor}
            open={Boolean(userMenuAnchor)}
            onClose={() => setUserMenuAnchor(null)}
            PaperProps={{
              sx: {
                mt: 1,
                minWidth: 200,
                borderRadius: 2,
                boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
              },
            }}
          >
            <MenuItem
              disabled
              sx={{
                fontWeight: "bold",
                py: 1.5,
                opacity: 0.8,
              }}
            >
              <AccountCircle sx={{ mr: 2 }} />
              {user?.displayName}
            </MenuItem>
            <Divider />
            <MenuItem
              onClick={handleLogout}
              sx={{
                color: "error.main",
                py: 1.5,
                "&:hover": {
                  bgcolor: "error.light",
                  color: "error.contrastText",
                },
              }}
            >
              Đăng xuất
            </MenuItem>
          </Menu>
        </Container>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
