# CarterTheTownWear

A modern, premium clothing e-commerce platform — Men, Women, and Kids wear — built with React, Express, and MySQL.

## Stack

- **Frontend:** React 18 + Vite + Tailwind CSS + Lucide React
- **Backend:** Node.js + Express + JWT Auth + Bcrypt
- **Database:** MySQL via XAMPP
- **Images:** Multer → `/server/uploads/` (path stored in DB)

## Color Palette

| Token          | Hex       |
|----------------|-----------|
| Primary Dark   | `#0D0D0D` |
| Secondary Dark | `#1A1A1A` |
| Accent Gold    | `#D4AF37` |
| Muted Gold     | `#AA7C11` |
| Neutral Light  | `#F5F5F7` |
| Muted Gray     | `#8E8E93` |

## Quick Start

### 1. XAMPP — start Apache + MySQL

### 2. Database
Open phpMyAdmin → run `setup.sql`  
This creates the `carterthetown` database, tables, seed products, and the default admin account.

### 3. Server
```bash
cd server
npm install
npm run dev    # http://localhost:5000
```

### 4. Client
```bash
cd client
npm install
npm run dev    # http://localhost:5173
```

## Default Admin Credentials

| Field    | Value                         |
|----------|-------------------------------|
| Email    | admin@carterthetown.com       |
| Password | password                      |

> Change these via phpMyAdmin after first login.

## WhatsApp Integration

Open `client/src/config.js` and set your WhatsApp Business number:

```js
export const WHATSAPP_NUMBER = '2348000000000'; // your number, no + or spaces
```

## Pages & Routes

| Route          | Description                              |
|----------------|------------------------------------------|
| `/`            | Landing — Hero + Our Picks Today         |
| `/browse`      | Full catalog — category + brand filter + pagination |
| `/admin/login` | Admin login (JWT auth)                   |
| `/admin`       | Protected dashboard — add/manage products|

## API Endpoints

| Method | Endpoint               | Auth     | Description                   |
|--------|------------------------|----------|-------------------------------|
| POST   | `/api/auth/login`      | None     | Admin login → JWT             |
| GET    | `/api/auth/me`         | Bearer   | Verify token                  |
| GET    | `/api/products`        | None     | List products (filter + page) |
| GET    | `/api/products/picks`  | None     | 3 random picks                |
| GET    | `/api/products/brands` | None     | Distinct brand list           |
| GET    | `/api/products/:id`    | None     | Single product                |
| POST   | `/api/products`        | Admin    | Create product + upload image |
| DELETE | `/api/products/:id`    | Admin    | Delete product + image file   |

## Product Categories

Products are tagged as **Men**, **Women**, or **Kids** at creation time and filterable on the Browse page.

## Structure

```
CarterTheTownWear/
├── .gitignore
├── README.md
├── setup.sql
├── client/
│   ├── src/
│   │   ├── config.js             ← WhatsApp number + constants
│   │   ├── context/AuthContext   ← JWT session management
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── ProductCard.jsx   ← opens modal on View/Quick View
│   │   │   ├── ProductModal.jsx  ← detail + WhatsApp CTA
│   │   │   ├── SkeletonCard.jsx
│   │   │   └── Toast.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx          ← hero + picks
│   │   │   ├── Browse.jsx        ← full catalog + filters + pagination
│   │   │   ├── AdminLogin.jsx
│   │   │   └── Admin.jsx
│   │   └── index.css             ← design system
└── server/
    ├── middleware/auth.js         ← JWT verify + admin guard
    ├── routes/auth.js
    ├── routes/products.js
    ├── db.js
    ├── index.js
    └── uploads/
```
