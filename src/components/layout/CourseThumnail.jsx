import React, { useState, useEffect } from "react";
import { Box, Container, Typography, Fade } from "@mui/material";
import { fetchCourses } from "../../services/courseService";

const CourseThumnail = React.forwardRef((props, ref) => {
  const [heroImages, setHeroImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [fadeIn, setFadeIn] = useState(true);

  useEffect(() => {
    const loadCourses = async () => {
      try {
        const response = await fetchCourses();
        const courses = response.data;

        const formatted = courses.slice(0, 5).map((course) => ({
          url: course.image,
          title: course.name,
          subtitle: course.shortDescription,
        }));

        setHeroImages(formatted);
      } catch (error) {
        console.error("Lỗi khi tải course cho hero:", error);
      }
    };

    loadCourses();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setFadeIn(false);
      setTimeout(() => {
        setCurrentImageIndex((prev) =>
          heroImages.length > 0 ? (prev + 1) % heroImages.length : 0
        );
        setFadeIn(true);
      }, 300);
    }, 5000);

    return () => clearInterval(interval);
  }, [heroImages.length]);

  const currentImage = heroImages[currentImageIndex];

  return (
    <Box ref={ref} sx={{ bgcolor: "background.default", minHeight: "50vh" }}>
      <Box
        sx={{
          height: "50vh",
          position: "relative",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Background Image */}
        {currentImage && (
          <Fade in={fadeIn} timeout={500}>
            <Box
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                backgroundImage: `url(${currentImage.url})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                "&::before": {
                  content: '""',
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                },
              }}
            />
          </Fade>
        )}

        {/* Hero Text */}
        <Container maxWidth="lg" sx={{ position: "relative", zIndex: 2 }}>
          <Box sx={{ textAlign: "center", color: "white" }}>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 700,
                mb: 1,
                textShadow: "2px 2px 4px rgba(0,0,0,0.7)",
              }}
            >
              <Box component="span" sx={{  color: "secondary.main" }}>
                AI
              </Box>
              {/* <Box component="span" sx={{  color: "primary.main" }}> */}
                llecta
              {/* </Box> */}
              
            </Typography>
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 400,
                mb: 3,
                opacity: 0.9,
                textShadow: "1px 1px 2px rgba(0,0,0,0.6)",
              }}
            >
              Chuyên cung cấp khóa học chất lượng cao cho mọi lĩnh vực công nghệ thông tin
            </Typography>
          </Box>
        </Container>
        {/* Indicators */}
        <Box
          sx={{
            position: "absolute",
            bottom: 20,
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            gap: 1,
            zIndex: 3,
          }}
        >
          {heroImages.map((_, index) => (
            <Box
              key={index}
              sx={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                backgroundColor:
                  index === currentImageIndex
                    ? "white"
                    : "rgba(255,255,255,0.5)",
                cursor: "pointer",
                transition: "all 0.3s ease",
                "&:hover": {
                  backgroundColor: "white",
                  transform: "scale(1.2)",
                },
              }}
              onClick={() => setCurrentImageIndex(index)}
            />
          ))}
        </Box>
      </Box>
    </Box>
  );
});

export default CourseThumnail;
