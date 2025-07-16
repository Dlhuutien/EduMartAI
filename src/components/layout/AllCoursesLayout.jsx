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

const AllCoursesLayout = ({
  filteredProducts,
  loading,
  favorites,
  toggleFavorite,
  handleSelectProduct,
  selectedHistoryId,
  user,
}) => {
  const totalStudents = filteredProducts.reduce(
    (acc, p) => acc + Number(p.students || 0),
    0
  );

  const averageRating =
    filteredProducts.length > 0
      ? (
          filteredProducts.reduce(
            (acc, p) => acc + Number(p.rating || 0),
            0
          ) / filteredProducts.length
        ).toFixed(1)
      : 0;

  return (
    <>
      <Box sx={{ mb: 6 }}>
        <Grid container spacing={3} justifyContent="center">
          <Grid item xs={12} sm={4}>
            <Paper
              sx={{
                p: 3,
                borderRadius: 3,
                textAlign: "center",
                background: "linear-gradient(135deg, #1976d2, #42a5f5)",
                color: "white",
              }}
            >
              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                {filteredProducts.length}
              </Typography>
              <Typography>Khóa học</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Paper
              sx={{
                p: 3,
                borderRadius: 3,
                textAlign: "center",
                background: "linear-gradient(135deg, #ff9800, #ffb74d)",
                color: "white",
              }}
            >
              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                {totalStudents}
              </Typography>
              <Typography>Học viên đã học</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Paper
              sx={{
                p: 3,
                borderRadius: 3,
                textAlign: "center",
                background: "linear-gradient(135deg, #4caf50, #81c784)",
                color: "white",
              }}
            >
              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                {averageRating}/5.0
              </Typography>
              <Typography>Đánh giá trung bình</Typography>
            </Paper>
          </Grid>
        </Grid>
      </Box>

      {loading ? (
        <Box sx={{ textAlign: "center", py: 10 }}>
          <CircularProgress />
          <Typography sx={{ mt: 2 }}>Đang tải khóa học...</Typography>
        </Box>
      ) : (
        <Grid container spacing={3} justifyContent="center">
          {filteredProducts.map((product) => (
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

      {!loading && filteredProducts.length === 0 && (
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
            <Search sx={{ fontSize: 40, color: "grey.400" }} />
          </Avatar>
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            {selectedHistoryId === "history"
              ? "Chưa có lịch sử xem"
              : selectedHistoryId === "favorites"
              ? "Chưa có khóa học yêu thích"
              : "Không tìm thấy khóa học"}
          </Typography>
          <Typography color="text.secondary">
            {selectedHistoryId === "history"
              ? "Bạn chưa xem khóa học nào"
              : selectedHistoryId === "favorites"
              ? "Bạn chưa yêu thích khóa học nào"
              : "Hãy thử điều chỉnh tiêu chí tìm kiếm hoặc bộ lọc"}
          </Typography>
        </Box>
      )}
    </>
  );
};

export default AllCoursesLayout;