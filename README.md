# PulseDesk - Multi-Tenant Enterprise Helpdesk Platform

Welcome to **PulseDesk**, a production-ready multi-tenant support ticketing and helpdesk solution built for the Forge 2 Hackathon.

PulseDesk is engineered to provide lightning-fast support operations, rigid organizational multi-tenancy isolation, automated SLA tracking, real-time activity audit logging, and modern agent workflows.

---

## 🛠️ Tech Stack

### Backend
- **Framework:** Laravel 11 (PHP 8.2+)
- **Database:** MySQL 8
- **Authentication:** Laravel Sanctum (Token-based API auth)
- **Architecture:** Multi-Tenant Domain-Driven RESTful API

### Frontend
- **Framework:** React 19
- **Build Tool:** Vite
- **Styling:** TailwindCSS (Glassmorphism & Custom Design System)
- **State & Routing:** Context API & React Router v7

### Operations & Deployment
- **Containerization:** Docker & Docker Compose
- **Continuous Integration:** GitHub Actions CI/CD Pipeline

---

## 📁 Repository Structure

```
pulsedesk/
├── backend/                  # Laravel 11 REST API Application
│   ├── app/                  # Controllers, Models, Middleware, Services, Policies
│   ├── database/             # Migrations, Factories, Seeders
│   ├── routes/               # API Endpoint Routing Definitions
│   ├── tests/                # Automated Feature & Unit Test Suite
│   └── .env.example
├── frontend/                 # React 19 Single Page Application
│   ├── src/                  # API Clients, Components, Pages, Layouts, Hooks
│   └── .env.example
├── docs/                     # API Specifications & System Documentation
├── evidence/                 # Verification Screenshots, Test Reports, Logs
├── agents/                   # Orchestrator & OpenClaw Agent Specifications
├── slack-export/             # Team Communication Logs & Integration Data
├── sprints/                  # Complete Sprint Backlogs & Issue Specifications
│   ├── sprint-1.md
│   ├── sprint-2.md
│   ├── sprint-3.md
│   ├── sprint-4.md
│   └── backlog.md
├── README.md                 # Project Overview & Getting Started Guide
├── ARCHITECTURE.md           # Architectural Blueprints & Security Models
├── SUBMISSION.md             # Forge 2 Hackathon Submission Overview
└── agent-log.md              # OpenClaw Autonomous Execution Logs
```

---

## 🚀 Quick Start (Local Development)

### Prerequisites
- Docker & Docker Compose
- PHP 8.2+ and Composer (for local CLI running)
- Node.js 20+ and npm (for frontend running)

### Running with Docker Compose

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-org/pulsedesk.git
   cd pulsedesk
   ```

2. **Launch the environment:**
   ```bash
   docker-compose up -d --build
   ```

3. **Run migrations and seeders:**
   ```bash
   docker-compose exec backend php artisan migrate --seed
   ```

4. **Access the application:**
   - **Frontend App:** `http://localhost:3000`
   - **Backend API:** `http://localhost:8000/api/v1`

---

## 📋 Sprint Roadmap

PulseDesk development is orchestrated across 4 distinct sprints:
1. **Sprint 1: Foundation** - Laravel & React setup, Sanctum Auth, Organization Multi-tenancy, User Roles.
2. **Sprint 2: Ticketing** - Ticket Model, RESTful CRUD API, Public Comments, Agent Internal Notes, Filters & Search.
3. **Sprint 3: Frontend** - Modern UI/UX layout, Dashboard Metrics, Ticket Management Views, Real-time Interaction.
4. **Sprint 4: Production** - Aggregated Analytics API, SLA Timers, Event Notifications, Audit Logs, CI/CD & Docker.

---

## 🔒 Security & Tenant Isolation

PulseDesk enforces rigid organization isolation. Every database query executed for tenant resources automatically applies a global tenant scope binding queries to `auth()->user()->organization_id`. Data from Organization A is mathematically inaccessible to Organization B.

---

## 📄 License

Built exclusively for the **Forge 2 Hackathon**. All rights reserved.
