import React from "react";
import {
  Box,
  Container,
  TextField,
  Select,
  MenuItem,
  InputAdornment,
  Paper,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { Search, FilterList } from "@mui/icons-material";

const Navbar = ({ searchTerm, setSearchTerm, priceFilter, setPriceFilter }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

  return (
    <Box
      sx={{
        mt: 8,
        py: isMobile ? 1.5 : 2,
        bgcolor: "background.paper",
        borderBottom: "1px solid",
        borderColor: "divider",
        position: "sticky",
        top: 56,
        zIndex: 1000,
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        backdropFilter: "blur(8px)",
        transition: "all 0.3s ease",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <Container maxWidth="xl">
        <Box
          sx={{
            display: "flex",
            gap: isMobile ? 1 : 2,
            alignItems: "center",
            flexDirection: isMobile ? "column" : "row",
            width: "100%",
          }}
        >
          <TextField
            fullWidth
            variant="outlined"
            size={isMobile ? "small" : "medium"}
            placeholder="Tìm kiếm khóa học..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search
                    sx={{
                      color: "text.secondary",
                      transition: "color 0.2s ease",
                    }}
                  />
                </InputAdornment>
              ),
            }}
            sx={{
              maxWidth: isMobile ? "100%" : isTablet ? 400 : 600,
              width: isMobile ? "100%" : "auto",
              "& .MuiOutlinedInput-root": {
                bgcolor: "background.default",
                borderRadius: 2,
                transition: "all 0.3s ease",
                position: "relative",
                zIndex: 1,
                "&::before": {
                  content: '""',
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  borderRadius: "8px",
                  padding: "2px",
                  background: "transparent",
                  WebkitMask:
                    "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                  WebkitMaskComposite: "xor",
                  pointerEvents: "none",
                  zIndex: -1,
                  transition: "background 0.3s ease",
                },
                "&:hover::before, &.Mui-focused::before": {
                  background: "linear-gradient(90deg, #00897b, #d4af37)",
                },
                "&:hover": {
                  transform: "translateY(-1px)",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
                },
                "&.Mui-focused": {
                  transform: "translateY(-1px)",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                },
                "& .MuiInputAdornment-root .MuiSvgIcon-root": {
                  transition: "color 0.3s ease",
                },
                "&:hover .MuiInputAdornment-root .MuiSvgIcon-root, &.Mui-focused .MuiInputAdornment-root .MuiSvgIcon-root":
                  {
                    color: "primary.main",
                  },
              },
              "& .MuiOutlinedInput-input": {
                fontSize: isMobile ? "0.875rem" : "1rem",
                "&::placeholder": {
                  color: "text.secondary",
                  opacity: 0.7,
                },
              },
            }}
          />
          <Select
            value={priceFilter}
            onChange={(e) => setPriceFilter(e.target.value)}
            size={isMobile ? "small" : "medium"}
            startAdornment={
              <InputAdornment position="start">
                <FilterList
                  sx={{
                    color: "text.secondary",
                    fontSize: isMobile ? "1rem" : "1.2rem",
                    ml: 1,
                  }}
                />
              </InputAdornment>
            }
            sx={{
              minWidth: isMobile ? 120 : isTablet ? 130 : 140,
              width: isMobile ? "100%" : "auto",
              bgcolor: "background.default",
              borderRadius: 2,
              fontSize: isMobile ? "0.875rem" : "1rem",
              transition: "all 0.3s ease",
              "&:hover": {
                // bgcolor: "background.default",
                background: "linear-gradient(90deg, #00897b, #d4af37)",
                boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
                transform: "translateY(-1px)",
                "& .MuiSelect-icon": {
                  color: "primary.main",
                },
              },
              "&.Mui-focused": {
                boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                transform: "translateY(-1px)",
              },
              "& .MuiSelect-select": {
                display: "flex",
                alignItems: "center",
                gap: 1,
              },
              "& .MuiSelect-icon": {
                transition: "all 0.2s ease",
              },
            }}
          >
            <MenuItem
              value="all"
              sx={{
                fontSize: isMobile ? "0.875rem" : "1rem",
                "&:hover": {
                  background: "linear-gradient(90deg, #00897b, #d4af37)",
                  color: "primary.contrastText",
                },
              }}
            >
              Tất cả giá
            </MenuItem>
            <MenuItem
              value="low"
              sx={{
                fontSize: isMobile ? "0.875rem" : "1rem",
                "&:hover": {
                  background: "linear-gradient(90deg, #00897b, #d4af37)",
                  color: "primary.contrastText",
                },
              }}
            >
              Dưới 500K
            </MenuItem>
            <MenuItem
              value="medium"
              sx={{
                fontSize: isMobile ? "0.875rem" : "1rem",
                "&:hover": {
                  background: "linear-gradient(90deg, #00897b, #d4af37)",
                  color: "primary.contrastText",
                },
              }}
            >
              500K - 1M
            </MenuItem>
            <MenuItem
              value="high"
              sx={{
                fontSize: isMobile ? "0.875rem" : "1rem",
                "&:hover": {
                  background: "linear-gradient(90deg, #00897b, #d4af37)",
                  color: "primary.contrastText",
                },
              }}
            >
              Trên 1M
            </MenuItem>
          </Select>
        </Box>
      </Container>
    </Box>
  );
};

export default Navbar;
