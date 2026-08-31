# NextGym 🏋️‍♂️ - "Rent Sports & Outdoor Gear Instantly"

[![Node.js](https://img.shields.io/badge/Node.js-22.x-green.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0-blue.svg)](https://www.typescriptlang.org/)
[![Express](https://img.shields.io/badge/Express-5.2-purple.svg)](https://expressjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-8.21-blue.svg)](https://www.postgresql.org/)
[![License](https://img.shields.io/badge/License-ISC-yellow.svg)](LICENSE)

## 📋 Overview

**NextGym** is a robust backend API built for a sports and outdoor equipment rental service, designed and developed as a complete system implementation. Customers can browse available gear, place rental orders, make secure payments, and return equipment. Providers manage their gear inventory and fulfill rental orders, while Admins oversee the platform, manage users, and moderate listings.

🔗 **Live Backend API URL:** https://nextgym.onrender.com/

## 🛠️ Tech Stack

<div align="left" style="background-color: #f4f6f9; padding: 10px; border-radius: 8px;">

| Category | Technology | Purpose |
| :--- | :--- | :--- |
| **Backend** | Node.js + Express  | REST API |
| **Language** | TypeScript  | Type safety |
| **Database & ORM** | PostgreSQL + Prisma  | Database management & ORM |
| **Authentication** | JWT (JSON Web Tokens)  | Secure user authentication |
| **Deployment** | Render | Backend API hosting & deployment|

</div>

## 👥 Roles & Permissions

<div align="left" style="background-color: #f4f6f9; padding: 10px; border-radius: 8px;">

| Role | Description | Key Permissions |
| :--- | :--- | :--- |
| **Customer** | Users who rent sports gear | Browse gear, place rental orders, make payments, track status, leave reviews |
| **Provider** | Gear vendors/rental shops | Manage gear inventory, view incoming orders, update order status |
| **Admin** | Platform moderators | Manage users, oversee all rentals, manage gear categories |

</div>

## ✨ Features

### Customer Features

* User registration and role-based login. 
* Place rental orders specifying items and dates. 
* Secure payments integration via Stripe. 
* Track rental order status and view payment history. 
* Leave ratings and reviews after returning equipment. 

### Provider Features

* Add, update, and remove gear items from personal inventory. 
* Monitor stock levels and availability. 
* View and process incoming customer rental orders (confirm). 

### Admin Features

* Comprehensive user management (view, suspend, or activate users). 
* Oversight of platform-wide gear listings and rental orders. 
* Category administration. 
  

## 🏗️ Architecture

```text
src/
├── controllers/
│   ├── admin.controller.ts
│   ├── auth.controller.ts
│   ├── gear.controller.ts
│   ├── payment.controller.ts
│   ├── provider.controller.ts
│   ├── rental.controller.ts
│   └── review.controller.ts
├── middlewares/
├── routes/
│   ├── admin.routes.ts
│   ├── auth.routes.ts
│   ├── category.routes.ts
│   ├── gear.routes.ts
│   ├── index.ts
│   ├── payment.routes.ts
│   ├── provider.routes.ts
│   ├── rental.routes.ts
│   └── review.routes.ts
├── validations/
│   ├── auth.validation.ts
│   ├── category.validation.ts
│   ├── gear.validation.ts
│   ├── rental.validation.ts
│   └── review.validation.ts
├── app.ts
├── AppError.ts
├── prisma.ts
└── server.ts
```

## 🌐 API Endpoints Specification  Documentation

All API endpoints have been fully tested using Postman. You can access the complete Postman documentation and route breakdown below:

🔗 **Postman API Docs:** [Postman Docs ](https://documenter.getpostman.com/view/51758518/2sBY4QtLLx)

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user (customer/provider) |
| POST | `/api/auth/login` | Login user, return JWT |
| GET | `/api/auth/me` | Get current authenticated user |

### Gear (Public)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/gear` | Get all gear with filters (category, price, brand) |
| GET | `/api/gear/:id` | Get gear details |
| GET | `/api/categories` | Get all gear categories |

### Rental Orders
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/rentals` | Create new rental order |
| GET | `/api/rentals` | Get user's rental orders |
| GET | `/api/rentals/:id` | Get rental order details |

### Payments (Stripe)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/payments/create` | Create a payment intent/session for a rental order |
| POST | `/api/payments/confirm` | Confirm/verify payment (webhook or callback) |
| GET | `/api/payments` | Get user's payment history |
| GET | `/api/payments/:id` | Get payment details |

### Provider Management
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/provider/gear` | Add gear to inventory |
| PUT | `/api/provider/gear/:id` | Update gear listing |
| DELETE | `/api/provider/gear/:id` | Remove gear from inventory |
| GET | `/api/provider/orders` | Get provider's incoming orders |
| PATCH | `/api/provider/orders/:id` | Update rental order status |

### Reviews
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/reviews` | Create review (after rental return) |

### Admin
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/users` | Get all users |
| PATCH | `/api/admin/users/:id` | Update user status (suspend/activate) |
| GET | `/api/admin/gear` | Get all gear listings |
| GET | `/api/admin/rentals` | Get all rental orders |

---

## 🚀 Deployment Guide (Render)

Follow these steps to deploy the Express & TypeScript backend to **Render**.

### Step 1: Create Render Web Service

1. Log into the [Render Dashboard](https://render.com).
2. Click **New +** > **Web Service**.
3. Connect your GitHub account and select the required repository.

### Step 2: Configure Web Service

Fill out the configuration dashboard with the following settings:

| Field | Configuration Value |
| :--- | :--- |
| **Name** | `Relavent Name` |
| **Region** | Select closest region (e.g., `Oregon (US West)`) |
| **Branch** | `main` |
| **Root Directory** | *Leave blank* |
| **Runtime** | `Node` |
| **Build Command** | `npm install && npm run build` |
| **Start Command** | `npm run start` |
| **Instance Type** | `Free` |

### Step 3: Environment Variables

Navigate to the **Environment** tab (or click **Advanced**) and inject your keys:

* `DATABASE_URL` = `Your required input from .env file`
* `JWT_SECRET` = `Your required input from .env file`

> ⚠️ **Note:** Do not add `PORT` manually. Render handles its own internal port allocation.

### Step 4: Deploy & Verify

1. Click **Deploy Web Service**.
2. Monitor the **Logs** tab. Success is confirmed when you see your initialization logs:
   ```text
   🐘 PostgreSQL pool initialized successfully.
   🚀 NextGym server is racing hot on port 10000
3. Copy your live public URL from the top left of the dashboard (e.g., [https://nextgym.onrender.com](https://nextgym.onrender.com/) ) to test in Postman or your browser.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 👨‍💻 Author

Md. Abidur Rahman  
