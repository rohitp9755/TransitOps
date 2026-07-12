# 🚛 TransitOps

<div align="center">

### Intelligent Fleet & Transport Operations Platform

**Built for the Odoo Hackathon 2026**

Manage Vehicles • Dispatch Trips • Monitor Drivers • Track Maintenance • Analyze Fleet Performance

![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js)
![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=for-the-badge&logo=prisma)
![SQLite](https://img.shields.io/badge/SQLite-003B57?style=for-the-badge&logo=sqlite)
![JWT](https://img.shields.io/badge/JWT-Authentication-black?style=for-the-badge)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-38BDF8?style=for-the-badge&logo=tailwindcss)

</div>

---

# 📖 Overview

TransitOps is a modern Fleet & Transport Management Platform built to digitize the complete transportation lifecycle.

Instead of managing logistics through spreadsheets and manual coordination, TransitOps automates every critical fleet operation—from vehicle registration and driver management to intelligent trip dispatching, maintenance scheduling, fuel tracking, operational cost monitoring, and real-time fleet analytics.

The platform enforces business rules automatically, ensuring safer operations, eliminating human errors, and improving fleet efficiency.

---

# ✨ Key Highlights

✅ Smart Trip Dispatch Engine

✅ Automatic Vehicle & Driver Status Synchronization

✅ Role Based Access Control (RBAC)

✅ Fleet Performance Dashboard

✅ Fuel & Expense Tracking

✅ Maintenance Lifecycle Management

✅ Driver License Validation

✅ Cargo Capacity Validation

✅ Fleet ROI Analytics

✅ CSV Report Export

---

# 🚀 Features

## 🚚 Fleet Management

- Vehicle Registry
- Driver Registry
- Vehicle Status Tracking
- Driver Availability
- Vehicle Capacity Management
- License Expiry Monitoring

---

## 🗺️ Trip Management

- Create Trips
- Dispatch Trips
- Complete Trips
- Cancel Trips
- Auto Status Updates
- Distance Tracking
- Revenue Tracking

---

## 🔒 Intelligent Business Rules

TransitOps automatically prevents:

❌ Overloaded Vehicles

❌ Expired Driver Licenses

❌ Suspended Drivers

❌ Double Vehicle Assignment

❌ Double Driver Assignment

❌ Retired Vehicle Dispatch

❌ Vehicles Under Maintenance

---

## 🔧 Maintenance

- Schedule Maintenance
- Vehicle Service Logs
- Repair Cost Tracking
- Automatic In-Shop Status
- Maintenance History

---

## ⛽ Fuel & Expense Management

- Fuel Logs
- Operational Expenses
- Cost Reports
- Vehicle-wise Expense Tracking

---

## 📊 Analytics Dashboard

Real-time KPIs including

- Fleet Utilization
- Active Trips
- Available Vehicles
- Fuel Efficiency
- Operational Cost
- Vehicle ROI
- Revenue Analytics

---

# 🔄 Workflow

```text
Vehicle Registration
        │
        ▼
Driver Registration
        │
        ▼
Create Trip
        │
        ▼
Validate Business Rules
        │
        ▼
Dispatch Trip
        │
        ▼
Vehicle → On Trip

Driver → On Trip
        │
        ▼
Complete Trip
        │
        ▼
Vehicle → Available

Driver → Available
```

---

# 🏗️ Tech Stack

### Frontend

- React
- Vite
- TailwindCSS
- Axios
- React Router

### Backend

- Node.js
- Express.js
- Prisma ORM
- JWT Authentication
- Zod Validation

### Database

- SQLite

---

# 📂 Project Structure

```
TransitOps
│
├── client
│   ├── src
│   ├── public
│   └── package.json
│
├── server
│   ├── prisma
│   ├── src
│   │   ├── auth
│   │   ├── middleware
│   │   ├── modules
│   │   ├── routes
│   │   └── utils
│   └── package.json
│
└── README.md
```

---

# 🔐 User Roles

| Role | Permissions |
|-------|------------|
| Fleet Manager | Fleet Operations |
| Dispatcher | Dispatch Trips |
| Safety Officer | Driver Safety & Compliance |
| Financial Analyst | Fuel, Expenses & Analytics |

---

# 📈 Analytics

TransitOps automatically calculates

- Fleet Utilization
- Vehicle ROI
- Operational Cost
- Fuel Efficiency
- Revenue
- Maintenance Cost
- Active Fleet Ratio

---

# ⚙️ Getting Started

## Clone Repository

```bash
git clone https://github.com/YOUR_USERNAME/TransitOps.git
```

---

## Backend

```bash
cd server

npm install

npm run db:migrate

npm run db:seed

npm run dev
```

---

## Frontend

```bash
cd client

npm install

npm run dev
```

---

# 🎯 Why TransitOps?

Traditional fleet management relies on spreadsheets and manual coordination, leading to:

- Resource conflicts
- Dispatch errors
- Vehicle misuse
- Increased operational costs
- Missed maintenance
- Low visibility into fleet performance

TransitOps solves these challenges through automation, validation, and real-time insights.

---

# 🌟 Built For

**Odoo Hackathon 2026**

Designed to demonstrate:

- Clean Architecture
- Scalable Backend
- Modern Frontend
- Business Rule Automation
- Production Ready Code
- Excellent User Experience

---

# 👨‍💻 Team

- Aman Jaiswal
- Ayush Awasthi
- Neel Lapsiwala
- Rohit Prajapat

---

<div align="center">

## ⭐ If you like this project, consider giving it a Star!

Made with ❤️ for Odoo Hackathon 2026

</div>
