# Sprint 2: Ticketing Backlog

**Goal:** Implement core support ticket data model, RESTful CRUD API endpoints, public comments, internal agent notes, filtering, and search capabilities.  
**Deliverable:** Complete working ticket system backend with rigid tenant and role authorization policies.

---

## 📌 Issue Breakdown

### 🔹 ISSUE-201: Ticket Database Schema & Eloquent Model
- **Title:** Ticket Database Schema & Eloquent Model
- **Description:** Create database migration and Eloquent model for the `tickets` table (`id`, `organization_id`, `customer_id`, `assigned_agent_id`, `ticket_number`, `subject`, `description`, `status`, `priority`, `timestamps`). Attach `BelongsToOrganization` trait and establish Eloquent relationships (`organization`, `customer`, `assignedAgent`).
- **Acceptance Criteria:**
  - Migration file created with indexes on `organization_id`, `status`, and foreign key constraints.
  - Ticket model defined with status (`open`, `in_progress`, `resolved`, `closed`) and priority (`low`, `medium`, `high`, `urgent`) constants/enums.
  - Unique auto-generated `ticket_number` sequence (e.g. `TK-1001`).
- **Files Likely Affected:**
  - `backend/database/migrations/2026_06_27_000003_create_tickets_table.php`
  - `backend/app/Models/Ticket.php`
- **Dependencies:** ISSUE-103
- **Estimated Difficulty:** Easy
- **Estimated Duration:** 25 minutes

---

### 🔹 ISSUE-202: Ticket RESTful CRUD API Implementation
- **Title:** Ticket RESTful CRUD API Implementation
- **Description:** Build `TicketController` with full RESTful CRUD routes (`index`, `store`, `show`, `update`, `destroy`). Enforce granular permissions using `TicketPolicy` (customers only view own tickets; agents/admins view all org tickets; organization boundary enforced).
- **Acceptance Criteria:**
  - Endpoints under `/api/v1/tickets` fully functional with JSON payloads.
  - Input validation implemented via `StoreTicketRequest` and `UpdateTicketRequest`.
  - Tenant A users receive 404/403 when attempting to query Tenant B ticket IDs.
- **Files Likely Affected:**
  - `backend/app/Http/Controllers/Api/TicketController.php`
  - `backend/app/Policies/TicketPolicy.php`
  - `backend/app/Http/Requests/Ticket/StoreTicketRequest.php`
  - `backend/app/Http/Requests/Ticket/UpdateTicketRequest.php`
  - `backend/routes/api.php`
- **Dependencies:** ISSUE-201, ISSUE-105
- **Estimated Difficulty:** Medium
- **Estimated Duration:** 35 minutes

---

### 🔹 ISSUE-203: Public Comments API Implementation
- **Title:** Public Comments API Implementation
- **Description:** Implement database schema (`comments` table) and API controller allowing customers and support agents to post public replies on tickets.
- **Acceptance Criteria:**
  - Migration created for `comments` table (`id`, `ticket_id`, `user_id`, `content`, `timestamps`).
  - Endpoints `GET /api/v1/tickets/{ticket}/comments` and `POST /api/v1/tickets/{ticket}/comments` active.
  - Comments automatically inherit ticket tenant context and check user permissions via `CommentPolicy`.
- **Files Likely Affected:**
  - `backend/database/migrations/2026_06_27_000004_create_comments_table.php`
  - `backend/app/Models/Comment.php`
  - `backend/app/Http/Controllers/Api/CommentController.php`
  - `backend/app/Http/Requests/Comment/StoreCommentRequest.php`
  - `backend/routes/api.php`
- **Dependencies:** ISSUE-202
- **Estimated Difficulty:** Easy
- **Estimated Duration:** 25 minutes

---

### 🔹 ISSUE-204: Agent Internal Notes API Implementation
- **Title:** Agent Internal Notes API Implementation
- **Description:** Create privileged internal notes functionality for agents and admins. Implement `internal_notes` schema and endpoints allowing support staff to add private notes on tickets that are completely hidden from customer accounts.
- **Acceptance Criteria:**
  - Migration created for `internal_notes` table (`id`, `ticket_id`, `user_id`, `body`, `timestamps`).
  - Endpoints `GET /api/v1/tickets/{ticket}/notes` and `POST /api/v1/tickets/{ticket}/notes` restricted strictly to `admin` and `agent` roles.
  - Any request by a `customer` role user to internal note routes returns 403 Forbidden.
- **Files Likely Affected:**
  - `backend/database/migrations/2026_06_27_000005_create_internal_notes_table.php`
  - `backend/app/Models/InternalNote.php`
  - `backend/app/Http/Controllers/Api/InternalNoteController.php`
  - `backend/app/Policies/InternalNotePolicy.php`
  - `backend/routes/api.php`
- **Dependencies:** ISSUE-202
- **Estimated Difficulty:** Medium
- **Estimated Duration:** 30 minutes

---

### 🔹 ISSUE-205: Ticket Filtering & Sorting API
- **Title:** Ticket Filtering & Sorting API
- **Description:** Implement advanced query parameter filtering and pagination on `GET /api/v1/tickets` (support filtering by `status`, `priority`, and `assigned_agent_id`, with configurable page sorting).
- **Acceptance Criteria:**
  - API endpoint accepts parameters like `GET /api/v1/tickets?status=open&priority=urgent&page=1`.
  - Filtered query returns paginated JSON structure with standard Laravel pagination metadata.
- **Files Likely Affected:**
  - `backend/app/Http/Controllers/Api/TicketController.php`
  - `backend/app/Services/TicketFilterService.php`
- **Dependencies:** ISSUE-202
- **Estimated Difficulty:** Easy
- **Estimated Duration:** 25 minutes

---

### 🔹 ISSUE-206: Full-Text Ticket Search & Feature Test Suite
- **Title:** Full-Text Ticket Search & Feature Test Suite
- **Description:** Add keyword search parameter `q` to `/api/v1/tickets` matching ticket subjects and descriptions. Write comprehensive automated feature tests covering all ticket CRUD, comments, internal notes, and search functionality.
- **Acceptance Criteria:**
  - `GET /api/v1/tickets?q=password` correctly matches tickets containing "password" in subject or body.
  - Feature tests (`TicketApiTest.php`, `CommentApiTest.php`) pass with 100% success rate.
- **Files Likely Affected:**
  - `backend/app/Http/Controllers/Api/TicketController.php`
  - `backend/tests/Feature/TicketApiTest.php`
  - `backend/tests/Feature/CommentApiTest.php`
- **Dependencies:** ISSUE-202, ISSUE-203, ISSUE-204, ISSUE-205
- **Estimated Difficulty:** Medium
- **Estimated Duration:** 35 minutes
