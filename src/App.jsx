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
import {Home as HomeIcon} from "@mui/icons-material";
import { theme } from "./config/theme";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Home from "./pages/Home";

const App = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [priceFilter, setPriceFilter] = useState("all");
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Header
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        priceFilter={priceFilter}
        setPriceFilter={setPriceFilter}
        onToggleDrawer={() => setDrawerOpen(!drawerOpen)}
      />
      <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <List sx={{ width: 250 }}>
          <ListItem button>
            <ListItemIcon><HomeIcon /></ListItemIcon>
            <ListItemText primary="Trang chủ" />
          </ListItem>
        </List>
      </Drawer>
      <Home searchTerm={searchTerm} priceFilter={priceFilter} />
      <Footer />
    </ThemeProvider>
  );
};

export default App;
