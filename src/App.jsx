import React, { useState, useEffect } from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ThemeProvider,
  CssBaseline,
} from "@mui/material";
import { Home as HomeIcon } from "@mui/icons-material";
import { theme } from "./config/theme";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Home from "./pages/Home";
import ChatBox from "./components/ChatBox"; // Import ChatBox component

const App = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [priceFilter, setPriceFilter] = useState("all");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [selectedHistoryId, setSelectedHistoryId] = useState(null);
  const [products, setProducts] = useState([]); // State để lưu danh sách sản phẩm

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    const handleReset = () => setSelectedHistoryId(null);
    window.addEventListener("resetHistory", handleReset);
    return () => window.removeEventListener("resetHistory", handleReset);
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Header
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        priceFilter={priceFilter}
        setPriceFilter={setPriceFilter}
        onToggleDrawer={() => setDrawerOpen(!drawerOpen)}
        user={user}
        onLogin={(userInfo) => setUser(userInfo)}
        onSelectHistoryItem={(id) => setSelectedHistoryId(id)}
      />
      <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <List sx={{ width: 250 }}>
          <ListItem button>
            <ListItemIcon>
              <HomeIcon />
            </ListItemIcon>
            <ListItemText primary="Trang chủ" />
          </ListItem>
        </List>
      </Drawer>
      <Home 
        searchTerm={searchTerm} 
        priceFilter={priceFilter} 
        selectedHistoryId={selectedHistoryId}
        onProductsLoaded={setProducts} // Callback để nhận danh sách sản phẩm
      />
      <Footer />
      
      {/* ChatBox Component */}
      <ChatBox user={user} products={products} />
    </ThemeProvider>
  );
};

export default App;