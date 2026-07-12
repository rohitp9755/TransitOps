<div align="center">

# 🚛 TransitOps

### Smart Fleet Management. Intelligent Dispatch. Real-Time Analytics.

<p align="center">
A Fleet Operations Platform built for the <b>Odoo Hackathon 2026</b> — streamlining logistics through automation, role-based workflows, and data-driven insights.
</p>

<p align="center">

<img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react"/>
<img src="https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js"/>
<img src="https://img.shields.io/badge/Prisma-ORM-2D3748?style=for-the-badge&logo=prisma"/>
<img src="https://img.shields.io/badge/SQLite-Database-003B57?style=for-the-badge&logo=sqlite"/>
<img src="https://img.shields.io/badge/TailwindCSS-38BDF8?style=for-the-badge&logo=tailwindcss"/>
<img src="https://img.shields.io/badge/Odoo-Hackathon-714B67?style=for-the-badge"/>

</p>

</div>

---

# 🌍 The Problem

Most logistics companies still run their fleets off spreadsheets and manual coordination — managing vehicles, drivers, maintenance schedules, and dispatch by hand.

That usually leads to double-booked vehicles, drivers going out with expired licenses, overloaded cargo, missed maintenance, and no real visibility into what's actually happening across the fleet.

TransitOps brings all of this into one platform instead of leaving it scattered across sheets and side conversations.

---

# ✨ Why TransitOps?

It's not just another CRUD app — TransitOps actually enforces business logic. Every action gets validated before it goes through, so you're not relying on someone remembering the rules.

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

# 🧠 Business Rules It Enforces

TransitOps automatically blocks:

- Assigning vehicles already on a trip
- Dispatching vehicles under maintenance
- Dispatching retired vehicles
- Assigning suspended drivers
- Assigning drivers with expired licenses
- Cargo exceeding vehicle capacity
- Duplicate vehicle registration

Every workflow gets validated before it's executed — this was the part we focused on most.

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

Fleet utilization, active trips, vehicle status, driver availability, fuel efficiency, revenue analytics, ROI, and operational cost — all in one view.

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

<div align="center">

# ⭐ Built for Odoo Hackathon 2026

### "Automating Logistics. Empowering Fleet Operations."

If you like this project, feel free to ⭐ the repository.

</div>
