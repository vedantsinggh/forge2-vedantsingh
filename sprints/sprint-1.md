# Sprint 1: Foundation Backlog

**Goal:** Establish backend framework, frontend structure, database schema, multi-tenant organization isolation, and Sanctum authentication.  
**Deliverable:** Working user authentication and basic organization isolation scaffolding.

---

## 📌 Issue Breakdown

### 🔹 ISSUE-101: Laravel 11 Backend Core Setup & Configuration
- **Title:** Laravel 11 Backend Core Setup & Configuration
- **Description:** Initialize the Laravel 11 framework in the `backend/` directory with PHP 8.2+ compatibility. Configure basic `.env.example`, database configuration for MySQL 8, CORS headers, and standard API JSON response formatting.
- **Acceptance Criteria:**
  - Laravel 11 repository structure created inside `backend/`.
  - `php artisan` CLI operates without errors.
  - `.env.example` includes database credentials, app keys, and Sanctum configurations.
  - Basic `/api/v1/health` status route implemented returning `{"status": "ok"}`.
- **Files Likely Affected:**
  - `backend/composer.json`
  - `backend/.env.example`
  - `backend/config/database.php`
  - `backend/config/cors.php`
  - `backend/routes/api.php`
- **Dependencies:** None
- **Estimated Difficulty:** Easy
- **Estimated Duration:** 25 minutes

---

### 🔹 ISSUE-102: React 19 + Vite + TailwindCSS Frontend Setup
- **Title:** React 19 + Vite + TailwindCSS Frontend Setup
- **Description:** Initialize a modern React 19 frontend in `frontend/` using Vite. Configure TailwindCSS, core CSS styling system, and establish standard folder structure (`src/api`, `src/components`, `src/pages`, `src/layouts`, `src/hooks`, `src/context`, `src/utils`, `src/routes`, `src/styles`).
- **Acceptance Criteria:**
  - React 19 application bootstrapped with Vite in `frontend/`.
  - TailwindCSS configured and verified with custom utility classes.
  - All directory paths scaffolded cleanly.
  - `npm run dev` starts the application without warnings or errors.
- **Files Likely Affected:**
  - `frontend/package.json`
  - `frontend/vite.config.js`
  - `frontend/tailwind.config.js`
  - `frontend/src/index.css`
  - `frontend/src/App.jsx`
  - `frontend/.env.example`
- **Dependencies:** None
- **Estimated Difficulty:** Easy
- **Estimated Duration:** 25 minutes

---

### 🔹 ISSUE-103: Database Migrations for Organizations and Users
- **Title:** Database Migrations for Organizations and Users
- **Description:** Create database schema migrations for the `organizations` table (`id`, `name`, `slug`, `domain`, `timestamps`) and extend the default `users` table to include `organization_id` foreign key and `role` column (`admin`, `agent`, `customer`).
- **Acceptance Criteria:**
  - Migration files created in `backend/database/migrations/`.
  - Foreign key constraint established linking `users.organization_id` to `organizations.id` (with indexed lookups).
  - `php artisan migrate` executes cleanly and builds exact schema tables.
- **Files Likely Affected:**
  - `backend/database/migrations/2026_06_27_000001_create_organizations_table.php`
  - `backend/database/migrations/2026_06_27_000002_add_organization_and_role_to_users_table.php`
  - `backend/app/Models/Organization.php`
  - `backend/app/Models/User.php`
- **Dependencies:** ISSUE-101
- **Estimated Difficulty:** Easy
- **Estimated Duration:** 20 minutes

---

### 🔹 ISSUE-104: User Roles and Multi-Tenant Eloquent Scopes/Policies
- **Title:** User Roles and Multi-Tenant Eloquent Scopes & Policies
- **Description:** Implement role helper methods on the User model (`isAdmin()`, `isAgent()`, `isCustomer()`). Implement a reusable `BelongsToOrganization` trait and global `TenantScope` ensuring all Eloquent queries are scoped to `auth()->user()->organization_id`. Create initial `OrganizationPolicy`.
- **Acceptance Criteria:**
  - `BelongsToOrganization` trait created and ready to attach to models.
  - `TenantScope` automatically appends `WHERE organization_id = ?` when authenticated.
  - Policy methods prohibit users from accessing resources outside their assigned organization.
- **Files Likely Affected:**
  - `backend/app/Models/User.php`
  - `backend/app/Models/Scopes/TenantScope.php`
  - `backend/app/Traits/BelongsToOrganization.php`
  - `backend/app/Policies/OrganizationPolicy.php`
- **Dependencies:** ISSUE-103
- **Estimated Difficulty:** Medium
- **Estimated Duration:** 30 minutes

---

### 🔹 ISSUE-105: Sanctum Authentication API Integration
- **Title:** Sanctum Authentication API Integration
- **Description:** Configure Laravel Sanctum for API token management. Implement `AuthController` with endpoints: `POST /api/v1/auth/login`, `POST /api/v1/auth/register`, `POST /api/v1/auth/logout`, and `GET /api/v1/auth/me`.
- **Acceptance Criteria:**
  - Users can authenticate with email/password and receive an API bearer token.
  - `GET /api/v1/auth/me` returns authenticated user profile alongside tenant details.
  - Requests without valid bearer token return HTTP 401 Unauthorized.
- **Files Likely Affected:**
  - `backend/app/Http/Controllers/Api/AuthController.php`
  - `backend/routes/api.php`
  - `backend/app/Http/Requests/Auth/LoginRequest.php`
  - `backend/app/Http/Requests/Auth/RegisterRequest.php`
- **Dependencies:** ISSUE-101, ISSUE-104
- **Estimated Difficulty:** Medium
- **Estimated Duration:** 35 minutes

---

### 🔹 ISSUE-106: Database Seeders & Base Test Suite Setup
- **Title:** Database Seeders & Base Test Suite Setup
- **Description:** Create database seeders (`DatabaseSeeder`, `OrganizationSeeder`, `UserSeeder`) populating demo tenant organizations ("Acme Corp", "Starlight Inc") with test users for each role. Build automated feature tests validating authentication and multi-tenant isolation.
- **Acceptance Criteria:**
  - `php artisan db:seed` runs cleanly and populates demo tenants and accounts.
  - Automated tests in `tests/Feature/AuthTest.php` and `tests/Feature/TenantIsolationTest.php` pass with 100% success.
- **Files Likely Affected:**
  - `backend/database/seeders/DatabaseSeeder.php`
  - `backend/database/seeders/OrganizationSeeder.php`
  - `backend/database/seeders/UserSeeder.php`
  - `backend/tests/Feature/AuthTest.php`
  - `backend/tests/Feature/TenantIsolationTest.php`
- **Dependencies:** ISSUE-103, ISSUE-105
- **Estimated Difficulty:** Easy
- **Estimated Duration:** 30 minutes
