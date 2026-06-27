# PulseDesk REST API Specification

**Base URL:** `/api/v1`  
**Authentication:** HTTP Bearer Token (`Authorization: Bearer <sanctum_token>`)  
**Format:** `application/json`

---

## 🔐 1. Authentication Endpoints

### `POST /auth/login`
Authenticates a user and returns an API token.
- **Request Body:**
  ```json
  {
    "email": "agent@acme.com",
    "password": "secretpassword"
  }
  ```
- **Response (200 OK):**
  ```json
  {
    "token": "1|sanctum_token_string...",
    "user": {
      "id": 1,
      "name": "Alex Agent",
      "email": "agent@acme.com",
      "role": "agent",
      "organization": {
        "id": 10,
        "name": "Acme Corp",
        "slug": "acme-corp"
      }
    }
  }
  ```

### `GET /auth/me`
Returns current authenticated user and organization scope context.

---

## 🎫 2. Ticket Endpoints

### `GET /tickets`
Returns paginated list of tickets for the user's organization.
- **Query Parameters:** `status`, `priority`, `assigned_agent_id`, `q` (search query), `page`
- **Response (200 OK):** Paginated collection of ticket models.

### `POST /tickets`
Creates a new support ticket.
- **Request Body:**
  ```json
  {
    "subject": "Unable to access billing invoice PDF",
    "description": "When clicking download invoice, server returns 500 error.",
    "priority": "high"
  }
  ```

### `GET /tickets/{id}`
Retrieves full details of a specific ticket.

### `PUT /tickets/{id}`
Updates ticket properties (status, assignment, priority).

---

## 💬 3. Comments & Internal Notes

### `GET /tickets/{id}/comments`
Retrieves public discussion thread.

### `POST /tickets/{id}/comments`
Posts a public reply.

### `GET /tickets/{id}/notes`
*(Agents & Admins Only)* Retrieves private internal team notes.

### `POST /tickets/{id}/notes`
*(Agents & Admins Only)* Creates a private internal note.

---

## 📊 4. Analytics & Activity

### `GET /analytics/overview`
*(Admins & Agents Only)* Returns aggregated tenant support metrics.

### `GET /tickets/{id}/activity`
Returns audit log timeline of state transitions for a ticket.
