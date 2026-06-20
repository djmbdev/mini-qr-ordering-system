# 🍔 DJMBurgers 🍔

A responsive, full-stack QR code-based burger restaurant ordering system built with Next.js, Prisma, PostgreSQL, and modern React development. Customers can scan a QR code to access the digital menu, place orders, and simulate a real-world ordering experience, while administrators can manage incoming orders and update payment statuses through an admin dashboard.

---

## ✨ Features

### Customer

* QR code redirects customers directly to the menu page
* Browse the burger menu
* Add items to the cart
* Update item quantities
* Remove items from the cart
* Automatically calculate the total amount
* Place an order
* Mock payment success/failure simulation
* Responsive design for desktop and mobile devices
* Light, Dark, and System theme support

### Admin

* View all customer orders
* Update payment status
* Delete orders *(added for live testing purposes)*
* Light, Dark, and System theme support

---

## 📱 QR Ordering Flow

1. Customer scans the restaurant QR code.
2. Customer is redirected to the menu page.
3. Customer browses the menu and adds burgers or drinks to the cart.
4. Customer places an order.
5. Payment is simulated (success/failure).
6. Admin manages orders through the dashboard.

---

## 🛠 Tech Stack

### Frontend

* Next.js 16
* React 19
* TypeScript
* Tailwind CSS v4
* shadcn/ui
* Framer Motion
* Lucide React

### Backend

* Next.js Server Actions / API Routes
* Prisma ORM
* PostgreSQL (Supabase)

### Deployment

* Vercel

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

From your **Supabase** project, click **Connect**, then copy the following connection strings:

* Use the **Session Pooler** connection string for `DATABASE_URL`.
* Use the **Transaction Pooler** connection string for `DIRECT_URL`.

```env
# Session Pooler connection string used by the application
DATABASE_URL="your_database_url"

# Transaction Pooler connection string used by Prisma
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
