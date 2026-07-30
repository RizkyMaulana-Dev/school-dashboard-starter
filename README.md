# 🏫 School Management System API

Backend API untuk sistem manajemen sekolah yang mencakup modul akademik (siswa, guru, kelas), presensi, inventaris barang, perpustakaan, serta peminjaman buku dan barang. Dibangun menggunakan **Express.js**, **TypeScript**, **Prisma ORM**, **Zod**, dan **JWT Authentication** dengan sistem **Role-Based Access Control (RBAC)**.

---

## ✨ Features

- 🔐 **Authentication & Authorization**
  - Login menggunakan JWT Access Token & Refresh Token.
  - Role-Based Access Control (RBAC).
  - Permission granular untuk setiap endpoint.

- 👥 **User & Role Management**
  - CRUD User.
  - CRUD Role.
  - CRUD Permission.
  - Assign Role ke User.

- 🎓 **Academic Management**
  - CRUD Student.
  - CRUD Teacher.
  - CRUD School Class.
  - Relasi antar data akademik.

- 📅 **Attendance**
  - Membuat sesi absensi.
  - Presensi siswa.
  - Berbagai status kehadiran (Present, Sick, Permission, Absent).

- 📚 **Library**
  - Manajemen buku.
  - Peminjaman buku.
  - Pengembalian buku.
  - Perhitungan keterlambatan.
  - Otomatis update stok buku.

- 📦 **Inventory**
  - Manajemen barang inventaris.
  - Peminjaman barang.
  - Pengembalian barang.
  - Otomatis update stok barang.

- ✅ **Validation**
  - Menggunakan **Zod** untuk validasi request.

- ⚡ **Standard Response**
  - Response API yang konsisten.
  - Pagination.
  - Filtering.
  - Searching.

---

# 🧱 Tech Stack

| Category         | Technology                                |
| ---------------- | ----------------------------------------- |
| Runtime          | Node.js 18+                               |
| Framework        | Express.js                                |
| Language         | TypeScript                                |
| ORM              | Prisma ORM                                |
| Validation       | Zod                                       |
| Authentication   | JWT (jsonwebtoken)                        |
| Database         | PostgreSQL _(Recommended)_, MySQL, SQLite |
| Password Hashing | bcrypt                                    |
| Development      | ts-node, nodemon                          |

---

# 📁 Project Structure

```text
.
├── prisma/
│   ├── schema.prisma
│   └── seed/
│       └── index.ts
│
├── src/
│   ├── constant/
│   │   └── messages.ts
│   │
│   ├── errors/
│   │
│   ├── lib/
│   │   ├── prisma.ts
│   │   └── logger.ts
│   │
│   ├── middlewares/
│   │   ├── auth.middleware.ts
│   │   ├── authorize.ts
│   │   └── validate.ts
│   │
│   ├── modules/
│   │   ├── auth/
│   │   ├── users/
│   │   ├── roles/
│   │   ├── students/
│   │   ├── teachers/
│   │   ├── schoolClass/
│   │   ├── attendance/
│   │   ├── attendanceSession/
│   │   ├── book/
│   │   ├── bookLoan/
│   │   ├── item/
│   │   └── itemLoan/
│   │
│   ├── routes/
│   │   └── index.ts
│   │
│   └── utils/
│       ├── pagination.ts
│       └── response.ts
│
├── postman/
│
├── .env.example
├── package.json
├── tsconfig.json
└── README.md
```

---

# 🚀 Getting Started

## 1. Prerequisites

Pastikan sudah menginstall:

- Node.js **18+**
- PostgreSQL _(Recommended)_
- npm / yarn / pnpm

---

## 2. Clone Repository

```bash
git clone https://github.com/username/school-management-api.git

cd school-management-api
```

---

## 3. Install Dependencies

```bash
npm install
```

---

## 4. Environment Variables

Copy file `.env.example`

```bash
cp .env.example .env
```

Lalu isi konfigurasi berikut.

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/school_db"

JWT_SECRET="your-super-secret-key"
JWT_EXPIRES_IN="1h"

JWT_REFRESH_SECRET="your-refresh-secret-key"
JWT_REFRESH_EXPIRES_IN="7d"

PORT=3000
```

---

## 5. Database Migration

```bash
npx prisma migrate dev --name init
```

---

## 6. Seed Database

```bash
npx ts-node prisma/seed/index.ts
```

Seeder akan membuat data awal seperti:

### 👤 Users

| Role    | Email               | Password   |
| ------- | ------------------- | ---------- |
| Admin   | admin@example.com   | admin123   |
| Teacher | teacher@example.com | teacher123 |
| Student | student@example.com | student123 |

### 🎓 School Class

- X IPA 1
- X IPA 2
- XI IPA 1

### 📚 Library

- Sample Books
- Book Categories

### 📦 Inventory

- Sample Items
- Item Categories

### 📅 Attendance

- Attendance Sessions
- Sample Attendance Data

---

## 7. Run Project

Development

```bash
npm run dev
```

Production

```bash
npm run build

npm start
```

Server berjalan di:

```text
http://localhost:3000/api/v1
```

---

# 🔐 Authentication

Semua endpoint (kecuali login) membutuhkan JWT Token.

Header:

```http
Authorization: Bearer <access_token>
```

Login:

```http
POST /api/v1/auth/login
```

Token yang diperoleh digunakan untuk mengakses endpoint yang dilindungi.

---

# 🔑 Permissions

Contoh permission:

```
student.read
student.create
student.update
student.delete

teacher.read
teacher.create

attendance.read
attendance.create

book.read
book.create

book-loan.read
book-loan.create

item.read
item.create

item-loan.read
item-loan.create
```

Permission dapat diatur melalui Role.

---

# 📦 API Endpoints

| Module             | Endpoint                     |
| ------------------ | ---------------------------- |
| Authentication     | `/api/v1/auth`               |
| Users              | `/api/v1/users`              |
| Roles              | `/api/v1/roles`              |
| Students           | `/api/v1/student`            |
| Teachers           | `/api/v1/teacher`            |
| School Class       | `/api/v1/class`              |
| Attendance Session | `/api/v1/attendance-session` |
| Attendance         | `/api/v1/attendance`         |
| Book               | `/api/v1/book`               |
| Book Loan          | `/api/v1/book-loan`          |
| Item               | `/api/v1/item`               |
| Item Loan          | `/api/v1/item-loan`          |

---

# 📄 API Documentation

Dokumentasi request dan response tersedia melalui koleksi **Postman**.

Folder:

```text
postman/
```

Berisi:

- Collection
- Environment
- Positive Test
- Negative Test

---

# 🧪 Testing

Gunakan koleksi Postman untuk menguji seluruh endpoint.

Testing mencakup:

- ✅ Authentication
- ✅ CRUD
- ✅ Validation
- ✅ Authorization
- ✅ Permission
- ✅ Search
- ✅ Filtering
- ✅ Pagination
- ✅ Error Response

---

# 📄 Standard Success Response

```json
{
  "success": true,
  "message": "Success",
  "data": {}
}
```

---

# ❌ Standard Error Response

```json
{
  "success": false,
  "message": "Error message",
  "errors": []
}
```

---

# 📡 HTTP Status Codes

| Code | Description           |
| ---- | --------------------- |
| 200  | OK                    |
| 201  | Created               |
| 400  | Bad Request           |
| 401  | Unauthorized          |
| 403  | Forbidden             |
| 404  | Not Found             |
| 409  | Conflict              |
| 500  | Internal Server Error |

---

# 🤝 Contributing

Kontribusi sangat diterima.

Langkah kontribusi:

1. Fork repository.
2. Buat branch baru.

```bash
git checkout -b feature/new-feature
```

3. Commit perubahan.

```bash
git commit -m "feat: add new feature"
```

4. Push branch.

```bash
git push origin feature/new-feature
```

5. Buat Pull Request.

Pastikan kode mengikuti standar:

- ESLint
- TypeScript
- Struktur folder project
- Conventional Commit

---

# 📄 License

Project ini menggunakan lisensi **MIT License**.

---

# ❤️ Acknowledgements

Dibangun menggunakan:

- Express.js
- TypeScript
- Prisma ORM
- PostgreSQL
- Zod
- JWT Authentication

---

<div align="center">

**Made with ❤️ for Modern School Management System**

</div>
