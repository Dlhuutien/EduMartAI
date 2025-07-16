import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Avatar,
  CircularProgress,
} from "@mui/material";
import { Search } from "@mui/icons-material";
import ProductCard from "../components/layout/ProductCard";
import ProductModal from "../components/ui/ProductModal";
import { fetchCourses } from "../services/courseService";

const formatPrice = (price) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);

const Home = ({ searchTerm, priceFilter, selectedHistoryId, onProductsLoaded }) => {
  const [favorites, setFavorites] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load favorites from localStorage
  useEffect(() => {
    const savedFavorites = JSON.parse(localStorage.getItem("courseFavorites")) || [];
    setFavorites(savedFavorites);
  }, []);

  useEffect(() => {
    const loadCourses = async () => {
      try {
        const response = await fetchCourses();
        setProducts(response.data);
        setFilteredProducts(response.data);
        // Truyền danh sách sản phẩm về App component
        if (onProductsLoaded) {
          onProductsLoaded(response.data);
        }
      } catch (error) {
        console.error("Lỗi khi gọi API khóa học:", error);
      } finally {
        setLoading(false);
      }
    };
    loadCourses();
  }, [onProductsLoaded]);

  useEffect(() => {
    if (selectedHistoryId === "history") {
      const history = JSON.parse(localStorage.getItem("courseHistory")) || [];
      setFilteredProducts(history);
    } else if (selectedHistoryId === "favorites") {
      const savedFavorites = JSON.parse(localStorage.getItem("courseFavorites")) || [];
      const favoriteProducts = products.filter(product => 
        savedFavorites.includes(product.id)
      );
      setFilteredProducts(favoriteProducts);
    } else if (selectedHistoryId === "all") {
      setFilteredProducts(products);
    } else if (selectedHistoryId) {
      const found = products.find(
        (p) => String(p.id) === String(selectedHistoryId)
      );
      if (found) {
        setFilteredProducts([found]);
      }
    } else {
      let filtered = [...products];

      if (searchTerm) {
        filtered = filtered.filter(
          (product) =>
            product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.shortDescription
              .toLowerCase()
              .includes(searchTerm.toLowerCase())
        );
      }

      if (priceFilter !== "all") {
        filtered = filtered.filter((product) => {
          if (priceFilter === "low") return product.price < 500000;
          if (priceFilter === "medium")
            return product.price >= 500000 && product.price <= 1000000;
          if (priceFilter === "high") return product.price > 1000000;
          return true;
        });
      }

      setFilteredProducts(filtered);
    }
  }, [searchTerm, priceFilter, products, selectedHistoryId]);

  const toggleFavorite = (id) => {
    const newFavorites = favorites.includes(id) 
      ? favorites.filter((f) => f !== id) 
      : [...favorites, id];
    
    setFavorites(newFavorites);
    localStorage.setItem("courseFavorites", JSON.stringify(newFavorites));
    // Trigger storage event for other components
    window.dispatchEvent(new Event("storage"));
  };

  const handleSelectProduct = (product) => {
    setSelectedProduct(product);

    if (selectedHistoryId) {
      const event = new CustomEvent("resetHistory");
      window.dispatchEvent(event);
    }

    if (!selectedHistoryId && product) {
      const history = JSON.parse(localStorage.getItem("courseHistory")) || [];
      const exists = history.find(
        (item) => String(item.id) === String(product.id)
      );
      if (!exists) {
        const updatedHistory = [product, ...history].slice(0, 10);
        localStorage.setItem("courseHistory", JSON.stringify(updatedHistory));
        window.dispatchEvent(new Event("storage"));
      }
    }
  };

  useEffect(() => {
    if (!selectedHistoryId && selectedProduct) {
      const history = JSON.parse(localStorage.getItem("courseHistory")) || [];
      const exists = history.find(
        (item) => String(item.id) === String(selectedProduct.id)
      );

      if (!exists) {
        const updatedHistory = [selectedProduct, ...history].slice(0, 10);
        localStorage.setItem("courseHistory", JSON.stringify(updatedHistory));
        window.dispatchEvent(new Event("storage"));
      }
    }
  }, [selectedProduct, selectedHistoryId]);

  return (
    <>
      <Box sx={{ py: 6, bgcolor: "background.default" }}>
        <Container maxWidth="xl">
          <Box sx={{ textAlign: "center", mb: 6 }}>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 700,
                background: "linear-gradient(45deg, #1976d2, #42a5f5)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                mb: 2,
                fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
              }}
            >
              {selectedHistoryId === "history" ? "Lịch sử xem" : 
               selectedHistoryId === "favorites" ? "Khóa học yêu thích" : 
               "Khám phá khóa học tuyệt vời"}
            </Typography>
            <Typography
              variant="h6"
              color="text.secondary"
              sx={{ maxWidth: 600, mx: "auto" }}
            >
              {selectedHistoryId === "history" ? "Các khóa học bạn đã xem gần đây" : 
               selectedHistoryId === "favorites" ? "Những khóa học bạn đã yêu thích" : 
               "Học từ các chuyên gia hàng đầu và phát triển sự nghiệp với những khóa học toàn diện"}
            </Typography>
          </Box>

          <Box sx={{ mb: 6 }}>
            <Grid container spacing={3}>
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
                    {products.reduce(
                      (acc, p) => acc + Number(p.students || 0),
                      0
                    )}
                  </Typography>
                  <Typography>Học viên</Typography>
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
                    4.8
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
            <Grid container spacing={3}>
              {filteredProducts.map((product) => (
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={4}
                  lg={3}
                  key={product.id}
                >
                  <Box sx={{ width: "100%" }}>
                    <ProductCard
                      product={product}
                      toggleFavorite={toggleFavorite}
                      favorites={favorites}
                      setSelectedProduct={handleSelectProduct}
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
                {selectedHistoryId === "history" ? "Chưa có lịch sử xem" :
                 selectedHistoryId === "favorites" ? "Chưa có khóa học yêu thích" :
                 "Không tìm thấy khóa học"}
              </Typography>
              <Typography color="text.secondary">
                {selectedHistoryId === "history" ? "Bạn chưa xem khóa học nào" :
                 selectedHistoryId === "favorites" ? "Bạn chưa yêu thích khóa học nào" :
                 "Hãy thử điều chỉnh tiêu chí tìm kiếm hoặc bộ lọc"}
              </Typography>
            </Box>
          )}
        </Container>
      </Box>

      <ProductModal
        product={selectedProduct}
        open={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </>
  );
};

export default Home;