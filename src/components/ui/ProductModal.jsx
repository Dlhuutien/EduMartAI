import React from "react";
import {
  Modal,
  Fade,
  Paper,
  Box,
  IconButton,
  Typography,
  CardMedia,
  Chip,
  Rating,
  Button
} from "@mui/material";
import { Close, Group } from "@mui/icons-material";
import formatPrice from "../utils/formatPrice";

const ProductModal = ({ product, open, onClose }) => {
  if (!product) return null;

  return (
    <Modal
      open={open}
      onClose={onClose}
      closeAfterTransition
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
      }}
    >
      <Fade in={open}>
        <Paper
          sx={{
            maxWidth: 600,
            width: '100%',
            maxHeight: '90vh',
            overflow: 'auto',
            borderRadius: 3,
            outline: 'none',
          }}
        >
          <Box sx={{ position: 'relative' }}>
            <IconButton
              onClick={onClose}
              sx={{
                position: 'absolute',
                top: 8,
                right: 8,
                bgcolor: 'rgba(255,255,255,0.9)',
                '&:hover': { bgcolor: 'white' },  
                zIndex: 1,
              }}
            >
              <Close />
            </IconButton>

            <CardMedia
              component="img"
              height="300"
              image={product.image}
              alt={product.name}
            />
          </Box>

          <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <Chip label={product.category} color="secondary" size="small" />
              <Typography variant="body2" color="text.secondary">
                {product.instructor}
              </Typography>
            </Box>

            <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
              {product.name}
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Rating value={product.rating} precision={0.1} size="small" readOnly />
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {product.rating}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Group sx={{ fontSize: 20, color: 'text.secondary' }} />
                <Typography variant="body2" color="text.secondary">
                  {product.students} học viên
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                {product.duration}
              </Typography>
            </Box>

            <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.6 }}>
              {product.longDescription}
            </Typography>

            <Paper
              sx={{
                p: 3,
                bgcolor: 'grey.50',
                borderRadius: 2,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 700, color: 'secondary.main' }}>
                  {formatPrice(product.price)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Truy cập trọn đời
                </Typography>
              </Box>
              <Button
                variant="contained"
                size="large"
                sx={{
                  px: 4,
                  py: 1.5,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #1565c0, #1976d2)',
                  },
                }}
              >
                Đăng ký ngay
              </Button>
            </Paper>
          </Box>
        </Paper>
      </Fade>
    </Modal>
  );
};

export default ProductModal;
