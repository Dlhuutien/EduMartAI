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
import ProductCard from "../components/layout/ProductCard";
import ProductModal from "../components/ui/ProductModal";
import { fetchCourses } from "../services/courseService";
import { getUserByUID, updateUserFavorites } from "../services/userService";

// Component Layout tất cả course
const AllCoursesLayout = ({
  filteredProducts,
  products,
  loading,
  favorites,
  toggleFavorite,
  handleSelectProduct,
  selectedHistoryId,
  user,
}) => {
  return (
    <>
      {/* Stats Cards */}
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
                {products.reduce((acc, p) => acc + Number(p.students || 0), 0)}
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

      {/* Courses Grid */}
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

// Component Layout đề xuất course
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
            background: "linear-gradient(135deg, #db8f38ff, #185dcdff)",
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
          <Grid container spacing={3}>
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

const Home = ({
  searchTerm,
  priceFilter,
  selectedHistoryId,
  onProductsLoaded,
  user,
}) => {
  const [favorites, setFavorites] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentTab, setCurrentTab] = useState(0);
  const [recommendedCourses, setRecommendedCourses] = useState([]);

  // Load favorites from localStorage
  useEffect(() => {
    const savedFavorites =
      JSON.parse(localStorage.getItem("courseFavorites")) || [];
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

  // Helper function to calculate text similarity
  const calculateSimilarity = (text1, text2) => {
    if (!text1 || !text2) return 0;

    // Convert to lowercase and split into words
    const words1 = text1.toLowerCase().split(/\s+/);
    const words2 = text2.toLowerCase().split(/\s+/);

    // Find common words
    const commonWords = words1.filter((word) => words2.includes(word));

    // Calculate Jaccard similarity
    const union = new Set([...words1, ...words2]);
    const intersection = commonWords.length;

    return intersection / union.size;
  };

  // Advanced recommendation algorithm
  const getRecommendedCourses = (favoriteProducts, allProducts) => {
    if (favoriteProducts.length === 0) return [];

    const recommendations = [];

    // Calculate similarity score for each non-favorite product
    allProducts.forEach((product) => {
      if (favorites.includes(product.id)) return; // Skip already favorite courses

      let totalScore = 0;
      let scoreCount = 0;

      favoriteProducts.forEach((favProduct) => {
        let score = 0;

        // Category exact match (highest weight)
        if (product.category === favProduct.category) {
          score += 0.4;
        }

        // Name similarity
        const nameSimilarity = calculateSimilarity(
          product.name,
          favProduct.name
        );
        score += nameSimilarity * 0.25;

        // Short description similarity
        const shortDescSimilarity = calculateSimilarity(
          product.shortDescription,
          favProduct.shortDescription
        );
        score += shortDescSimilarity * 0.2;

        // Long description similarity (if available)
        if (product.longDescription && favProduct.longDescription) {
          const longDescSimilarity = calculateSimilarity(
            product.longDescription,
            favProduct.longDescription
          );
          score += longDescSimilarity * 0.15;
        }

        totalScore += score;
        scoreCount++;
      });

      const averageScore = totalScore / scoreCount;

      // Only recommend if similarity score is above threshold
      if (averageScore > 0.1) {
        recommendations.push({
          ...product,
          similarityScore: averageScore,
        });
      }
    });

    // Sort by similarity score and return top recommendations
    return recommendations
      .sort((a, b) => b.similarityScore - a.similarityScore)
      .slice(0, 8);
  };

  // Generate recommended courses based on favorites
  useEffect(() => {
    if (products.length > 0 && favorites.length > 0) {
      const favoriteProducts = products.filter((product) =>
        favorites.includes(product.id)
      );

      const recommended = getRecommendedCourses(favoriteProducts, products);
      setRecommendedCourses(recommended);
    } else {
      setRecommendedCourses([]);
    }
  }, [products, favorites]);

  useEffect(() => {
    let filtered = [...products];

    if (selectedHistoryId === "history") {
      const history = JSON.parse(localStorage.getItem("courseHistory")) || [];
      filtered = history;
    } else if (selectedHistoryId === "favorites") {
      const savedFavorites =
        JSON.parse(localStorage.getItem("courseFavorites")) || [];
      filtered = products.filter((product) =>
        savedFavorites.includes(product.id)
      );
      setCurrentTab(1);
    } else if (
      selectedHistoryId &&
      selectedHistoryId !== "history" &&
      selectedHistoryId !== "favorites"
    ) {
      const found = products.find(
        (p) => String(p.id) === String(selectedHistoryId)
      );
      filtered = found ? [found] : [];
    } else {
      // Áp dụng lọc search và price
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
    }

    setFilteredProducts(filtered);
  }, [searchTerm, priceFilter, products, selectedHistoryId]);

  const toggleFavorite = async (id) => {
    const newFavorites = favorites.includes(id)
      ? favorites.filter((f) => f !== id)
      : [...favorites, id];

    setFavorites(newFavorites);
    localStorage.setItem("courseFavorites", JSON.stringify(newFavorites));
    window.dispatchEvent(new Event("storage"));

    // Đồng bộ với MockAPI
    try {
      const currentUser = JSON.parse(localStorage.getItem("user"));
      const { data: users } = await getUserByUID(currentUser.uid);
      if (users.length > 0) {
        const userId = users[0].id;
        await updateUserFavorites(userId, newFavorites);
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật favorites lên MockAPI:", error);
    }
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

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  // Get favorite products for recommended layout
  const favoriteProducts = products.filter((product) =>
    favorites.includes(product.id)
  );

  const getTitle = () => {
    if (selectedHistoryId === "history") return "Lịch sử xem";
    if (selectedHistoryId === "favorites") return "Khóa học yêu thích";
    return currentTab === 0
      ? "Khám phá khóa học tuyệt vời"
      : "Đề xuất dành cho bạn";
  };

  const getSubtitle = () => {
    if (selectedHistoryId === "history")
      return "Các khóa học bạn đã xem gần đây";
    if (selectedHistoryId === "favorites")
      return "Những khóa học bạn đã yêu thích";
    return currentTab === 0
      ? "Học từ các chuyên gia hàng đầu và phát triển sự nghiệp với những khóa học toàn diện"
      : "Khóa học được chọn lọc dựa trên sở thích của bạn";
  };

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
                fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem" },
              }}
            >
              {getTitle()}
            </Typography>
            <Typography
              variant="h6"
              color="text.secondary"
              sx={{ maxWidth: 600, mx: "auto", mb: 4 }}
            >
              {getSubtitle()}
            </Typography>

            {/* Tabs - only show if not in special history modes */}
            {!selectedHistoryId && (
              <Tabs
                value={currentTab}
                onChange={handleTabChange}
                centered
                sx={{ mb: 4 }}
              >
                <Tab
                  label="Tất cả khóa học"
                  icon={<School />}
                  iconPosition="start"
                />
                <Tab
                  label={`Đề xuất (${recommendedCourses.length})`}
                  icon={<Favorite />}
                  iconPosition="start"
                />
              </Tabs>
            )}
          </Box>

          {/* Render appropriate layout based on current tab or history selection */}
          {currentTab === 0 || selectedHistoryId ? (
            <AllCoursesLayout
              filteredProducts={filteredProducts}
              products={products}
              loading={loading}
              favorites={favorites}
              toggleFavorite={toggleFavorite}
              handleSelectProduct={handleSelectProduct}
              selectedHistoryId={selectedHistoryId}
              user={user}
            />
          ) : (
            <RecommendedCoursesLayout
              recommendedCourses={recommendedCourses}
              favoriteProducts={favoriteProducts}
              loading={loading}
              favorites={favorites}
              toggleFavorite={toggleFavorite}
              handleSelectProduct={handleSelectProduct}
              user={user}
            />
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
