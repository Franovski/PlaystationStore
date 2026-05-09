# Frontend Migration Plan

This refactor keeps the React + TypeScript + Vite app behavior intact while reshaping the frontend toward the DRS feature flow.

1. Move app bootstrap and route definitions into `src/app`.
2. Split the existing layout into shared layout components under `src/components/layout`.
3. Move auth, games, admin, and dashboard pages/services into feature folders.
4. Keep shared API clients, socket, tokens, styles, and global types in shared folders.
5. Move shared server-backed state into Redux Toolkit slices while keeping local form/modal state in components.
6. Update imports, remove obsolete old files after references are gone, then run install/build/lint checks.
