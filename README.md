# Project Management Tool (PHP + MySQL + React)

## How to run (Windows + VS Code)

### Backend (PHP + MySQL)
1. Copy `project_management/backend` into `C:/xampp/htdocs/project_management/backend` (or serve with PHP built-in).
2. Start **Apache** and **MySQL** in XAMPP.
3. Create database `project_management` in phpMyAdmin.
4. Import `backend/schema.sql` into that DB.
5. Test backend: open `http://localhost/project_management/backend/tasks.php` in a browser.

> Alternative: from `frontend` you can run `npm run server` which serves backend at `http://localhost:8000`.

### Frontend (Vite + React)
1. Open a terminal in `project_management/frontend`.
2. Install deps: `npm install`.
3. Start dev server: `npm run dev` (opens `http://localhost:5173`).

### Configure API base
Frontend uses `http://localhost/project_management/backend` as API base by default. If you serve PHP with `php -S localhost:8000 -t backend`, change `API_BASE` in the React files to `http://localhost:8000`.

## Features
- Task creation and assignment
- Team collaboration (users + task comments)
- Progress tracking (dashboard)
- Real-time updates (polling)
- Drag and Drop tasks across stages
- Activity log

## Tech
- Backend: PHP 8+, MySQL
- Frontend: React 18 (Vite), TailwindCSS, react-beautiful-dnd, Chart.js


## Added features
- Notifications endpoints and UI
- Users list UI
- Activity log UI and endpoint
