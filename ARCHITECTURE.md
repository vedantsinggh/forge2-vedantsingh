# PulseDesk System Architecture Specification

## 1. Executive Overview
PulseDesk is a modern, enterprise-grade multi-tenant support desk application engineered for high availability, security, and developer productivity. It follows a decoupled API-first architecture where a Laravel 11 backend powers a high-performance React 19 single-page application.

---

## 2. System Architecture Blueprint

```
+-----------------------------------------------------------------------------------+
|                                 React 19 Frontend                                 |
|  +-------------------+   +--------------------+   +----------------------------+  |
|  | Context & Routing |   | Modern Dashboard   |   | Ticket List & Detail Views |  |
|  +-------------------+   +--------------------+   +----------------------------+  |
+-----------------------------------------+-----------------------------------------+
                                          | JSON REST API over HTTPS (Bearer Token)
                                          v
+-----------------------------------------------------------------------------------+
|                                Laravel 11 API Backend                             |
|  +------------------+   +----------------------+   +---------------------------+  |
|  | Sanctum Auth     |   | Role & Policy Engine |   | Tenant Scope Isolation    |  |
|  +------------------+   +----------------------+   +---------------------------+  |
|  | Ticket Service   |   | SLA Engine           |   | Audit Activity Logger     |  |
|  +------------------+   +----------------------+   +---------------------------+  |
+-----------------------------------------+-----------------------------------------+
                                          | Eloquent ORM
                                          v
+-----------------------------------------------------------------------------------+
|                                MySQL 8 Database                                   |
|  [organizations]  <--  [users]  <--  [tickets]  <--  [comments / internal_notes]  |
+-----------------------------------------------------------------------------------+
```

---

## 3. Core Principles & Architecture Decisions

### 3.1 Strict Tenant Isolation
- **Approach:** Shared Database, Single Schema with Tenant Scoping (`organization_id`).
- **Implementation:** All tenant-owned models implement `BelongsToOrganization` trait, applying an automatic global scope (`TenantScope`).
- **Security Guarantee:** Raw SQL queries and Eloquent builders always inject `WHERE organization_id = ?`. Organization cross-talk is impossible.

### 3.2 Role-Based Access Control (RBAC)
- **Roles:**
  - `Admin`: Full organization access, user management, configuration, analytics.
  - `Agent`: Can view all org tickets, update status/assignment, write public comments, write internal notes.
  - `Customer`: Can create tickets, view own created tickets, reply to public comments. Cannot see internal notes or agent workflows.
- **Enforcement:** Laravel Policies (`TicketPolicy`, `InternalNotePolicy`, `CommentPolicy`) combined with standard Sanctum authentication.

### 3.3 Event-Driven Architecture & SLA Engine
- Ticket state changes trigger Laravel Events (`TicketCreated`, `TicketStatusUpdated`, `CommentAdded`).
- Background SLA service computes target response times based on priority (`Low`: 24h, `Medium`: 8h, `High`: 4h, `Urgent`: 1h) and flags breaches via automated Artisan tasks.

---

## 4. Database Schema Specification

### Entity Relationship Diagram (Conceptual)
- **`organizations`**: `id`, `name`, `slug`, `created_at`, `updated_at`
- **`users`**: `id`, `organization_id` (FK), `name`, `email`, `password`, `role` (enum), `created_at`, `updated_at`
- **`tickets`**: `id`, `organization_id` (FK), `customer_id` (FK users), `assigned_agent_id` (FK users, nullable), `ticket_number` (string), `subject`, `description` (text), `status` (enum: open, in_progress, resolved, closed), `priority` (enum: low, medium, high, urgent), `sla_due_at` (timestamp), `sla_breached` (boolean), `created_at`, `updated_at`
- **`comments`**: `id`, `ticket_id` (FK), `user_id` (FK), `content` (text), `created_at`, `updated_at`
- **`internal_notes`**: `id`, `ticket_id` (FK), `user_id` (FK), `body` (text), `created_at`, `updated_at`
- **`activity_logs`**: `id`, `organization_id` (FK), `ticket_id` (FK), `user_id` (FK), `action` (string), `changes` (json), `created_at`

---

## 5. Deployment & Containerization Design

```dockerfile
# Multi-stage Docker setup ensuring minimal production image footprint
# Backend Dockerfile runs PHP 8.2-fpm + Nginx + Composer autoloader
# Frontend Dockerfile builds React via Vite and serves assets with Nginx
```

- **Docker Compose Topology:**
  - `pulsedesk-frontend`: Nginx Reverse Proxy & React SPA static server on Port 80
  - `pulsedesk-backend`: PHP 8.2-FPM Laravel API backend service (Internal Port 9000)
  - `pulsedesk-db`: MySQL 8.0 Database container with persistent named volume (Internal Port 3306)
