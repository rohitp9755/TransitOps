<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:714B67,50:9B5DE5,100:2D3748&height=220&section=header&text=TransitOps&fontSize=65&fontColor=ffffff&animation=fadeIn&fontAlignY=32&desc=Smart%20Fleet%20Management%20%7C%20Intelligent%20Dispatch%20%7C%20Real-Time%20Analytics&descAlignY=52&descSize=18" width="100%"/>

<a href="https://github.com/<your-username>/TransitOps">
<img src="https://readme-typing-svg.demolab.com?font=Fira+Code&weight=600&size=24&pause=1000&color=9B5DE5&center=true&vCenter=true&width=650&lines=Automating+Logistics...;Empowering+Fleet+Operations...;Zero+Double-Bookings.+Zero+Guesswork.;Built+for+Odoo+Hackathon+2026" alt="Typing SVG" />
</a>

<br/>

<img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black"/>
<img src="https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js"/>
<img src="https://img.shields.io/badge/Prisma-ORM-2D3748?style=for-the-badge&logo=prisma"/>
<img src="https://img.shields.io/badge/SQLite-Database-003B57?style=for-the-badge&logo=sqlite"/>
<img src="https://img.shields.io/badge/TailwindCSS-38BDF8?style=for-the-badge&logo=tailwindcss"/>
<img src="https://img.shields.io/badge/JWT-Auth-000000?style=for-the-badge&logo=jsonwebtokens"/>
<img src="https://img.shields.io/badge/Odoo-Hackathon_2026-714B67?style=for-the-badge"/>

<br/><br/>

<img src="https://img.shields.io/github/stars/<your-username>/TransitOps?style=for-the-badge&color=9B5DE5"/>
<img src="https://img.shields.io/github/forks/<your-username>/TransitOps?style=for-the-badge&color=714B67"/>
<img src="https://img.shields.io/badge/status-active-brightgreen?style=for-the-badge"/>
<img src="https://img.shields.io/badge/license-MIT-blue?style=for-the-badge"/>

<br/><br/>

<img src="https://user-images.githubusercontent.com/74038190/212284100-561aa473-3905-4a80-b561-0d28506553ee.gif" width="100%" height="2px"/>

</div>

<br/>

## 📖 Table of Contents

<div align="center">

[The Problem](#-the-problem) • [Why TransitOps](#-why-transitops) • [Features](#-key-features) • [Business Rules](#-business-rules-it-enforces) • [Workflow](#%EF%B8%8F-system-workflow) • [Architecture](#%EF%B8%8F-architecture) • [Screenshots](#-screenshots) • [Tech Stack](#-tech-stack) • [Quick Start](#-quick-start) • [Team](#-team)

</div>

<br/>

## 🌍 The Problem

<img align="right" width="260" src="https://user-images.githubusercontent.com/74038190/229223263-cf2e4b07-2615-4f87-9c38-e37600f8381a.gif"/>

Most logistics companies still run their fleets off spreadsheets and manual coordination — vehicles, drivers, maintenance, and dispatch tracked by hand across scattered sheets and side conversations.

<table>
<tr>
<td width="50%" valign="top">

**🔴 The old way**
- Double-booked vehicles
- Drivers going out with expired licenses
- Overloaded cargo
- Missed maintenance windows
- Zero real-time visibility

</td>
<td width="50%" valign="top">

**🟢 The TransitOps way**
- One source of truth for the whole fleet
- Rules enforced automatically, every time
- Live status for every vehicle & driver
- Maintenance tracked, not forgotten
- Analytics that update in real time

</td>
</tr>
</table>

<br clear="right"/>

---

## ✨ Why TransitOps?

> It's not just another CRUD app. TransitOps enforces **real business logic** — every action is validated before it executes, so operational safety doesn't depend on someone remembering the rules.

<div align="center">

| 🚫 Without TransitOps | ✅ With TransitOps |
|:---|:---|
| Manual double-checking | Automatic validation |
| Spreadsheet chaos | Centralized dashboard |
| Reactive maintenance | Proactive tracking |
| Guesswork on ROI | Real ROI analytics |

</div>

---

## 🎯 Key Features

<div align="center">
<table>
<tr>
<td align="center" width="33%">
<h3>🚛</h3>
<b>Fleet</b>
<br/><br/>
Vehicle Registry<br/>
Driver Registry<br/>
Maintenance Logs<br/>
Fuel Tracking<br/>
Expense Tracking
</td>
<td align="center" width="33%">
<h3>🚦</h3>
<b>Dispatch</b>
<br/><br/>
Smart Trip Dispatch<br/>
Auto Status Updates<br/>
Cargo Validation<br/>
Driver Validation<br/>
Lifecycle Management
</td>
<td align="center" width="33%">
<h3>📊</h3>
<b>Analytics</b>
<br/><br/>
Fleet Utilization<br/>
Vehicle ROI<br/>
Fuel Efficiency<br/>
Revenue Insights<br/>
CSV Export
</td>
</tr>
</table>
</div>

---

## 🧠 Business Rules It Enforces

<div align="center">

```mermaid
flowchart TD
    A([🚛 Trip Request]) --> B{Vehicle<br/>Available?}
    B -- No --> X([❌ Blocked])
    B -- Yes --> C{Under Maintenance<br/>or Retired?}
    C -- Yes --> X
    C -- No --> D{Driver Suspended or<br/>License Expired?}
    D -- Yes --> X
    D -- No --> E{Cargo Within<br/>Capacity?}
    E -- No --> X
    E -- Yes --> F([✅ Trip Dispatched])
    F --> G[Vehicle & Driver → On Trip]
    G --> H([🏁 Trip Completed])
    H --> I[Vehicle & Driver → Available]
    I --> J([📊 Analytics Updated])

    style A fill:#714B67,color:#fff
    style X fill:#e63946,color:#fff
    style F fill:#2a9d8f,color:#fff
    style H fill:#2a9d8f,color:#fff
    style J fill:#9B5DE5,color:#fff
```

</div>

Every workflow gets checked against these rules before it's allowed to execute — this is the part we spent most of our build time on.

---

## ⚙️ System Workflow

```mermaid
sequenceDiagram
    participant U as 🧑‍💼 Dispatcher
    participant S as ⚙️ TransitOps
    participant DB as 🗄️ Database

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
    Note over S,DB: Trip in progress...
    S->>DB: Mark Trip Complete
    S->>DB: Vehicle & Driver → Available
    S->>U: 📊 Analytics Refreshed
```

---

## 🏗️ Architecture

```mermaid
flowchart TB
    C["🖥️ React + Tailwind (Client)"] --> API["🔌 REST API (Express)"]
    API --> Auth["🔐 Authentication<br/>JWT + RBAC"]
    API --> Fleet["🚛 Fleet Ops<br/>Vehicles / Drivers / Trips / Rules"]
    API --> Analytics["📊 Analytics<br/>Utilization / ROI / Fuel / CSV"]
    Auth --> ORM["🧩 Prisma ORM"]
    Fleet --> ORM
    Analytics --> ORM
    ORM --> DB[("🗄️ SQLite DB")]

    style C fill:#61DAFB,color:#000
    style API fill:#339933,color:#fff
    style ORM fill:#2D3748,color:#fff
    style DB fill:#003B57,color:#fff
```

---

## 📸 Screenshots

<div align="center">

<details open>
<summary><b>🖥️ Dashboard & Fleet Overview</b></summary>
<br/>

| Dashboard | Fleet |
|:---:|:---:|
| ![](screenshots/dashboard.png) | ![](screenshots/fleet.png) |

</details>

<details>
<summary><b>🚦 Dispatcher & 📊 Analytics</b></summary>
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

<img src="https://skillicons.dev/icons?i=react,vite,tailwind,nodejs,express,prisma,sqlite,js&theme=dark" />

<br/><br/>

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

<table>
<tr>
<td>

**1. Clone the repo**
```bash
git clone https://github.com/<your-username>/TransitOps.git
```

</td>
</tr>
<tr>
<td>

**2. Start the backend**
```bash
cd server
npm install
npm run db:migrate
npm run db:seed
npm run dev
```

</td>
</tr>
<tr>
<td>

**3. Start the frontend**
```bash
cd client
npm install
npm run dev
```

</td>
</tr>
</table>

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
<td align="center" width="25%">
<img src="https://api.dicebear.com/7.x/thumbs/svg?seed=Aman" width="70"/><br/>
<b>Aman Jaiswal</b><br/>
<sub>Analytics • Integration</sub>
</td>
<td align="center" width="25%">
<img src="https://api.dicebear.com/7.x/thumbs/svg?seed=Ayush" width="70"/><br/>
<b>Ayush Awasthi</b><br/>
<sub>Frontend • UI/UX</sub>
</td>
<td align="center" width="25%">
<img src="https://api.dicebear.com/7.x/thumbs/svg?seed=Neel" width="70"/><br/>
<b>Neel Lapsiwala</b><br/>
<sub>Backend • Authentication</sub>
</td>
<td align="center" width="25%">
<img src="https://api.dicebear.com/7.x/thumbs/svg?seed=Rohit" width="70"/><br/>
<b>Rohit Prajapat</b><br/>
<sub>Fleet Logic • Dispatch Engine</sub>
</td>
</tr>
</table>

</div>

---

<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:2D3748,50:9B5DE5,100:714B67&height=150&section=footer"/>

### ⭐ Built with passion for Odoo Hackathon 2026

**"Automating Logistics. Empowering Fleet Operations."**

If you like this project, don't forget to star the repository ⭐

</div>
