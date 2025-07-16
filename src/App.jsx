import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { theme } from "./config/theme";

import Header from "./components/layout/Header";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import ChatBox from "./components/layout/ChatBox";
import Home from "./pages/Home";

const App = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [priceFilter, setPriceFilter] = useState("all");
  const [user, setUser] = useState(null);
  const [selectedHistoryId, setSelectedHistoryId] = useState(null);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
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
      <Navbar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        priceFilter={priceFilter}
        setPriceFilter={setPriceFilter}
      />
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
            />
          }
        />
      </Routes>
      <Footer />
      <ChatBox user={user} products={products} />
    </ThemeProvider>
  );
};

export default App;
