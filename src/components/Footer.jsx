import React from "react";
import {
  Box,
  Container,
  Grid,
  Typography,
  IconButton,
  TextField,
  Button,
  Divider,
} from "@mui/material";
import {
  Facebook,
  Instagram,
  GitHub,
  YouTube,
  Phone,
  Email,
  LocationOn,
} from "@mui/icons-material";

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        background: "linear-gradient(135deg, #1976d2 0%, #1565c0 100%)",
        color: "white",
        py: 6,
        mt: 8,
      }}
    >
      <Container maxWidth="xl">
        <Grid container spacing={4}>
          <Grid item xs={12} md={3}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 700 }}>
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
            <Typography variant="body2" sx={{ mb: 3, opacity: 0.8 }}>
              Trao quyền cho người học trên toàn thế giới với công nghệ tiên
              tiến và hướng dẫn chuyên nghiệp.
            </Typography>
            <Box sx={{ display: "flex", gap: 1 }}>
              {[Facebook, Instagram, GitHub, YouTube].map((Icon, i) => (
                <IconButton
                  key={i}
                  sx={{
                    color: "white",
                    bgcolor: "rgba(255,255,255,0.1)",
                    "&:hover": {
                      bgcolor: "secondary.main",
                      transform: "translateY(-2px)",
                    },
                    transition: "all 0.3s ease",
                  }}
                >
                  <Icon />
                </IconButton>
              ))}
            </Box>
          </Grid>

          <Grid item xs={12} md={3}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              Liên kết nhanh
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              {["Trang chủ", "Giới thiệu", "Khóa học", "Liên hệ"].map(
                (link) => (
                  <Typography
                    key={link}
                    variant="body2"
                    sx={{
                      opacity: 0.8,
                      cursor: "pointer",
                      "&:hover": { color: "secondary.main" },
                    }}
                  >
                    {link}
                  </Typography>
                )
              )}
            </Box>
          </Grid>

          <Grid item xs={12} md={3}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              Hỗ trợ
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Phone sx={{ fontSize: 20, color: "secondary.main" }} />
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                  0386474751
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Email sx={{ fontSize: 20, color: "secondary.main" }} />
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                  Danglehuutien000@gmail.com
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <LocationOn sx={{ fontSize: 20, color: "secondary.main" }} />
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                  TP. Hồ Chí Minh, Việt Nam
                </Typography>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12} md={3}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              Nhận tin mới
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.8, mb: 2 }}>
              Đăng ký để nhận thông tin các khóa học mới và ưu đãi đặc biệt.
            </Typography>
            <TextField
              fullWidth
              size="small"
              placeholder="Nhập email của bạn"
              variant="outlined"
              sx={{
                input: { color: "white" },
                "& .MuiOutlinedInput-root": {
                  bgcolor: "rgba(255,255,255,0.1)",
                  color: "white",
                  "& fieldset": { borderColor: "white" },
                  "&:hover fieldset": { borderColor: "secondary.main" },
                  "&.Mui-focused fieldset": { borderColor: "secondary.main" },
                },
              }}
            />
            <Button
              variant="contained"
              color="secondary"
              sx={{ mt: 2, fontWeight: 600, borderRadius: 2 }}
              fullWidth
            >
              Đăng ký
            </Button>
          </Grid>
        </Grid>
        <Divider sx={{ my: 4, borderColor: "rgba(255,255,255,0.2)" }} />
        <Typography variant="body2" align="center" sx={{ opacity: 0.7 }}>
          © {new Date().getFullYear()} AIllecta. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;
