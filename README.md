# 🌸 SouFlow - Admin Dashboard

Dự án tốt nghiệp: Website Cửa hàng hoa (Trang Quản trị).
Mã nguồn Frontend được xây dựng bằng **Next.js (App Router)**.

## 🚀 Dành cho thành viên nhóm (Cài đặt & Khởi chạy)

Yêu cầu bắt buộc: Đã cài đặt **Node.js** và sử dụng **`npm`** để quản lý gói. Tuyệt đối không sử dụng `bun` hay `yarn` trong dự án này để tránh xung đột file lock.

**Bước 1: Clone dự án về máy**
```bash
git clone https://github.com/Soul-Flow/souflow-admin.git
cd souflow-admin-team
```

**Bước 2: Cài đặt thư viện**
Hệ thống sẽ tự động đọc file `package.json` và `package-lock.json` để cài đặt đúng phiên bản:
```bash
npm install
```

**Bước 3: Khởi chạy môi trường Dev**
```bash
npm run dev
```
Mở trình duyệt và truy cập: [http://localhost:3000](http://localhost:3000)

---

## 🛠️ Stack Công nghệ & Thư viện đã cài

* **Core:** Next.js 14+ (App Router, TypeScript, Tailwind CSS)
* **Package Manager:** `npm`
* **Gọi API:** `axios` (kết nối trực tiếp với Spring Boot RESTful API)
* **Quản lý Form:** `react-hook-form` + `zod` + `@hookform/resolvers`
* **Quản lý State:** `zustand`
* **Tiện ích:** `lucide-react` (Icon), `sonner` (Toast notification), `dayjs` (Format ngày tháng), `recharts` (Biểu đồ)
* **Code Quality & CI/CD:**
  * `@biomejs/biome` (Linter & Formatter chính).
  * `eslint` (Cấu hình cho các rules của React Compiler và Next.js).
  * `husky`, `lint-staged`, `commitlint` (Ràng buộc Commit chuẩn conventional commit).

---

## 🏗️ Cấu trúc thư mục (App Router)

* `src/app/(admin)/*`: Các trang dành cho quản trị viên (Dashboard, Orders, Products, Categories, Users, Discounts, Comments, v.v.).
* `src/app/(auth)/*`: Các trang liên quan đến xác thực (Login).
* `src/components/*`: Các component dùng chung (Shadcn UI components, Layout, DataTable, Navbar, Sidebar...).
* `src/stores/*`: Các store quản lý state toàn cục bằng Zustand.
* `src/services/*`: Chứa cấu hình gọi HTTP API bằng Axios (`axiosClient.ts`).

---

## 📝 Quy tắc làm việc chung của team (Rules)
- **Linter & Formatter:** Sử dụng `Biome`. Hãy đảm bảo đã chạy `npm run check` hoặc `npx @biomejs/biome check --write .` và không có lỗi trước khi commit.
- **State Management:** Dùng `zustand`. Không dùng Redux hay Context API cho global state.
- **Backend Integration:** Back-end được xây dựng bằng Java Spring Boot. Luôn sử dụng `axios` qua `axiosClient.ts` để thực hiện request. Format response JSON luôn tuân theo cấu trúc của Spring Boot.
- **Form:** Bắt buộc sử dụng `react-hook-form` tích hợp với `zod` schema để validate dữ liệu đầu vào.
