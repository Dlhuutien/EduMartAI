import React from "react";
import { auth, provider, signInWithPopup } from "../config/firebase";
import { Button } from "@mui/material";
import { Google } from "@mui/icons-material";
import { createUser, getUserByEmail } from "../services/userService";

const LoginWithGoogle = ({ onLoginSuccess }) => {
  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      console.log("Đăng nhập thành công:", user);

      // Kiểm tra email tồn tại
      const { data: existingUsers } = await getUserByEmail(user.email);

      if (existingUsers.length === 0) {
        // Nếu chưa -> tạo mới
        await createUser({
          name: user.displayName,
          email: user.email,
          avatar: user.photoURL,
          uid: user.uid,
        });
        console.log("Đã thêm người dùng mới vào MockAPI");
      } else {
        console.log("Người dùng đã tồn tại trong MockAPI");
      }

      // Lưu vào localStorage
      localStorage.setItem("user", JSON.stringify(user));

      onLoginSuccess(user);
    } catch (error) {
      console.error("Lỗi đăng nhập:", error.message);
    }
  };

  return (
    <Button
      variant="contained"
      startIcon={<Google />}
      onClick={handleLogin}
      sx={{ mt: 3 }}
    >
      Đăng nhập với Google
    </Button>
  );
};

export default LoginWithGoogle;
