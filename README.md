<div align="center">

# 🚛 TransitOps

### Smart Fleet Management. Intelligent Dispatch. Real-Time Analytics.

<p align="center">
A next-generation Fleet Operations Platform built for the <b>Odoo Hackathon 2026</b>, designed to streamline logistics through intelligent automation, role-based workflows, and data-driven insights.
</p>

<p align="center">

<img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react"/>
<img src="https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js"/>
<img src="https://img.shields.io/badge/Prisma-ORM-2D3748?style=for-the-badge&logo=prisma"/>
<img src="https://img.shields.io/badge/SQLite-Database-003B57?style=for-the-badge&logo=sqlite"/>
<img src="https://img.shields.io/badge/TailwindCSS-38BDF8?style=for-the-badge&logo=tailwindcss"/>
<img src="https://img.shields.io/badge/Odoo-Hackathon-714B67?style=for-the-badge"/>

</p>

<p>

⭐ Intelligent Dispatch Engine

⭐ Fleet Analytics

⭐ Automated Business Rules

⭐ Production Ready Architecture

</p>

</div>

---

# 🌍 The Problem

Modern logistics companies still rely on spreadsheets and manual coordination for managing fleets, drivers, maintenance schedules, and dispatch operations.

This leads to:

❌ Double-booked vehicles

❌ Expired-license drivers on trips

❌ Overloaded cargo

❌ Missed maintenance

❌ High operational costs

❌ No centralized analytics

TransitOps transforms these disconnected workflows into a unified, intelligent fleet management platform.

---

# ✨ Why TransitOps?

Unlike a traditional CRUD application, TransitOps enforces **real business logic**.

Every action is validated before execution, ensuring operational safety, resource optimization, and complete fleet visibility.

---

# 🎯 Key Features

| 🚛 Fleet | 🚦 Dispatch | 📊 Analytics |
|----------|------------|-------------|
| Vehicle Registry | Smart Trip Dispatch | Fleet Utilization |
| Driver Registry | Auto Status Updates | Vehicle ROI |
| Maintenance Logs | Cargo Validation | Fuel Efficiency |
| Fuel Tracking | Driver Validation | Revenue Insights |
| Expense Tracking | Lifecycle Management | CSV Export |

---

# 🧠 Intelligent Business Rules

TransitOps automatically blocks:

🟥 Assigning vehicles already on a trip

🟥 Dispatching vehicles under maintenance

🟥 Dispatching retired vehicles

🟥 Assigning suspended drivers

🟥 Assigning drivers with expired licenses

🟥 Cargo exceeding vehicle capacity

🟥 Duplicate vehicle registration

Every workflow is validated before execution.

---

# ⚙️ System Workflow

```text
Vehicle Registration
        │
        ▼
Driver Registration
        │
        ▼
Trip Creation
        │
        ▼
Business Rule Validation
        │
        ▼
Trip Dispatch
        │
        ▼
Vehicle → On Trip

Driver → On Trip
        │
        ▼
Trip Completion
        │
        ▼
Vehicle → Available

Driver → Available
        │
        ▼
Analytics Updated
```

---

# 🏗️ Architecture

```text
                    React + Tailwind
                           │
                           │
                    REST API (Express)
                           │
              ┌────────────┼────────────┐
              │            │            │
          Authentication  Fleet      Analytics
              │         Operations      │
              └────────────┼────────────┘
                       Prisma ORM
                           │
                        SQLite DB
```

---

# 📸 Screenshots

> Add your screenshots here

| Dashboard | Fleet |
|-----------|-------|
| ![](screenshots/dashboard.png) | ![](screenshots/fleet.png) |

| Dispatcher | Analytics |
|-------------|-----------|
| ![](screenshots/trips.png) | ![](screenshots/analytics.png) |

---

# 📈 Dashboard

✔ Fleet Utilization

✔ Active Trips

✔ Vehicle Status

✔ Driver Availability

✔ Fuel Efficiency

✔ Revenue Analytics

✔ ROI

✔ Operational Cost

---

# 🛠 Tech Stack

| Layer | Technology |
|--------|------------|
| Frontend | React, Vite, Tailwind CSS |
| Backend | Node.js, Express |
| ORM | Prisma |
| Database | SQLite |
| Authentication | JWT |
| Validation | Zod |

---

# 🚀 Quick Start

## Clone

```bash
git clone https://github.com/<your-username>/TransitOps.git
```

## Backend

```bash
cd server
npm install
npm run db:migrate
npm run db:seed
npm run dev
```

## Frontend

```bash
cd client
npm install
npm run dev
```

---

# 📂 Project Structure

```text
TransitOps
│
├── client
│   ├── components
│   ├── pages
│   ├── hooks
│   └── services
│
├── server
│   ├── auth
│   ├── middleware
│   ├── modules
│   ├── prisma
│   └── utils
│
└── README.md
```

---

# 👥 Team

<div align="center">

| Name | Responsibility |
|------|----------------|
| 👨‍💻 Aman Jaiswal | Analytics • Integration |
| 👨‍💻 Ayush Awasthi | Frontend • UI/UX |
| 👨‍💻 Neel Lapsiwala | Backend • Authentication |
| 👨‍💻 Rohit Prajapat | Fleet Logic • Dispatch Engine |

</div>

---

# 💡 Highlights

✅ Clean Architecture

✅ Modular Codebase

✅ Production Ready

✅ Responsive UI

✅ RBAC

✅ Real-Time Status Synchronization

✅ Intelligent Validation

✅ Fleet Analytics

✅ Easy to Scale

---

<div align="center">

# ⭐ Built with passion for Odoo Hackathon 2026

### "Automating Logistics. Empowering Fleet Operations."

If you like this project, don't forget to ⭐ the repository.

</div>
