# Sprint 3: Frontend Backlog

**Goal:** Build a state-of-the-art React 19 single-page application consuming the backend API, featuring a modern dashboard, ticket tables, ticket detail workflows, and responsive UI design.  
**Deliverable:** Fully functional, interactive, and beautifully styled frontend application.

---

## 📌 Issue Breakdown

### 🔹 ISSUE-301: Frontend API Client & Auth Context Setup
- **Title:** Frontend API Client & Auth Context Setup
- **Description:** Implement an Axios HTTP client wrapper (`src/api/client.js`) managing authorization bearer tokens, error interceptors, and a global `AuthContext` managing authentication state, login/logout functions, and user context.
- **Acceptance Criteria:**
  - Auth token persists cleanly in localStorage/cookies.
  - Axios automatically attaches `Authorization: Bearer <token>` to outbound API requests.
  - 401 Unauthorized interceptor triggers logout and redirects user to login.
- **Files Likely Affected:**
  - `frontend/src/api/client.js`
  - `frontend/src/api/auth.js`
  - `frontend/src/context/AuthContext.jsx`
  - `frontend/src/routes/ProtectedRoute.jsx`
- **Dependencies:** ISSUE-102, ISSUE-105
- **Estimated Difficulty:** Medium
- **Estimated Duration:** 30 minutes

---

### 🔹 ISSUE-302: Modern Auth Pages (Login & Layout)
- **Title:** Modern Auth Pages (Login & Layout)
- **Description:** Create a sleek, modern Login page (`src/pages/Login.jsx`) utilizing vibrant gradient styling, glassmorphism card containers, responsive input validation, and connection to `AuthContext`.
- **Acceptance Criteria:**
  - Responsive authentication UI with email and password inputs.
  - Displays validation errors returned from API.
  - Redirects authenticated users directly to `/dashboard`.
- **Files Likely Affected:**
  - `frontend/src/pages/Login.jsx`
  - `frontend/src/components/common/Input.jsx`
  - `frontend/src/components/common/Button.jsx`
  - `frontend/src/layouts/AuthLayout.jsx`
- **Dependencies:** ISSUE-301
- **Estimated Difficulty:** Easy
- **Estimated Duration:** 30 minutes

---

### 🔹 ISSUE-303: Application Dashboard Core Layout & Summary Metrics
- **Title:** Application Dashboard Core Layout & Summary Metrics
- **Description:** Build the main application shell layout (`AppLayout.jsx`) with dynamic sidebar navigation, header user profile menu, and main Dashboard overview page featuring key summary cards (Total Tickets, Open Tickets, Pending SLA Breaches).
- **Acceptance Criteria:**
  - Navigation bar adapts dynamically based on user role (`Admin`, `Agent`, `Customer`).
  - Metric cards display animated numbers and clean indicator badges.
  - Mobile responsive drawer for navigation on smaller screens.
- **Files Likely Affected:**
  - `frontend/src/layouts/AppLayout.jsx`
  - `frontend/src/components/navigation/Sidebar.jsx`
  - `frontend/src/components/navigation/Navbar.jsx`
  - `frontend/src/pages/Dashboard.jsx`
  - `frontend/src/components/dashboard/MetricCard.jsx`
- **Dependencies:** ISSUE-301, ISSUE-302
- **Estimated Difficulty:** Medium
- **Estimated Duration:** 35 minutes

---

### 🔹 ISSUE-304: Interactive Ticket List View with Filtering & Search
- **Title:** Interactive Ticket List View with Filtering & Search
- **Description:** Build `TicketList.jsx` featuring a dynamic data table, status pill badges, priority flags, search bar with debounce, status/priority dropdown filters, and pagination controls.
- **Acceptance Criteria:**
  - Changing filters updates ticket list dynamically via API requests.
  - Real-time subject search filters records cleanly.
  - Row click navigates seamlessly to ticket detail page (`/tickets/:id`).
- **Files Likely Affected:**
  - `frontend/src/pages/TicketList.jsx`
  - `frontend/src/components/tickets/TicketTable.jsx`
  - `frontend/src/components/tickets/TicketFilterBar.jsx`
  - `frontend/src/api/tickets.js`
- **Dependencies:** ISSUE-205, ISSUE-206, ISSUE-301
- **Estimated Difficulty:** Medium
- **Estimated Duration:** 35 minutes

---

### 🔹 ISSUE-305: Ticket Detail View, Public Comments & Internal Notes
- **Title:** Ticket Detail View, Public Comments & Internal Notes
- **Description:** Build `TicketDetail.jsx` showing full ticket details, status update actions, agent reassignment controls, conversation thread (public comments), and a tabbed internal notes view strictly accessible by agents/admins.
- **Acceptance Criteria:**
  - Comments display author avatars, timestamps, and roles.
  - Agents can toggle between "Public Replies" and "Internal Notes".
  - Customers cannot see or access the Internal Notes tab.
- **Files Likely Affected:**
  - `frontend/src/pages/TicketDetail.jsx`
  - `frontend/src/components/tickets/CommentThread.jsx`
  - `frontend/src/components/tickets/InternalNotesTab.jsx`
  - `frontend/src/components/tickets/TicketSidebarInfo.jsx`
  - `frontend/src/api/tickets.js`
- **Dependencies:** ISSUE-202, ISSUE-203, ISSUE-204, ISSUE-301
- **Estimated Difficulty:** Complex
- **Estimated Duration:** 40 minutes

---

### 🔹 ISSUE-306: Ticket Creation Modal / Form & UI Polish
- **Title:** Ticket Creation Modal / Form & UI Polish
- **Description:** Build a modal/form (`CreateTicketModal.jsx`) allowing users to submit new tickets with subject, category, priority, and rich description. Conduct thorough cross-browser UI/UX polish across all device breakpoints.
- **Acceptance Criteria:**
  - Modal validates required fields before submission.
  - Submitting form creates ticket in API and immediately navigates to new ticket.
  - Smooth micro-animations and transitions added for premium user experience.
- **Files Likely Affected:**
  - `frontend/src/components/tickets/CreateTicketModal.jsx`
  - `frontend/src/pages/CreateTicket.jsx`
  - `frontend/src/styles/index.css`
- **Dependencies:** ISSUE-302, ISSUE-304
- **Estimated Difficulty:** Easy
- **Estimated Duration:** 30 minutes
