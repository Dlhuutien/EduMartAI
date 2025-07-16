import React, { useState, useEffect, useRef } from "react";
import { Routes, Route } from "react-router-dom";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { theme } from "./config/theme";

import Header from "./components/layout/Header";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import ChatBot from "./components/layout/ChatBot";
import Home from "./pages/Home";

const App = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [priceFilter, setPriceFilter] = useState("all");
  const [user, setUser] = useState(null);
  const [selectedHistoryId, setSelectedHistoryId] = useState(null);
  const [products, setProducts] = useState([]);
  const [showNavbar, setShowNavbar] = useState(false);
  const thumbnailRef = useRef();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);
  useEffect(() => {
    const handleScroll = () => {
      if (thumbnailRef.current) {
        const rect = thumbnailRef.current.getBoundingClientRect();
        setShowNavbar(rect.bottom <= 56);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Header
        user={user}
        onLogin={(userInfo) => setUser(userInfo)}
        onToggleDrawer={() => {}}
        onSelectHistoryItem={(id) => setSelectedHistoryId(id)}
      />
      {showNavbar && (
        <Navbar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          priceFilter={priceFilter}
          setPriceFilter={setPriceFilter}
        />
      )}
      <Routes>
        <Route
          path="/"
          element={
            <Home
              searchTerm={searchTerm}
              priceFilter={priceFilter}
              selectedHistoryId={selectedHistoryId}
              onProductsLoaded={setProducts}
              user={user}
              thumbnailRef={thumbnailRef}
            />
          }
        />
      </Routes>
      <Footer />
      <ChatBot user={user}/>
    </ThemeProvider>
  );
};

export default App;
