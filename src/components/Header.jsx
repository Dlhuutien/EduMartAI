import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Container,
  Box,
  Typography,
  IconButton,
  InputAdornment,
  TextField,
  Select,
  MenuItem,
  Badge,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  Menu,
  Search,
  ShoppingCart,
  School,
  Favorite,
  FavoriteBorder,
} from "@mui/icons-material";

const Header = ({
  searchTerm,
  setSearchTerm,
  priceFilter,
  setPriceFilter,
  onToggleDrawer,
}) => {
  const [scrolled, setScrolled] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
          sx={{ display: "flex", alignItems: "center", gap: 2 }}
        >
          {/* Logo & Menu */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <IconButton
              edge="start"
              onClick={onToggleDrawer}
              sx={{
                display: { xs: "flex", md: "none" },
                color: "inherit",
                "&:hover": { bgcolor: "rgba(255,255,255,0.1)" },
              }}
            >
              <Menu />
            </IconButton>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 700,
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <School sx={{ fontSize: 30 }} />
              <Box component="span">
                <Box
                  component="span"
                  sx={{ color: "secondary.main", display: "inline" }}
                >
                  AI
                </Box>
                llecta
              </Box>
            </Typography>
          </Box>

          {/* Search & Filter */}
          <Box sx={{ flexGrow: 1, maxWidth: 600, mx: "auto" }}>
            <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
              <TextField
                fullWidth
                variant="outlined"
                size="small"
                placeholder="Tìm kiếm khóa học..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search sx={{ color: "text.secondary" }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    bgcolor: "background.paper",
                    "&:hover": { bgcolor: "background.paper" },
                    "&.Mui-focused": { bgcolor: "background.paper" },
                  },
                }}
              />
              <Select
                value={priceFilter}
                onChange={(e) => setPriceFilter(e.target.value)}
                size="small"
                sx={{
                  minWidth: 140,
                  bgcolor: "background.paper",
                  "&:hover": { bgcolor: "background.paper" },
                }}
              >
                <MenuItem value="all">Tất cả giá</MenuItem>
                <MenuItem value="low">Dưới 500K</MenuItem>
                <MenuItem value="medium">500K - 1M</MenuItem>
                <MenuItem value="high">Trên 1M</MenuItem>
              </Select>
            </Box>
          </Box>

          {/* Cart */}
          <IconButton
            sx={{
              color: "inherit",
              "&:hover": { bgcolor: "rgba(255,255,255,0.1)" },
            }}
          >
            <Badge badgeContent={3} color="secondary">
              <ShoppingCart />
            </Badge>
          </IconButton>
        </Container>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
