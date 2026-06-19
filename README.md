# 🍔 DJMBurgers 🍔 | QR Ordering System 
A responsive, full-stack QR code-based burger restaurant ordering system built with Next.js, Prisma, PostgreSQL, and modern React development. Customers can scan a QR code to access the digital menu, place orders, and simulate a real-world ordering experience, while administrators can manage incoming orders and update payment statuses through an admin dashboard.


---

## 🔗 Live Demo

### QR Landing Page

https://djmburgers.vercel.app/

### Menu / Ordering Page

https://djmburgers.vercel.app/menu

### Admin Dashboard

https://djmburgers.vercel.app/dashboard

---

## ✨ Features

### Customer

- QR code redirects customers directly to the menu page
- Browse the burger menu
- Add items to the cart
- Update item quantities
- Remove items from the cart
- Automatically calculate the total amount
- Place an order
- Mock payment success/failure simulation
- Responsive design for desktop and mobile devices
- Light, Dark, and System theme support

### Admin

- View all customer orders
- Update payment status
- Delete orders *(added for live testing purposes)*
- Light, Dark, and System theme support

---

## 🛠 Tech Stack

### Frontend

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS v4
- shadcn/ui
- Framer Motion
- Lucide React

### Backend

- Next.js Server Actions / API Routes
- Prisma ORM
- PostgreSQL (Supabase)

### Deployment

- Vercel

---

## 📦 Installation

### 1. Clone the repository

```bash
git clone <your-repository-url>
cd mini-qr-ordering-system
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create the environment file

Create a `.env` file in the project root and add your PostgreSQL connection strings.

```env
# Transaction connection string used by Next.js at runtime (uses pooling)
DATABASE_URL="your_database_url"

# Direct connection string used by Prisma for migrations
DIRECT_URL="your_direct_database_url"
```

### 4. Generate the Prisma Client

```bash
npx prisma generate
```

### 5. Run database migrations

```bash
npx prisma migrate dev
```

### 6. Seed the database

Insert the default burger menu items.

```bash
npx prisma db seed
```

### 7. Start the development server

```bash
npm run dev
```

Visit:

```
http://localhost:3000
```

---

## 🗄 Database

### Tables

- Product
- Order
- OrderItem

---

## 📱 QR Ordering Flow

1. Customer scans the restaurant QR code.
2. Customer is redirected to the menu page.
3. Customer browses the menu and adds burgers to the cart.
4. Customer places an order.
5. Payment is simulated (success/failure).
6. Admin manages orders through the dashboard.

---
## 📝 Notes

This project is deployed on Vercel, with Supabase providing the live PostgreSQL database to support a fully functional online demo. To help maintain the deployed environment, a few testing features were added:

- Customers are limited to 10 active orders to prevent excessive database usage.
- Administrators can delete completed or test orders to keep the database clean and maintain the live demo.

These additions were implemented solely for the deployed demo environment and are not part of the core ordering functionality.
