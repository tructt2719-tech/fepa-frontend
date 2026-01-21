# 🚀 Hướng Dẫn Nhanh - FEPA

## Yêu Cầu
- Đã cài đặt Node.js
- Đã cấu hình MySQL database (AlwaysData)

## Bước 1: Cài Đặt Dependencies

Mở terminal và chạy:

```bash
# Cài đặt frontend
cd fepa-frontend
npm install

# Cài đặt backend
cd server
npm install
cd ..
```

## Bước 2: Khởi Động Ứng Dụng

### Cách A: Dùng Script Tự Động (Windows)

Chỉ cần double-click file `start.bat` trong thư mục fepa-frontend. Script sẽ:
- Khởi động backend server ở cổng 3001
- Khởi động frontend server ở cổng 5173
- Mở cả hai trong cửa sổ terminal riêng

### Cách B: Khởi Động Thủ Công

**Terminal 1 - Khởi động Backend:**
```bash
cd server
npm start
```

Đợi thông báo "Server is running on port 3001".

**Terminal 2 - Khởi động Frontend:**
```bash
npm run dev
```

## Bước 3: Thêm Dữ Liệu Blog Mẫu (Tùy chọn)

Mở terminal mới:
```bash
cd server
npm run seed
```

## Bước 4: Truy Cập Ứng Dụng

Mở trình duyệt và vào: `http://localhost:5173`

## Bước 5: Tạo Tài Khoản

1. Click "Sign up"
2. Điền thông tin:
   - Full Name: Tên của bạn
   - Email: email@cua-ban.com
   - Password: (ít nhất 6 ký tự)
   - Confirm Password
3. Click "Sign Up"
4. Bạn sẽ thấy mã xác thực hiện trên màn hình (chế độ dev)
5. Nhập mã 6 chữ số
6. Click "Verify Email"

## Bước 6: Đăng Nhập

1. Nhập email và mật khẩu
2. Click "Sign In"
3. Bạn sẽ được chuyển đến Dashboard

## Bước 7: Bắt Đầu Sử Dụng FEPA

### Thêm Chi Tiêu Đầu Tiên
1. Click "Expenses" trên thanh menu
2. Click "+ Add Expense"
3. Chọn "Manual Entry"
4. Điền:
   - Amount: 50.00
   - Category: Food & Dining
   - Payment Method: Cash
   - Date: Ngày hôm nay
   - Note: "Ăn trưa với bạn"
5. Click "Add Expense"

### Tạo Ngân Sách Đầu Tiên
1. Click "Budgets"
2. Click "Create Budget"
3. Điền:
   - Category: Food & Dining
   - Budget Amount: 500
   - Period: Monthly
   - Start Date: Ngày đầu tháng
   - End Date: Ngày cuối tháng
4. Click "Create"

### Thêm Khoản Nợ
1. Click "Debts"
2. Click "Add Debt"
3. Điền:
   - Creditor: Thẻ tín dụng
   - Total Amount: 2000
   - Interest Rate: 15
   - Minimum Payment: 50
   - Due Date: Cuối tháng
4. Click "Add"

### Lọc Bài Blog
1. Click "Blog"
2. Click vào các danh mục: "Saving Tips", "Budgeting", v.v.
3. Bài viết sẽ được lọc tự động

### Sử Dụng Tìm Kiếm
1. Gõ vào thanh tìm kiếm ở trên cùng
2. Tìm các trang như "Expenses", "Dashboard", v.v.
3. Dùng phím mũi tên để di chuyển
4. Nhấn Enter để đi đến trang

### Xem Thông Báo
1. Click icon chuông ở góc phải trên
2. Lọc theo: All, Unread, Read
3. Click vào thông báo để đi đến trang liên quan

### Truy Cập Profile
1. Click avatar ở góc phải trên
2. Xem thông tin cá nhân
3. Click "Settings" để cài đặt thêm
4. Click "Logout" để đăng xuất

## 🎯 Kiểm Tra Các Tính Năng

### Test Chi Tiêu Với Ngân Sách
1. Tạo ngân sách cho danh mục "Shopping" với giới hạn $300
2. Thêm chi tiêu: Shopping, $150
3. Kiểm tra trang budget - bạn sẽ thấy đã chi $150 trong $300
4. Thêm chi tiêu khác: Shopping, $100
5. Ngân sách hiển thị $250/$300 đã chi

### Test Thanh Toán Nợ
1. Thêm khoản nợ với $1000 còn lại
2. Vào chi tiết khoản nợ
3. Thêm khoản thanh toán $200
4. Số tiền còn lại cập nhật thành $800

### Test Tìm Kiếm
1. Gõ "exp" vào thanh tìm kiếm
2. Thấy gợi ý "Expenses" được highlight
3. Nhấn Enter hoặc click để đi đến trang

### Test Profile Dropdown
1. Click avatar
2. Thấy tên và email của bạn
3. Click "Logout" để test đăng xuất
4. Bạn sẽ được chuyển về trang đăng nhập

## 🛠️ Xử Lý Lỗi

### Backend không khởi động
- Kiểm tra cổng 3001 có đang được sử dụng không
- Xác minh thông tin database trong `server/.env`
- Chạy `npm install` trong thư mục server

### Frontend không khởi động
- Kiểm tra cổng 5173 có đang được sử dụng không
- Chạy `npm install` trong thư mục fepa-frontend
- Xóa cache trình duyệt

### Không kết nối được database
- Kiểm tra kết nối internet
- Kiểm tra database AlwaysData có truy cập được không
- Xác minh thông tin đăng nhập trong `server/.env`

### Lỗi "401 Unauthorized"
- Phiên đăng nhập hết hạn - đăng xuất và đăng nhập lại
- Kiểm tra JWT_SECRET có được set trong `server/.env` không

## 📚 Các Bước Tiếp Theo

1. ✅ Khám phá tất cả các trang: Dashboard, Expenses, Budgets, Debts, Analytics, Blog
2. ✅ Thêm nhiều chi tiêu trong các danh mục khác nhau
3. ✅ Tạo nhiều ngân sách
4. ✅ Thiết lập mục tiêu tiết kiệm
5. ✅ Xem phân tích và thông tin chi tiết
6. ✅ Đọc bài blog để học các mẹo tài chính

## 🎨 Tùy Chỉnh

- Đổi theme: Click icon mặt trời/mặt trăng trên thanh menu
- Ứng dụng sẽ nhớ theme bạn chọn

## 📖 Tài Liệu Đầy Đủ

Xem `README_SETUP.md` (tiếng Anh) để biết thêm chi tiết:
- API endpoints
- Database schema
- Tech stack
- Hướng dẫn deploy

## 💡 Mẹo

- Dùng phím tắt: Phím mũi tên trong tìm kiếm, Enter để chọn
- Thông báo tự động cập nhật mỗi 20 giây
- Chi tiêu tự động cập nhật số tiền đã chi trong ngân sách
- Tất cả dữ liệu được lưu vào database ngay lập tức

## 🆘 Cần Trợ Giúp?

- Kiểm tra console (F12) để xem thông báo lỗi
- Xác nhận cả backend và frontend đều đang chạy
- Đảm bảo bạn đã đăng nhập
- Thử refresh trang

---

**Chúc bạn sử dụng FEPA vui vẻ! 🎉**

## 🔗 Liên Kết

- Figma Design: https://www.figma.com/make/ieERvmmGL9BjNMOREnLUCV/Personal-Finance-Assistant-App
- Backend API: http://localhost:3001
- Frontend: http://localhost:5173

## 📊 Database

- Host: mysql-duan2026211vay.alwaysdata.net
- Database: duan2026211vay_d
- Tables được tự động tạo khi khởi động server lần đầu

## ✨ Các Tính Năng Chính

✅ Đăng ký/Đăng nhập với xác thực email
✅ Thêm chi tiêu (Manual, Scan Receipt, Voice)
✅ Quản lý ngân sách theo danh mục
✅ Theo dõi khoản nợ và thanh toán
✅ Đặt mục tiêu tiết kiệm
✅ Xem phân tích tài chính
✅ Đọc blog về tài chính
✅ Tìm kiếm nhanh
✅ Thông báo real-time
✅ Profile và settings
✅ Dark/Light theme
