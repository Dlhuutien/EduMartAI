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
import CourseThumnail from "../components/layout/CourseThumnail";
import AllCoursesLayout from "../components/layout/AllCoursesLayout";
import RecommendedCoursesLayout from "../components/layout/RecommendedCoursesLayout";

const Home = ({
  searchTerm,
  priceFilter,
  selectedHistoryId,
  onProductsLoaded,
  user,
  thumbnailRef,
}) => {
  const [favorites, setFavorites] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentTab, setCurrentTab] = useState(0);
  const [recommendedCourses, setRecommendedCourses] = useState([]);

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

  // Hàm hỗ trợ tính độ tương đồng giữa hai chuỗi văn bản
  const calculateSimilarity = (text1, text2) => {
    if (!text1 || !text2) return 0;

    // Chuyển về chữ thường và tách thành từng từ
    const words1 = text1.toLowerCase().split(/\s+/);
    const words2 = text2.toLowerCase().split(/\s+/);

    // Tìm các từ chung giữa hai chuỗi
    const commonWords = words1.filter((word) => words2.includes(word));

    // Tính độ tương đồng Jaccard
    const union = new Set([...words1, ...words2]);
    const intersection = commonWords.length;

    return intersection / union.size;
  };

  // Thuật toán gợi ý nâng cao
  const getRecommendedCourses = (favoriteProducts, allProducts) => {
    if (favoriteProducts.length === 0) return [];

    const recommendations = [];

    // Tính điểm tương đồng cho từng sản phẩm chưa yêu thích
    allProducts.forEach((product) => {
      if (favorites.includes(product.id)) return;

      let totalScore = 0;
      let scoreCount = 0;

      favoriteProducts.forEach((favProduct) => {
        let score = 0;

        // So sánh chính xác category (trọng số cao nhất)
        if (product.category === favProduct.category) {
          score += 0.4;
        }

        // So sánh độ giống tên khóa học
        const nameSimilarity = calculateSimilarity(
          product.name,
          favProduct.name
        );
        score += nameSimilarity * 0.25;

        // So sánh mô tả ngắn
        const shortDescSimilarity = calculateSimilarity(
          product.shortDescription,
          favProduct.shortDescription
        );
        score += shortDescSimilarity * 0.2;

        // So sánh mô tả dài (nếu có)
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

      // Chỉ gợi ý nếu điểm tương đồng vượt ngưỡng tối thiểu
      if (averageScore > 0.1) {
        recommendations.push({
          ...product,
          similarityScore: averageScore,
        });
      }
    });

    // Sắp xếp theo điểm tương đồng và trả về top 8 gợi ý
    return recommendations
      .sort((a, b) => b.similarityScore - a.similarityScore)
      .slice(0, 8);
  };

  // Tạo gợi ý khóa học dựa trên yêu thích
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
      <CourseThumnail ref={thumbnailRef} />
      <Box sx={{ py: 6, bgcolor: "background.default" }}>
        <Container maxWidth="xl">
          <Box sx={{ textAlign: "center", mb: 6 }}>
            <Typography
              variant="h3"
              sx={{
                fontFamily: `"Be Vietnam Pro"`,
                fontWeight: 800,
                lineHeight: 1.25,
                letterSpacing: "-0.5px",
                background: "linear-gradient(90deg, #00897b, #d4af37)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                mb: 2,
                fontSize: {
                  xs: "1.8rem",
                  sm: "2.4rem",
                  md: "3rem",
                  lg: "3.5rem",
                },
                textAlign: "center",
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
                sx={{
                  mb: 4,
                  "& .MuiTabs-root": {
                    minHeight: 60,
                  },
                  "& .MuiTabs-indicator": {
                    height: 3,
                    borderRadius: "3px 3px 0 0",
                    background: "linear-gradient(90deg, #00897b, #d4af37)",
                    boxShadow: "0 2px 8px rgba(102, 126, 234, 0.3)",
                  },
                  "& .MuiTabs-flexContainer": {
                    gap: 2,
                    px: 2,
                  },
                  "& .MuiTab-root": {
                    minHeight: 60,
                    textTransform: "none",
                    fontWeight: 600,
                    fontSize: "1rem",
                    borderRadius: "12px 12px 0 0",
                    border: "2px solid transparent",
                    margin: "0 4px",
                    padding: "12px 24px",
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    background:
                      "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
                    color: "#64748b",
                    position: "relative",
                    overflow: "hidden",
                    "&::before": {
                      content: '""',
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: "linear-gradient(90deg, #00897b, #d4af37)",
                      opacity: 0,
                      transition: "opacity 0.3s ease",
                      zIndex: -1,
                    },
                    "&:hover": {
                      transform: "translateY(-2px)",
                      boxShadow: "0 8px 25px rgba(102, 126, 234, 0.15)",
                      border: "2px solid rgba(102, 126, 234, 0.2)",
                      "&::before": {
                        opacity: 0.05,
                      },
                      "& .MuiSvgIcon-root": {
                        transform: "scale(1.1)",
                        color: "#667eea",
                      },
                    },
                    "&.Mui-selected": {
                      color: "#fff",
                      background: "linear-gradient(90deg, #00897b, #d4af37)",
                      boxShadow: "0 8px 25px rgba(102, 126, 234, 0.3)",
                      border: "2px solid rgba(255, 255, 255, 0.2)",
                      "&::before": {
                        opacity: 0,
                      },
                      "&:hover": {
                        transform: "translateY(-1px)",
                        boxShadow: "0 12px 35px rgba(102, 126, 234, 0.4)",
                        "& .MuiSvgIcon-root": {
                          color: "#fff",
                          transform: "scale(1.05)",
                        },
                      },
                      "& .MuiSvgIcon-root": {
                        color: "#fff",
                        filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))",
                      },
                    },
                    "& .MuiSvgIcon-root": {
                      fontSize: "1.2rem",
                      transition: "all 0.3s ease",
                      marginRight: "8px",
                    },
                    "& .MuiTab-iconWrapper": {
                      marginBottom: 0,
                    },
                  },
                }}
              >
                <Tab
                  label="Tất cả khóa học"
                  icon={<School />}
                  iconPosition="start"
                  sx={{
                    "&.Mui-selected": {
                      "& .MuiSvgIcon-root": {
                        animation: "pulse 2s infinite",
                      },
                    },
                    "@keyframes pulse": {
                      "0%": {
                        transform: "scale(1)",
                      },
                      "50%": {
                        transform: "scale(1.05)",
                      },
                      "100%": {
                        transform: "scale(1)",
                      },
                    },
                  }}
                />
                <Tab
                  label={`Đề xuất (${recommendedCourses.length})`}
                  icon={<Favorite />}
                  iconPosition="start"
                  sx={{
                    "&.Mui-selected": {
                      "& .MuiSvgIcon-root": {
                        animation: "heartbeat 1.5s infinite",
                        color: "#ff6b9d",
                      },
                    },
                    "&:hover": {
                      "& .MuiSvgIcon-root": {
                        color: "#ff6b9d !important",
                      },
                    },
                    "@keyframes heartbeat": {
                      "0%": {
                        transform: "scale(1)",
                      },
                      "14%": {
                        transform: "scale(1.1)",
                      },
                      "28%": {
                        transform: "scale(1)",
                      },
                      "42%": {
                        transform: "scale(1.1)",
                      },
                      "70%": {
                        transform: "scale(1)",
                      },
                    },
                  }}
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
