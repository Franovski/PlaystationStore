# 🎮 PlayStation Store

## 📌 Overview

The PlayStation Store project is a full-stack e-commerce web application designed to replicate the core functionalities of a modern digital gaming storefront. 

It provides a robust platform for managing digital game catalogs, handling complex relationships between games, categories, and console platforms, and delivering a secure, consumer-facing storefront alongside a comprehensive administrative backend.

Key features include:
* Full user authentication with robust session management (JWT) and Two-Factor Authentication (TOTP).
* Dual-mode forgot password resets (OTP code or Magic Link).
* Comprehensive catalog management with granular categorizations and platform assignments.
* Role-based access control (RBAC) securing administrative dashboards versus standard user interfaces.

---

## 🏗️ Architecture

* **Backend Framework:** NestJS (Node.js) built with strict TypeScript and a modular, service-oriented architecture separating controllers, services, and DTOs.
* **Database:** PostgreSQL managed via TypeORM, utilizing strict entity relationship mapping.
* **Frontend Framework:** React with TypeScript, bundled via Vite.
* **Styling:** Tailwind CSS combined with PostCSS for rapid, responsive UI development.
* **Communication:** RESTful API endpoints exchanging JSON payloads, mapped under the `/api/` routing prefix.
* **State Management:** Redux Toolkit utilized extensively on the frontend for global auth and UI state handling.

---

## 🚀 Features

### 🔐 Authentication & Security
* User registration and secured login (Bcrypt password hashing).
* JWT-based authentication (Access and Refresh token cycle).
* Optional TOTP (Time-based One-Time Password) Two-Factor Authentication.
* Configurable Password Reset workflows (Email Magic Links vs. Email OTP codes).
* Protected routing via NestJS Auth Guards (Backend) and React Router wrappers (Frontend).

### 🎮 Game Management
* Complete CRUD operations for games.
* Detailed game entities containing pricing, descriptions, and metadata.
* Real-time validation checks for duplication and attribute constraints.

### 🗂️ Categories & Platforms
* Dynamic Category management (e.g., RPG, Action, FPS).
* Platform configurations restricted to targeted hardware constraints (e.g., PS4, PS5).
* Many-to-Many associations mapping a single game to multiple platforms and categories.

### 🛠️ Admin Dashboard
* Elevated dashboard restricted to users with the `admin` role.
* Overview summary generating platform-wide metrics and stats.
* Dedicated interfaces for managing user accounts, editing game details, and purging records.

---

## 🧱 Database Design

The database schema relies on strict relational ties mapped by TypeORM:

* **User:** Stores profile details, roles (`admin` | `playstation_user`), password hashes, and security tokens (Refresh tokens, OTP secrets, reset constraints).
* **Game:** Stores core catalog details.
* **Platform:** Defines console environments.
* **Category:** Defines genres or functional groups.
* **GamePlatform (Join Table):** Maps games to compatible platforms (Many-to-Many).
* **GameCategory (Join Table):** Maps games to associated genres (Many-to-Many).

---

## 🔑 API Endpoints

### Auth
* `POST /api/auth/register` - Create a new user account
* `POST /api/auth/login` - Authenticate and retrieve JWT
* `POST /api/auth/refresh` - Refresh access token
* `POST /api/auth/forgot-password` - Request a password reset
* `POST /api/auth/reset-password` - Submit reset token/OTP with new password
* `POST /api/auth/totp/verify` - Verify 2FA code during login

### Games
* `GET /api/games` - Retrieve all games
* `POST /api/games` - Create a new game (Admin)
* `GET /api/games/:id` - Fetch game details
* `PUT /api/games/:id` - Update game metadata (Admin)

### Categories & Platforms
* `GET /api/categories` - List all active categories
* `POST /api/platforms` - Define a new platform
* `POST /api/game-categories` - Associate a game with a category
* `DELETE /api/game-platforms/game/:gameId/platform/:platformId` - Sever game-platform relation

### Admin
* `GET /api/admin/dashboard/summary` - Fetch platform-wide analytical metrics
* `GET /api/admin/users` - Fetch total user list
* `PATCH /api/admin/games/:id` - Perform partial game updates

---

## 🖥️ Frontend

* **Structure:** Component-based architecture utilizing React functional components and hooks. Organized into `pages`, `features` (Redux slices), `api` (Axios interceptors), and `services`.
* **Routing:** Handled via `react-router-dom`. Routes are deeply nested and protected via `ProtectedRoute` and `AdminRoute` guard components.
* **State Management:** Redux Toolkit handles centralized data (e.g., `authSlice` captures `isAuthenticated`, `user`, loading states, and active 2FA requirements).
* **Dashboard Capabilities:** Admins have exclusive access to data-tables rendering users and game inventories with direct inline-action capabilities.

---

## ⚙️ Installation & Setup

### Backend

1. Clone the repository and navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `backend` directory (see [Environment Variables](#-environment-variables) below) and set up your local PostgreSQL database to match those credentials.
4. Run the development server:
   ```bash
   npm run start:dev
   ```

### Frontend

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development application:
   ```bash
   npm run dev
   ```

---

## 🔐 Environment Variables

Create `.env` files in their respective directories.

**Backend `.env`:**
* `DB_HOST`
* `DB_PORT`
* `DB_USERNAME`
* `DB_PASSWORD`
* `DB_DATABASE`
* `JWT_ACCESS_SECRET`
* `JWT_REFRESH_SECRET`
* `PASSWORD_RESET_MODE` (Set to `otp` or `link`)
* Mail configuration variables (SMTP settings)

**Frontend `.env`:**
* `VITE_API_BASE_URL` (e.g., `http://localhost:3000/api`)

---

## 🔄 Application Flow

* **Authentication Flow:** Users register and authenticate. Upon login, the backend validates credentials. If TOTP is enabled, login halts and requests an OTP code. Upon success, an HTTP-only/secure pair of access and refresh tokens are distributed and synced into global Redux state.
* **Forgot Password Flow:** A user triggers forgot password. Based on configuration (`PASSWORD_RESET_MODE`), the NestJS MailService dispatches either an OTP code or a Magic Link email. The frontend navigates to the Reset Password interface where the payload (`email`, `token`/`OTP`, and `newPassword`) is validated and submitted.
* **Admin Operations:** Admin accounts bypass standard UI views into a dedicated dashboard layout, unlocking endpoints dynamically to mutate the main store catalog and audit user metrics.

---

## 🧪 Testing

Jest is configured for both unit and end-to-end (e2e) tests on the backend.

To execute backend e2e tests:
```bash
cd backend
npm run test:e2e
```
To execute standard unit tests:
```bash
npm run test
```

---

## 📌 Notes

* App configurations strictly separate Admin roles (`admin`) from Standard roles (`playstation_user`).
* Platform support defaults map primarily towards constraints like `PS4` and `PS5`.
* Sockets are provisioned globally on the frontend (`socketService.ts`), requiring a properly hooked backend event gateway for real-time operations.

---

## 👨‍💻 Author

Developed for advanced full-stack integration and REST architecture demonstration.