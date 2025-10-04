# Expense Management Frontend (React + Tailwind)

This is a frontend-only skeleton for an Expense Management System with three dashboards: Employee, Manager, and Admin. It uses React + Vite + TailwindCSS. No backend integration — the app uses dummy JSON and in-memory state.

Quick start

1. cd into `frontend`
2. npm install
3. npm run dev

Project structure

/frontend
  /src
    /components - shared UI components (Sidebar, Table, Modal, StatCard)
    /pages - admin, manager, employee dashboards
    /layouts - main layout with sidebar
    App.jsx - routes and top nav
    index.js - entry

Notes

- The UI contains Add Expense modal (employee) and Approve/Reject actions (manager/admin).
- Replace dummy data and wire API calls later where indicated.

Integration Hints

- Replace the dummy arrays in `src/pages/*/*Dashboard.jsx` with data fetched from your API.
- Lift state to a central store (Context/Redux) when connecting endpoints so all dashboards reflect live changes.
- Approve/Reject buttons currently update local state; replace handlers with API calls and optimistic updates.
- Add authentication and role-based routing when integrating the backend.

If you want, I can now:
- Add Context and example services for API wiring (fetch adapters)
- Add unit tests for components
- Add prettier/eslint config
