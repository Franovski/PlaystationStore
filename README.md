# PlayStation Store Project

A full-stack digital game store built with a NestJS GraphQL API and a React/Vite frontend. The app supports public catalog browsing, authentication, user dashboards, and admin management for store data such as games, platforms, categories, DLC, editions, discounts, orders, reviews, wallets, wishlists, and user libraries.

## Features

- GraphQL API with modular NestJS feature modules.
- PostgreSQL persistence through TypeORM entities and repositories.
- JWT authentication with refresh tokens, role-based admin access, optional TOTP, and optional email OTP login.
- Password reset flows using OTP or reset links.
- Public storefront catalog and game detail pages.
- Customer dashboard for wallet, wishlist, library, orders, and reviews.
- Admin dashboard for users, games, platforms, categories, and store settings.
- React Router protected routes and Redux Toolkit state management.
- Vite production build for the frontend.

## Tech Stack

- Backend: Node.js, NestJS, GraphQL, Apollo, TypeORM, PostgreSQL, Passport/JWT, Jest, ESLint, Prettier.
- Frontend: React 18, TypeScript, Vite, Apollo Client, Redux Toolkit, React Router, Axios, Tailwind CSS, Socket.IO client.
- Local services: Docker Compose for PostgreSQL.

## Project Structure

```text
.
├── backend/              # NestJS API, GraphQL resolvers, TypeORM entities, tests
│   ├── src/              # Feature modules and application bootstrap
│   ├── test/             # E2E test scaffold
│   ├── .env.example      # Backend environment template
│   └── docker-compose.yml
├── frontend/             # React + Vite client
│   ├── src/              # App routes, features, services, store, styles
│   └── .env.example      # Frontend environment template
└── README.md
```

There are no root-level npm workspaces or root scripts. Run backend and frontend commands from their own folders.

## Prerequisites

- Node.js 20 or newer recommended.
- npm.
- PostgreSQL 15+, or Docker for the included local database service.

## Environment Variables

Copy the example files before running locally:

```bash
cd backend
cp .env.example .env

cd ../frontend
cp .env.example .env
```

Backend variables:

```env
NODE_ENV=development
BACKEND_PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=playstation_store
DATABASE_SYNCHRONIZE=false
JWT_ACCESS_SECRET=replace_with_access_token_secret
JWT_REFRESH_SECRET=replace_with_refresh_token_secret
JWT_ACCESS_EXPIRATION=15m
JWT_REFRESH_EXPIRATION=7d
FRONTEND_URL=http://localhost:5173
FRONTEND_RESET_PASSWORD_URL=http://localhost:5173/reset-password
MAIL_TRANSPORT=smtp
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=mailer@example.com
SMTP_PASS=replace_with_smtp_password
MAIL_FROM=mailer@example.com
PASSWORD_RESET_MODE=otp
PASSWORD_RESET_OTP_TTL_MINUTES=10
PASSWORD_RESET_OTP_MAX_ATTEMPTS=5
PASSWORD_RESET_TOKEN_TTL_MINUTES=60
ENABLE_DEV_ADMIN_SIGNUP=true
LOGIN_EMAIL_OTP_ENABLED=false
```

Frontend variables:

```env
VITE_API_URL=http://localhost:3000/api
VITE_WEBSOCKET_URL=http://localhost:3000
VITE_ENABLE_DEV_ADMIN_SIGNUP=true
```

Keep real `.env` files local. They are intentionally ignored by Git.

## Local Development

Install dependencies:

```bash
cd backend
npm install

cd ../frontend
npm install
```

Start PostgreSQL with Docker:

```bash
cd backend
docker compose up -d db
```

Run the API:

```bash
cd backend
npm run start:dev
```

Run the frontend:

```bash
cd frontend
npm run dev
```

Default local URLs:

- Frontend: `http://localhost:5173`
- REST API prefix: `http://localhost:3000/api`
- GraphQL endpoint: `http://localhost:3000/graphql`

## Quality Checks

Backend:

```bash
cd backend
npm run build
npm run test
npm run lint
npm audit
```

Frontend:

```bash
cd frontend
npm run build
npm audit
```

The frontend package currently does not define lint or test scripts. Backend lint, backend tests, backend build, and frontend build are the current baseline checks.

## Build and Deployment

Build the backend:

```bash
cd backend
npm run build
npm run start:prod
```

Build the frontend:

```bash
cd frontend
npm run build
npm run preview
```

Production deployments should provide real database, JWT, mail, frontend URL, and CORS configuration through environment variables. Do not commit secrets.

## Contribution Notes

- Keep source, configuration, docs, tests, and example env files committed.
- Do not commit `node_modules`, `dist`, logs, local `.env` files, editor folders, or local database files.
- Prefer focused changes and run the relevant build/test command before opening a pull request.
- Add tests when changing shared backend behavior, authentication, orders, payments/wallets, or admin mutations.
