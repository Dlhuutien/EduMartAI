import React, { useState } from "react";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  IconButton,
  Button,
  Chip,
  Rating,
  Zoom,
  Skeleton,
} from "@mui/material";
import { Favorite, FavoriteBorder, Group } from "@mui/icons-material";

const formatPrice = (price) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);

const ProductCard = ({
  product,
  toggleFavorite,
  favorites,
  setSelectedProduct,
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    toggleFavorite(product.id);
  };

  const handleDetailClick = (e) => {
    e.stopPropagation();
    setSelectedProduct(product);
  };

  const isFavorite = favorites.includes(product.id);

  return (
    <Zoom in={true} style={{ transitionDelay: "100ms" }}>
      <Card
        sx={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          cursor: "pointer",
          position: "relative",
          overflow: "hidden",
          "&:hover .card-image": { transform: "scale(1.05)" },
          "&:hover .card-overlay": { opacity: 1 },
        }}
        onClick={handleDetailClick}
      >
        <Box sx={{ position: "relative", overflow: "hidden" }}>
          {!imageLoaded && (
            <Skeleton
              variant="rectangular"
              width="100%"
              sx={{ aspectRatio: "16/9" }}
            />
          )}
          <CardMedia
            component="img"
            image={product.image}
            alt={product.name}
            className="card-image"
            onLoad={() => setImageLoaded(true)}
            sx={{
              display: imageLoaded ? "block" : "none",
              width: "100%",
              aspectRatio: "16/9",
              objectFit: "cover",
              objectPosition: "center",
              transition: "transform 0.3s ease-in-out",
            }}
          />

          {/* Overlay */}
          <Box
            className="card-overlay"
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background:
                "linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.6))",
              opacity: 0,
              transition: "opacity 0.3s ease-in-out",
              display: "flex",
              alignItems: "flex-end",
              p: 2,
            }}
          >
            <Button
              variant="contained"
              size="small"
              onClick={handleDetailClick}
              sx={{
                bgcolor: "white",
                color: "primary.main",
                "&:hover": { bgcolor: "grey.100" },
              }}
            >
              Xem chi tiết
            </Button>
          </Box>

          {/* Badge & Favorite */}
          <Chip
            label={product.category}
            size="small"
            sx={{
              position: "absolute",
              top: 12,
              left: 12,
              bgcolor: "secondary.main",
              color: "white",
              fontWeight: 600,
            }}
          />
          <IconButton
            onClick={handleFavoriteClick}
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              bgcolor: "rgba(255,255,255,0.9)",
              "&:hover": { bgcolor: "white" },
              transition: "all 0.2s ease-in-out",
            }}
          >
            {isFavorite ? (
              <Favorite sx={{ color: "red" }} />
            ) : (
              <FavoriteBorder />
            )}
          </IconButton>
        </Box>

        <CardContent sx={{ flexGrow: 1, p: 2 }}>
          <Typography
            variant="h6"
            gutterBottom
            sx={{
              fontWeight: 600,
              lineHeight: 1.2,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {product.name}
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mb: 2,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {product.shortDescription}
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <Rating
                value={product.rating}
                precision={0.1}
                size="small"
                readOnly
              />
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {product.rating}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <Group sx={{ fontSize: 16, color: "text.secondary" }} />
              <Typography variant="body2" color="text.secondary">
                {product.students}
              </Typography>
            </Box>
          </Box>

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography
              variant="h6"
              sx={{ fontWeight: 700, color: "secondary.main" }}
            >
              {formatPrice(product.price)}
            </Typography>
            <Chip
              label={product.duration}
              size="small"
              variant="outlined"
              sx={{ fontSize: "0.75rem" }}
            />
          </Box>
        </CardContent>
      </Card>
    </Zoom>
  );
};

export default ProductCard;