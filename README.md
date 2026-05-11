# PlayStation Store Project

A full-stack digital game store built with a NestJS GraphQL API and a React/Vite frontend. The app supports public catalog browsing, authentication, user dashboards, and admin management for games, platforms, categories, DLC, editions, discounts, orders, reviews, wallets, wishlists, and user libraries.

## Tech Stack

- Backend: Node.js, NestJS, GraphQL, Apollo, TypeORM, PostgreSQL, Passport/JWT, Socket.IO.
- Frontend: React 18, TypeScript, Vite, Apollo Client, Redux Toolkit, React Router, Tailwind CSS, Socket.IO client.
- Local services: Docker Compose for PostgreSQL.

## Project Structure

```text
.
|-- backend/              # NestJS API, GraphQL resolvers, TypeORM entities
|   |-- src/
|   |-- test/
|   |-- .env.example
|   `-- docker-compose.yml
|-- frontend/             # React + Vite client
|   |-- src/
|   `-- .env.example
`-- README.md
```

Run backend and frontend commands from their own folders.

## Environment Variables

Copy the example files before running locally:

```bash
cd backend
cp .env.example .env

cd ../frontend
cp .env.example .env
```

Backend:

```env
NODE_ENV=development
PORT=3001
BACKEND_PORT=3001
CLIENT_URL=http://localhost:5173
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=playstation_store
DATABASE_SYNCHRONIZE=false
JWT_ACCESS_SECRET=replace_with_access_token_secret
JWT_REFRESH_SECRET=replace_with_refresh_token_secret
```

Frontend:

```env
VITE_API_URL=http://localhost:3001
VITE_SOCKET_URL=http://localhost:3001
VITE_ENABLE_DEV_ADMIN_SIGNUP=true
```

`VITE_SOCKET_URL` must be the backend origin only. Do not include `/api`, `/graphql`, `/games`, `/admin`, or any other path, because Socket.IO treats paths in the URL as namespaces. `VITE_API_URL` is separate and is used by HTTP/GraphQL clients.

## Local Development

Install dependencies:

```bash
cd backend
npm install

cd ../frontend
npm install
```

Start PostgreSQL:

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
- Backend origin: `http://localhost:3001`
- REST prefix: `http://localhost:3001/api`
- GraphQL endpoint: `http://localhost:3001/graphql`
- Socket.IO origin: `http://localhost:3001`

## Socket.IO Realtime

Socket.IO is initialized in `backend/src/main.ts` by attaching one Socket.IO server to Nest's underlying HTTP server with `initializeSocket(app.getHttpServer())`. The socket server in `backend/src/socket.ts` uses the default namespace `/` and CORS allows `CLIENT_URL`, falling back to `http://localhost:5173`.

The frontend creates one shared socket client in `frontend/src/services/socket.ts`. `frontend/src/app/ClientRealtimeSync.tsx` is mounted once in `App.tsx`, stays mounted across route changes, listens for realtime events, and dispatches Redux actions/thunks so global state rerenders everywhere.

Supported events:

- `client:changed` with `{ type, client }`
- `client:deleted` with `{ id }`
- `game:created` with `{ game }`
- `game:updated` with `{ game }`
- `game:deleted` with `{ id }`
- `game:priceUpdated` with `{ game }`
- `game:statusUpdated` is registered on the frontend for future game status support.

Game-affecting mutations emit after successful database writes. This includes direct game CRUD plus discount, DLC, edition, game-category, game-platform, and review changes that affect storefront game detail data.

## Manual Socket QA

1. Start PostgreSQL, backend, and frontend.
2. Open a public store tab on the home page.
3. Open a second tab on a game detail page.
4. Open a signed-in user or admin store dashboard tab.
5. Open the admin dashboard in another tab.
6. Create a game from Admin -> Games. It should appear in catalog/dashboard lists without refresh.
7. Update a game title/metadata. It should update on home, detail, dashboard, wishlist, library, and admin lists.
8. Change a game price or create/update/delete a discount. Current prices should update without refresh.
9. Delete a game. It should disappear from catalog-style lists, selected details should fall back gracefully, and wishlist/library game entries are removed where applicable.
10. Check the browser console: there should be no `Invalid namespace` socket error and no duplicate socket event spam.

## Quality Checks

Backend:

```bash
cd backend
npm run build
npm run lint
npm test
```

Frontend:

```bash
cd frontend
npm run build
```

The frontend package currently does not define lint or test scripts.
