import React from "react";
import { auth, provider, signInWithPopup } from "../../config/firebase";
import { Button } from "@mui/material";
import { Google } from "@mui/icons-material";
import {
  createUser,
  getUserByEmail,
  getUserByUID,
} from "../../services/userService";

const LoginWithGoogle = ({ onLoginSuccess }) => {
  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Kiểm tra user đã tồn tại chưa qua uid
      const { data: existingUsers } = await getUserByUID(user.uid);

      let finalUser;
      if (existingUsers.length === 0) {
        const { data: createdUser } = await createUser({
          name: user.displayName,
          email: user.email,
          avatar: user.photoURL,
          uid: user.uid,
          favorites: [],
        });
        finalUser = createdUser;
        console.log("Đã tạo user mới:", finalUser);
      } else {
        finalUser = existingUsers[0];
        console.log("Đã có user:", finalUser);
      }

      // Đồng bộ favorites từ user → localStorage
      localStorage.setItem(
        "courseFavorites",
        JSON.stringify(finalUser.favorites || [])
      );
      localStorage.setItem("user", JSON.stringify(user));

      onLoginSuccess(user);
      window.dispatchEvent(new Event("storage"));
      window.location.reload();
    } catch (error) {
      console.error("Lỗi đăng nhập:", error.message);
    }
  };

  return (
    <Button
      onClick={handleLogin}
      startIcon={<Google sx={{ color: "#fff" }} />}
      sx={{
        background: "#34a99dff",
        color: "#fff",
        textTransform: "none",
        fontWeight: "bold",
        px: 2,
        py: 1,
        fontSize: {
          xs: "0.7rem", // mobile
          sm: "0.8rem", // tablet
          md: "0.95rem", // desktop
        },
        padding: {
          xs: "6px 10px",
          sm: "8px 14px",
          md: "10px 16px",
        },
        "& .MuiButton-startIcon": {
          marginRight: {
            xs: "4px",
            sm: "6px",
            md: "8px",
          },
          "& svg": {
            fontSize: {
              xs: "1rem",
              sm: "1.2rem",
              md: "1.5rem",
            },
          },
        },
      }}
    >
      Đăng nhập với Google
    </Button>
  );
};

export default LoginWithGoogle;
