# 🌸 SoulFlow - Web (`soulflow-web`)

Dự án tốt nghiệp: Website Cửa hàng hoa.
Mã nguồn Frontend được xây dựng bằng **Next.js (App Router)** và quản lý gói bằng **Bun**.

## 🚀 Dành cho thành viên nhóm (Cài đặt & Khởi chạy)

Yêu cầu bắt buộc: Đã cài đặt [Bun](https://bun.sh/) trên máy. Tuyệt đối không sử dụng `npm` hay `yarn` trong dự án này để tránh xung đột file lock.

# Window
powershell -c "irm bun.sh/install.ps1 | iex"

# MacOS
curl -fsSL https://bun.sh/install | bash

# Setup
**Bước 1: Clone dự án về máy**
\`\`\`
git clone https://github.com/nhockevin/flowershop-fe.git
cd flowershop-fe
\`\`\`

**Bước 2: Cài đặt thư viện**
Hệ thống sẽ tự động đọc file `bun.lockb` để cài đặt đúng phiên bản:
\`\`\`
bun install
\`\`\`

**Bước 3: Khởi chạy môi trường Dev**
\`\`\`
bun dev
\`\`\`
Mở trình duyệt và truy cập: [http://localhost:3000](http://localhost:3000)

---

## 🛠️ Stack Công nghệ & Thư viện đã cài

* **Core:** Next.js 14+ (App Router, TypeScript, Tailwind CSS)
* **Gọi API:** `axios`
* **Quản lý Form:** `react-hook-form` + `zod` + `@hookform/resolvers`
* **Quản lý State:** `zustand`
* **Tiện ích:** `lucide-react` (Icon), `sonner` (Toast notification), `dayjs` (Format ngày tháng)
* **Code Quality (CI/CD):** `@biomejs/biome` (Linter/Formatter thay thế ESLint/Prettier), `husky`, `lint-staged`, `commitlint` (Ràng buộc Commit chuẩn).
* **AI Coding:** Tích hợp sẵn `AGENTS.md` để hướng dẫn AI viết code chuẩn Next.js mới nhất.

---

## 📝 Nhật ký cấu hình ban đầu (Dành cho Admin)

*Lưu ý: Các lệnh dưới đây chỉ dùng để tham khảo quá trình khởi tạo dự án ban đầu, không cần chạy lại.*


Xem chi tiết lệnh khởi tạo

\`\`\`bash
# 1. Install Next.js via Bun
bunx create-next-app@latest .

# 2. Settings chosen:
- Recommended defaults: No
- TypeScript: Yes
- Linter: ESLint (Later migrated to Biome)
- React Compiler: No
- Tailwind CSS: Yes
- `src/` directory: Yes
- App Router: Yes
- Import alias: No
- AGENTS.md: Yes

# 3. Add Dependencies
bun add axios react-hook-form zod @hookform/resolvers zustand lucide-react sonner dayjs
bun add -d @biomejs/biome husky lint-staged @commitlint/cli @commitlint/config-conventional
\`\`\`