# 🛡️ Hermes Master Plan: Forge 2 PulseDesk Specification

Greetings! I am **Hermes** — Product Owner, Scrum Master, and Orchestrator for the **PulseDesk** project built for the Forge 2 Hackathon.

As orchestrator, I have analyzed all requirements, established the system architecture, designed the tenant isolation security model, structured the four-sprint strategy, decomposed all work into **24 bite-sized, independent OpenClaw tasks**, and set up all repository files and tracking artifacts.

---

## 🏗️ 1. Core Architecture & Stack Summary

- **Backend:** Laravel 11 (PHP 8.2+), MySQL 8, Laravel Sanctum API Tokens, REST API architecture.
- **Frontend:** React 19, Vite, TailwindCSS (vibrant, modern glassmorphism design system).
- **Tenant Isolation:** Single-database multi-tenancy with global Eloquent tenant scoping (`BelongsToOrganization` & `TenantScope`) enforcing complete mathematical query separation.
- **Role Permissions:** `Admin`, `Agent`, and `Customer` roles controlled by granular Laravel Authorization Policies (`TicketPolicy`, `InternalNotePolicy`, `CommentPolicy`).

---

## 🗓️ 2. Sprint Breakdown Matrix

| Sprint | Phase Name | Issues | Est. Duration | Core Deliverables |
| :---: | :--- | :---: | :---: | :--- |
| **Sprint 1** | **Foundation** | 6 | ~2.75 Hours | Backend/Frontend setup, Sanctum auth, Organization model & Tenant Scope. |
| **Sprint 2** | **Ticketing** | 6 | ~2.9 Hours | Ticket CRUD API, public comments, agent internal notes, filtering & search. |
| **Sprint 3** | **Frontend** | 6 | ~3.3 Hours | React 19 UI, Dashboard metrics, Ticket list/detail views & responsive polish. |
| **Sprint 4** | **Production** | 6 | ~3.4 Hours | Aggregated analytics, SLA breach engine, event notifications, activity logs & Docker. |

---

## 📋 3. Issue Queue for OpenClaw Autonomous Execution

Every issue has been written into `/pulsedesk/sprints/` adhering strictly to your mandatory schema (**Title**, **Description**, **Acceptance Criteria**, **Files likely affected**, **Dependencies**, **Estimated difficulty**, **Estimated duration**).

### 🚀 Sprint 1: Foundation
1. **`ISSUE-101`**: Laravel 11 Backend Core Setup & Configuration (25m)
2. **`ISSUE-102`**: React 19 + Vite + TailwindCSS Frontend Setup (25m)
3. **`ISSUE-103`**: Database Migrations for Organizations and Users (20m)
4. **`ISSUE-104`**: User Roles and Multi-Tenant Eloquent Scopes & Policies (30m)
5. **`ISSUE-105`**: Sanctum Authentication API Integration (35m)
6. **`ISSUE-106`**: Database Seeders & Base Test Suite Setup (30m)

### 🎟️ Sprint 2: Ticketing
7. **`ISSUE-201`**: Ticket Database Schema & Eloquent Model (25m)
8. **`ISSUE-202`**: Ticket RESTful CRUD API Implementation (35m)
9. **`ISSUE-203`**: Public Comments API Implementation (25m)
10. **`ISSUE-204`**: Agent Internal Notes API Implementation (30m)
11. **`ISSUE-205`**: Ticket Filtering & Sorting API (25m)
12. **`ISSUE-206`**: Full-Text Ticket Search & Feature Test Suite (35m)

### 💻 Sprint 3: Frontend
13. **`ISSUE-301`**: Frontend API Client & Auth Context Setup (30m)
14. **`ISSUE-302`**: Modern Auth Pages (Login & Layout) (30m)
15. **`ISSUE-303`**: Application Dashboard Core Layout & Summary Metrics (35m)
16. **`ISSUE-304`**: Interactive Ticket List View with Filtering & Search (35m)
17. **`ISSUE-305`**: Ticket Detail View, Public Comments & Internal Notes (40m)
18. **`ISSUE-306`**: Ticket Creation Modal / Form & UI Polish (30m)

### ⚡ Sprint 4: Production
19. **`ISSUE-401`**: Backend Dashboard Analytics & Metric Aggregation APIs (35m)
20. **`ISSUE-402`**: Service Level Agreement (SLA) Timers & Breach Engine (35m)
21. **`ISSUE-403`**: Event Notification System (30m)
22. **`ISSUE-404`**: Audit Logging & Activity Trail API (35m)
23. **`ISSUE-405`**: Comprehensive Automated Testing Suite & CI/CD Pipelines (35m)
24. **`ISSUE-406`**: Production Docker Orchestration & Documentation Delivery (35m)

---

## 📂 4. Created Project Files

The following repository structure has been established in `pulsedesk/`:
- `README.md` - Comprehensive project guide & quick-start setup.
- `ARCHITECTURE.md` - Complete architectural blueprint, security isolation models & ERD details.
- `SUBMISSION.md` - Hackathon verification checklist and Definition of Done evaluation.
- `agent-log.md` - OpenClaw execution tracker & report template.
- `sprints/backlog.md` - Master sprint backlog index.
- `sprints/sprint-1.md` through `sprint-4.md` - Granular task specifications.
- `docs/api-specification.md` - Complete REST API payload contracts.

---

## 🚦 Next Steps & OpenClaw Orchestration Directive
The project plan and issue queue are finalized and prepared for execution. OpenClaw is ready to begin dispatching tasks starting with **`ISSUE-101`**.

**Awaiting human approval to launch OpenClaw execution on Sprint 1!**
