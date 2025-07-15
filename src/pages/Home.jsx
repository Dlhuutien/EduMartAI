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
import ProductCard from "../components/ProductCard";
import ProductModal from "../components/ProductModal";
import { fetchCourses } from "../services/courseService";

const formatPrice = (price) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);

const Home = ({ searchTerm, priceFilter }) => {
  const [favorites, setFavorites] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [products, setProducts] = useState([]); // Danh sách từ API
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCourses = async () => {
      try {
        const response = await fetchCourses();
        setProducts(response.data);
        setFilteredProducts(response.data);
      } catch (error) {
        console.error("Lỗi khi gọi API khóa học:", error);
      } finally {
        setLoading(false);
      }
    };
    loadCourses();
  }, []);

  useEffect(() => {
    let filtered = [...products];
    if (searchTerm) {
      filtered = filtered.filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.shortDescription.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (priceFilter !== "all") {
      filtered = filtered.filter((product) => {
        if (priceFilter === "low") return product.price < 500000;
        if (priceFilter === "medium") return product.price >= 500000 && product.price <= 1000000;
        if (priceFilter === "high") return product.price > 1000000;
        return true;
      });
    }
    setFilteredProducts(filtered);
  }, [searchTerm, priceFilter, products]);

  const toggleFavorite = (id) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  };

  return (
    <>
      <Box sx={{ mt: 10, py: 6, bgcolor: 'background.default' }}>
        <Container maxWidth="xl">
          {/* Hero */}
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 700,
                background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 2,
              }}
            >
              Khám phá khóa học tuyệt vời
            </Typography>
            <Typography
              variant="h6"
              color="text.secondary"
              sx={{ maxWidth: 600, mx: 'auto' }}
            >
              Học từ các chuyên gia hàng đầu và phát triển sự nghiệp với những khóa học toàn diện
            </Typography>
          </Box>

          {/* Stats */}
          <Box sx={{ mb: 6 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={4}>
                <Paper sx={{ p: 3, borderRadius: 3, textAlign: 'center', background: 'linear-gradient(135deg, #1976d2, #42a5f5)', color: 'white' }}>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    {filteredProducts.length}
                  </Typography>
                  <Typography>Khóa học</Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Paper sx={{ p: 3, borderRadius: 3, textAlign: 'center', background: 'linear-gradient(135deg, #ff9800, #ffb74d)', color: 'white' }}>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    {products.reduce((acc, p) => acc + Number(p.students || 0), 0)}
                  </Typography>
                  <Typography>Học viên</Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Paper sx={{ p: 3, borderRadius: 3, textAlign: 'center', background: 'linear-gradient(135deg, #4caf50, #81c784)', color: 'white' }}>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>4.8</Typography>
                  <Typography>Đánh giá trung bình</Typography>
                </Paper>
              </Grid>
            </Grid>
          </Box>

          {/* Courses Grid */}
          {loading ? (
            <Box sx={{ textAlign: 'center', py: 10 }}>
              <CircularProgress />
              <Typography sx={{ mt: 2 }}>Đang tải khóa học...</Typography>
            </Box>
          ) : (
            <Grid container spacing={3}>
              {filteredProducts.map((product) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
                  <ProductCard
                    product={product}
                    toggleFavorite={toggleFavorite}
                    favorites={favorites}
                    setSelectedProduct={setSelectedProduct}
                  />
                </Grid>
              ))}
            </Grid>
          )}

          {/* Empty */}
          {!loading && filteredProducts.length === 0 && (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Avatar sx={{ width: 80, height: 80, bgcolor: 'grey.100', mx: 'auto', mb: 2 }}>
                <Search sx={{ fontSize: 40, color: 'grey.400' }} />
              </Avatar>
              <Typography variant="h5" sx={{ fontWeight: 600 }}>Không tìm thấy khóa học</Typography>
              <Typography color="text.secondary">Hãy thử điều chỉnh tiêu chí tìm kiếm hoặc bộ lọc</Typography>
            </Box>
          )}
        </Container>
      </Box>

      {/* Modal */}
      <ProductModal
        product={selectedProduct}
        open={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </>
  );
};

export default Home;
