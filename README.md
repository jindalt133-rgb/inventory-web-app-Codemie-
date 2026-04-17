# 📦 Inventory Management System

A full-stack Inventory Management System built using **React (Vite)**, **Node.js (Express)**, and **PostgreSQL (Neon)**.
The application allows users to manage products, suppliers, and stock movements with authentication and a real-time dashboard.

---

## 🚀 Live Demo

🔗 Frontend: https://inventory-frontend-six-lemon.vercel.app
🔗 Backend API: https://inventory-backend-fx9d.onrender.com

---

## 🧰 Tech Stack

### Frontend

* React (Vite)
* Axios
* React Router

### Backend

* Node.js
* Express.js
* JWT Authentication
* bcrypt (password hashing)

### Database

* PostgreSQL (Neon)

### Deployment

* Frontend: Vercel
* Backend: Render

---

## ✨ Features

### 🔐 Authentication

* User Registration
* Login with JWT authentication
* Role-based field (Admin/Staff)

### 📦 Product Management

* Add, Edit, Delete Products
* SKU-based tracking
* Search by name or SKU

### 🏭 Supplier Management

* Add and manage suppliers

### 📊 Stock Management

* Stock IN
* Stock OUT
* Automatic quantity updates

### 📈 Dashboard

* Total products
* Total stock quantity
* Low stock alerts
* Recent stock activity

### ⚠️ Low Stock Monitoring

* Identify products below reorder level

---

## 🛠️ Installation (Local Setup)

### 1️⃣ Clone the repository

```bash
git clone https://github.com/junaideusha/inventory-web-app.git
cd inventory-web-app
```

### 2️⃣ Setup Backend

```bash
cd server
npm install
```

Create `.env` file inside `server/`:

```env
DATABASE_URL=your_postgresql_connection_string
JWT_SECRET=your_secret_key
```

Run backend:

```bash
npm run dev
```

---

### 3️⃣ Setup Frontend

```bash
cd client
npm install
```

Create `.env` file inside `client/`:

```env
VITE_API_URL=http://localhost:5000/api
```

Run frontend:

```bash
npm run dev
```

---

## 🌐 Deployment

### Backend (Render)

* Connected GitHub repo
* Added environment variables:

  * `DATABASE_URL`
  * `JWT_SECRET`

### Frontend (Vercel)

* Root directory: `client`
* Environment variable:

  * `VITE_API_URL=https://inventory-backend-fx9d.onrender.com/api`

---

## ⚠️ Common Issues & Fixes

### CORS Error

Fixed by allowing frontend URL in backend:

```js
cors({
  origin: ["http://localhost:5173", "https://your-vercel-url"]
})
```

---

### Database Schema Mismatch

Ensure correct columns exist:

```sql
ALTER TABLE users ADD COLUMN password_hash TEXT;
ALTER TABLE products ADD COLUMN category_id INTEGER;
```

---

## 📸 Screenshots

*Add screenshots of your dashboard, products page, etc.*

---

## 👨‍💻 Author

**Junaid Alam**
📍 Dhaka, Bangladesh
📧 [junaideusha@gmail.com](mailto:junaideusha@gmail.com)
🔗 LinkedIn: https://www.linkedin.com/in/md-junaid-alam-eusha-65400232b/
🔗 GitHub: https://github.com/junaideusha

---

## 🏁 Conclusion

This project demonstrates:

* Full-stack development
* REST API integration
* Authentication & security
* Real-world deployment
* Debugging production issues

---

⭐ If you like this project, consider giving it a star!
