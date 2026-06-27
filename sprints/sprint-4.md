# Sprint 4: Production Backlog

**Goal:** Implement analytics aggregation APIs, SLA timer background engines, event notifications, audit trail activity logging, comprehensive CI testing pipelines, and Docker orchestration for production deployment.  
**Deliverable:** Production-ready hackathon submission build.

---

## 📌 Issue Breakdown

### 🔹 ISSUE-401: Backend Dashboard Analytics & Metric Aggregation APIs
- **Title:** Backend Dashboard Analytics & Metric Aggregation APIs
- **Description:** Implement `AnalyticsController` endpoint `GET /api/v1/analytics/overview` calculating total ticket count, tickets broken down by status/priority, average resolution time in hours, and ticket creation volume trends over time.
- **Acceptance Criteria:**
  - Aggregated metric calculations strictly adhere to multi-tenant organization boundaries.
  - Endpoint returns optimized JSON structure formatted for frontend chart rendering.
- **Files Likely Affected:**
  - `backend/app/Http/Controllers/Api/AnalyticsController.php`
  - `backend/app/Services/AnalyticsService.php`
  - `backend/routes/api.php`
- **Dependencies:** ISSUE-202
- **Estimated Difficulty:** Medium
- **Estimated Duration:** 35 minutes

---

### 🔹 ISSUE-402: Service Level Agreement (SLA) Timers & Breach Engine
- **Title:** Service Level Agreement (SLA) Timers & Breach Engine
- **Description:** Implement SLA calculation logic assigning target resolution times (`sla_due_at`) based on ticket priority. Add `sla_breached` boolean flag and build an Artisan command (`php artisan sla:check`) checking active tickets for breaches.
- **Acceptance Criteria:**
  - Tickets automatically calculate `sla_due_at` timestamp upon creation.
  - Command `php artisan sla:check` queries past-due tickets and sets `sla_breached = true`.
  - API responses return remaining SLA countdown minutes or breach indicator.
- **Files Likely Affected:**
  - `backend/database/migrations/2026_06_27_000006_add_sla_fields_to_tickets_table.php`
  - `backend/app/Services/SLAService.php`
  - `backend/app/Console/Commands/CheckSLABreaches.php`
  - `backend/app/Models/Ticket.php`
- **Dependencies:** ISSUE-201
- **Estimated Difficulty:** Medium
- **Estimated Duration:** 35 minutes

---

### 🔹 ISSUE-403: Event Notification System
- **Title:** Event Notification System
- **Description:** Build Laravel Notification classes (`TicketCreatedNotification`, `TicketAssignedNotification`, `CommentAddedNotification`) and attach event listeners to automatically notify assigned agents and customers upon ticket state changes.
- **Acceptance Criteria:**
  - Creating or updating tickets dispatches associated notifications.
  - Feature test suite verifies notifications are queued and sent accurately.
- **Files Likely Affected:**
  - `backend/app/Notifications/TicketCreatedNotification.php`
  - `backend/app/Notifications/TicketAssignedNotification.php`
  - `backend/app/Notifications/CommentAddedNotification.php`
  - `backend/app/Listeners/SendTicketNotification.php`
- **Dependencies:** ISSUE-202, ISSUE-203
- **Estimated Difficulty:** Medium
- **Estimated Duration:** 30 minutes

---

### 🔹 ISSUE-404: Audit Logging & Activity Trail API
- **Title:** Audit Logging & Activity Trail API
- **Description:** Implement an activity logging system (`activity_logs` table) recording lifecycle events on tickets (status changed, priority modified, assigned agent changed). Expose endpoint `GET /api/v1/tickets/{ticket}/activity`.
- **Acceptance Criteria:**
  - Model observers (`TicketObserver`) log user ID, action, timestamp, and json delta of modified fields.
  - Endpoint returns timeline of activities for rendering in the frontend ticket detail sidebar.
- **Files Likely Affected:**
  - `backend/database/migrations/2026_06_27_000007_create_activity_logs_table.php`
  - `backend/app/Models/ActivityLog.php`
  - `backend/app/Observers/TicketObserver.php`
  - `backend/app/Http/Controllers/Api/ActivityLogController.php`
- **Dependencies:** ISSUE-202
- **Estimated Difficulty:** Medium
- **Estimated Duration:** 35 minutes

---

### 🔹 ISSUE-405: Comprehensive Automated Testing Suite & CI/CD Pipelines
- **Title:** Comprehensive Automated Testing Suite & CI/CD Pipelines
- **Description:** Expand backend test coverage across all analytics, SLA timers, and notification listeners. Build GitHub Actions configuration (`.github/workflows/ci.yml`) to automatically run PHPUnit tests and frontend linters.
- **Acceptance Criteria:**
  - Backend feature tests achieve comprehensive coverage of all API routes and tenant security boundaries.
  - `.github/workflows/ci.yml` syntax validated and ready to execute green.
- **Files Likely Affected:**
  - `.github/workflows/ci.yml`
  - `backend/tests/Feature/AnalyticsTest.php`
  - `backend/tests/Feature/SLATest.php`
  - `frontend/src/tests/App.test.jsx`
- **Dependencies:** ISSUE-106, ISSUE-206, ISSUE-401, ISSUE-402, ISSUE-403, ISSUE-404
- **Estimated Difficulty:** Medium
- **Estimated Duration:** 35 minutes

---

### 🔹 ISSUE-406: Production Docker Orchestration & Documentation Delivery
- **Title:** Production Docker Orchestration & Documentation Delivery
- **Description:** Finalize production multi-stage Dockerfiles (`backend/Dockerfile`, `frontend/Dockerfile`) and root `docker-compose.yml`. Audit and verify all system documentation (`README.md`, `ARCHITECTURE.md`, `SUBMISSION.md`, API specs).
- **Acceptance Criteria:**
  - `docker-compose up --build` initializes backend, frontend, and database services smoothly.
  - All project documentation verified complete, aligned with Definition of Done, and ready for human hackathon submission.
- **Files Likely Affected:**
  - `docker-compose.yml`
  - `backend/Dockerfile`
  - `frontend/Dockerfile`
  - `README.md`
  - `ARCHITECTURE.md`
  - `SUBMISSION.md`
- **Dependencies:** All prior issues
- **Estimated Difficulty:** Medium
- **Estimated Duration:** 35 minutes
