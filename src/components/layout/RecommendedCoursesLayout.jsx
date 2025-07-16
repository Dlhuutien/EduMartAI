import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Avatar,
  CircularProgress,
  Tabs,
  Tab,
} from "@mui/material";
import { Search, Favorite, School } from "@mui/icons-material";
import ProductCard from "./ProductCard";
import ProductModal from "../ui/ProductModal";
import { fetchCourses } from "../../services/courseService";
import { getUserByUID, updateUserFavorites } from "../../services/userService";
import CourseThumnail from "./CourseThumnail";
const RecommendedCoursesLayout = ({
  recommendedCourses,
  favoriteProducts,
  loading,
  favorites,
  toggleFavorite,
  handleSelectProduct,
  user,
}) => {
  return (
    <>
      {/* Recommended Courses Section */}
      <Box sx={{ mb: 4 }}>
        <Paper
          sx={{
            p: 4,
            borderRadius: 3,
            background: "linear-gradient(90deg, #00897b, #d4af37)",
            color: "white",
            mb: 4,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
            <School sx={{ fontSize: 30 }} />
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              Khóa học đề xuất cho bạn
            </Typography>
          </Box>
          <Typography sx={{ opacity: 0.9 }}>
            Dựa trên sở thích học tập của bạn
          </Typography>
        </Paper>

        {loading ? (
          <Box sx={{ textAlign: "center", py: 10 }}>
            <CircularProgress />
            <Typography sx={{ mt: 2 }}>Đang tải đề xuất...</Typography>
          </Box>
        ) : (
          <Grid container spacing={3} justifyContent="center">
            {recommendedCourses.map((product) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
                <Box sx={{ width: "100%" }}>
                  <ProductCard
                    product={product}
                    toggleFavorite={toggleFavorite}
                    favorites={favorites}
                    setSelectedProduct={handleSelectProduct}
                    user={user}
                  />
                </Box>
              </Grid>
            ))}
          </Grid>
        )}

        {!loading && recommendedCourses.length === 0 && (
          <Box sx={{ textAlign: "center", py: 8 }}>
            <Avatar
              sx={{
                width: 80,
                height: 80,
                bgcolor: "grey.100",
                mx: "auto",
                mb: 2,
              }}
            >
              <School sx={{ fontSize: 40, color: "grey.400" }} />
            </Avatar>
            <Typography variant="h5" sx={{ fontWeight: 600 }}>
              Chưa có đề xuất
            </Typography>
            <Typography color="text.secondary">
              Hãy thêm một số khóa học vào danh sách yêu thích để nhận được đề
              xuất phù hợp
            </Typography>
          </Box>
        )}
      </Box>
    </>
  );
};
export default RecommendedCoursesLayout;