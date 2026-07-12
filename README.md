<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:714B67,100:2D3748&height=200&section=header&text=TransitOps&fontSize=60&fontColor=ffffff&animation=fadeIn&fontAlignY=35&desc=Smart%20Fleet%20Management%20%7C%20Intelligent%20Dispatch%20%7C%20Real-Time%20Analytics&descAlignY=55&descSize=18" width="100%"/>

<a href="https://github.com/<your-username>/TransitOps">
<img src="https://readme-typing-svg.demolab.com?font=Fira+Code&size=22&pause=1000&color=714B67&center=true&vCenter=true&width=600&lines=Automating+Logistics...;Empowering+Fleet+Operations...;Built+for+Odoo+Hackathon+2026" alt="Typing SVG" />
</a>

<br/><br/>

<img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black"/>
<img src="https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js"/>
<img src="https://img.shields.io/badge/Prisma-ORM-2D3748?style=for-the-badge&logo=prisma"/>
<img src="https://img.shields.io/badge/SQLite-Database-003B57?style=for-the-badge&logo=sqlite"/>
<img src="https://img.shields.io/badge/TailwindCSS-38BDF8?style=for-the-badge&logo=tailwindcss"/>
<img src="https://img.shields.io/badge/Odoo-Hackathon_2026-714B67?style=for-the-badge"/>

<br/><br/>

<img src="https://img.shields.io/github/stars/<your-username>/TransitOps?style=social"/>
<img src="https://img.shields.io/github/forks/<your-username>/TransitOps?style=social"/>
<img src="https://img.shields.io/badge/status-active-brightgreen?style=flat-square"/>
<img src="https://img.shields.io/badge/license-MIT-blue?style=flat-square"/>

</div>

<br/>

---

## 🌍 The Problem

Most logistics companies still run their fleets off spreadsheets and manual coordination — vehicles, drivers, maintenance schedules, and dispatch all tracked by hand across different sheets and side conversations.

<table>
<tr>
<td width="50%" valign="top">

**What that usually looks like:**
- 🔴 Double-booked vehicles
- 🔴 Drivers going out with expired licenses
- 🔴 Overloaded cargo
- 🔴 Missed maintenance windows
- 🔴 Zero real-time visibility

</td>
<td width="50%" valign="top">

**What TransitOps does instead:**
- 🟢 One source of truth for the whole fleet
- 🟢 Rules enforced automatically, every time
- 🟢 Live status for every vehicle & driver
- 🟢 Maintenance tracked, not forgotten
- 🟢 Analytics that update in real time

</td>
</tr>
</table>

---

## ✨ Why TransitOps?

> It's not just another CRUD app. TransitOps enforces **real business logic** — every action is validated before it executes, so operational safety doesn't depend on someone remembering the rules.

<div align="center">

| 🚫 Without TransitOps | ✅ With TransitOps |
|:---:|:---:|
| Manual double-checking | Automatic validation |
| Spreadsheet chaos | Centralized dashboard |
| Reactive maintenance | Proactive tracking |
| Guesswork on ROI | Real ROI analytics |

</div>

---

## 🎯 Key Features

<table>
<tr>
<th align="center">🚛 Fleet</th>
<th align="center">🚦 Dispatch</th>
<th align="center">📊 Analytics</th>
</tr>
<tr>
<td valign="top">

- Vehicle Registry
- Driver Registry
- Maintenance Logs
- Fuel Tracking
- Expense Tracking

</td>
<td valign="top">

- Smart Trip Dispatch
- Auto Status Updates
- Cargo Validation
- Driver Validation
- Lifecycle Management

</td>
<td valign="top">

- Fleet Utilization
- Vehicle ROI
- Fuel Efficiency
- Revenue Insights
- CSV Export

</td>
</tr>
</table>

---

## 🧠 Business Rules It Enforces

<div align="center">

```mermaid
flowchart TD
    A[Trip Request] --> B{Vehicle Available?}
    B -- No, already on trip --> X[❌ Blocked]
    B -- Yes --> C{Vehicle Under Maintenance<br/>or Retired?}
    C -- Yes --> X
    C -- No --> D{Driver Suspended or<br/>License Expired?}
    D -- Yes --> X
    D -- No --> E{Cargo Within<br/>Vehicle Capacity?}
    E -- No --> X
    E -- Yes --> F[✅ Trip Dispatched]
    F --> G[Vehicle & Driver → On Trip]
    G --> H[Trip Completed]
    H --> I[Vehicle & Driver → Available]
    I --> J[📊 Analytics Updated]
```

</div>

Every workflow gets checked against these rules before it's allowed to execute — this is the part we spent most of our build time on.

---

## ⚙️ System Workflow

```mermaid
sequenceDiagram
    participant U as Dispatcher
    participant S as TransitOps
    participant DB as Database

    U->>S: Register Vehicle & Driver
    S->>DB: Save records
    U->>S: Create Trip
    S->>S: Run Business Rule Validation
    alt Rules Passed
        S->>DB: Dispatch Trip
        S->>DB: Vehicle & Driver → On Trip
    else Rules Failed
        S->>U: ❌ Reject with reason
    end
    Note over S,DB: Trip runs...
    S->>DB: Mark Trip Complete
    S->>DB: Vehicle & Driver → Available
    S->>U: 📊 Analytics Refreshed
```

---

## 🏗️ Architecture

```text
                         React + Tailwind (Client)
                                   │
                                   ▼
                         REST API (Express)
                                   │
                 ┌─────────────────┼─────────────────┐
                 ▼                 ▼                 ▼
          Authentication       Fleet Ops         Analytics
           (JWT + RBAC)     (Vehicles/Drivers/   (Utilization,
                                Trips/Rules)      ROI, Fuel, CSV)
                 │                 │                 │
                 └─────────────────┼─────────────────┘
                                   ▼
                              Prisma ORM
                                   │
                                   ▼
                              SQLite DB
```

---

## 📸 Screenshots

<div align="center">

<details open>
<summary><b>Dashboard & Fleet Overview</b></summary>
<br/>

| Dashboard | Fleet |
|:---:|:---:|
| ![](screenshots/dashboard.png) | ![](screenshots/fleet.png) |

</details>

<details>
<summary><b>Dispatcher & Analytics</b></summary>
<br/>

| Dispatcher | Analytics |
|:---:|:---:|
| ![](screenshots/trips.png) | ![](screenshots/analytics.png) |

</details>

</div>

---

## 📈 Dashboard at a Glance

<div align="center">

| Metric | Tracked |
|---|:---:|
| Fleet Utilization | ✅ |
| Active Trips | ✅ |
| Vehicle Status | ✅ |
| Driver Availability | ✅ |
| Fuel Efficiency | ✅ |
| Revenue Analytics | ✅ |
| ROI per Vehicle | ✅ |
| Operational Cost | ✅ |

</div>

---

## 🛠 Tech Stack

<div align="center">

| Layer | Technology |
|:---:|:---:|
| Frontend | React · Vite · Tailwind CSS |
| Backend | Node.js · Express |
| ORM | Prisma |
| Database | SQLite |
| Authentication | JWT |
| Validation | Zod |

</div>

---

## 🚀 Quick Start

### 1. Clone

```bash
git clone https://github.com/<your-username>/TransitOps.git
```

### 2. Backend

```bash
cd server
npm install
npm run db:migrate
npm run db:seed
npm run dev
```

### 3. Frontend

```bash
cd client
npm install
npm run dev
```

<div align="center">
<sub>💡 Backend runs on <code>localhost:5000</code> · Frontend on <code>localhost:5173</code></sub>
</div>

---

## 📂 Project Structure

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

## 👥 Team

<div align="center">

<table>
<tr>
<td align="center">
<b>Aman Jaiswal</b><br/>
<sub>Analytics • Integration</sub>
</td>
<td align="center">
<b>Ayush Awasthi</b><br/>
<sub>Frontend • UI/UX</sub>
</td>
<td align="center">
<b>Neel Lapsiwala</b><br/>
<sub>Backend • Authentication</sub>
</td>
<td align="center">
<b>Rohit Prajapat</b><br/>
<sub>Fleet Logic • Dispatch Engine</sub>
</td>
</tr>
</table>

</div>

---

<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:2D3748,100:714B67&height=120&section=footer"/>

### ⭐ Built with passion for Odoo Hackathon 2026

**"Automating Logistics. Empowering Fleet Operations."**

If you like this project, don't forget to star the repository ⭐

</div>
