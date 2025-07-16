# ALlecta - Nền tảng học trực tuyến thông minh (vi)

**ALlecta** là một website học trực tuyến hiện đại, cung cấp các khóa học chất lượng cao và tích hợp **AI Chatbot trợ lý học tập** giúp người dùng tìm kiếm, gợi ý khóa học nhanh chóng và thuận tiện.

---

## Tính năng chính

- Tìm kiếm khóa học theo **tên**, **giá**
- Thêm khóa học vào danh sách yêu thích
- Lưu lịch sử xem khóa học vào `localStorage`
- Đề xuất khóa học thông minh
- Tích hợp **AI ChatBot** hỗ trợ người dùng:
  - Gợi ý khóa học phù hợp theo từ khóa, thể loại, mức giá
  - Trả lời nhanh qua chip gợi ý
  - Hiển thị kết quả dưới dạng danh sách khóa học
  - Xem trực tiếp được khóa học đã được gợi ý
- Giao diện responsive hỗ trợ **mobile**, **tablet**, **desktop**
- Đăng nhập Google (qua Firebase)
- Kết nối API bằng [MockAPI.io](https://mockapi.io/)

---

## Đề xuất khóa học thông minh

Hệ thống ALlecta sử dụng thuật toán AI để **gợi ý khóa học dựa trên mục yêu thích**, giúp người dùng nhanh chóng khám phá những khóa học phù hợp hơn.

### 🔍 Cách hoạt động:

#### 1. Tính toán độ tương đồng:
- **Danh mục (40%)**: Ưu tiên các khóa học cùng danh mục với khóa học yêu thích
- **Tên khóa học (25%)**: So sánh tên khóa học có chứa từ khóa liên quan
- **Mô tả ngắn (20%)**: Phân tích nội dung mô tả tổng quan
- **Mô tả chi tiết (15%)**: Đánh giá mức độ liên quan chi tiết

#### 2. Sử dụng thuật toán **Jaccard Similarity**:
- Chuyển văn bản thành các từ đơn
- Tính **giao** và **hợp** của hai tập từ
- Cho ra điểm tương đồng

#### 3. Logic đề xuất thông minh:
- Tính tổng điểm trung bình từ tất cả khóa học người dùng đã yêu thích

#### 4. Ví dụ:
Nếu người dùng yêu thích: **“React Cơ bản”**, hệ thống có thể đề xuất:
- “React Nâng Cao” (cùng category: Frontend, từ khóa giống React)
---

## Công nghệ sử dụng

- **React.js** (Vite)
- **Material UI (MUI)**: Thiết kế UI hiện đại
- **React Router**: Điều hướng trang
- **Firebase Auth**: Xác thực người dùng
- **MockAPI.io**: Dữ liệu khóa học
- **LocalStorage**: Lưu lịch sử & yêu thích
- **Custom Chatbot UI**: Tự động gợi ý nội dung theo input

---

## Cài đặt

```bash
git clone https://github.com/Dlhuutien/EduMartAI.git
cd EduMartAI
npm install
npm run dev
```

---

## Ý nghĩa thương hiệu: AIllecta

**"AIllecta – Học tập thông minh, dẫn lối tương lai."**

### AI – Trí tuệ nhân tạo:
Đại diện cho công nghệ thông minh hỗ trợ học tập: gợi ý khóa học, cá nhân hóa nội dung, trò chuyện trực tiếp qua chatbot AI.

### llecta (viết tắt từ Intellecta) – Lấy cảm hứng từ từ gốc "Intellect" (trí tuệ, tri thức):
Cách viết này cũng gợi liên tưởng đến:
- *collect* (thu thập kiến thức)
- *elect* (lựa chọn khóa học)
- *intellect* (trí tuệ học thuật)

Tạo cảm giác về một nền tảng học tập thông minh, chọn lọc và dẫn dắt người học theo cách hiệu quả nhất.