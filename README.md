# JobBoard 🚀

> A full-stack job board platform built with the MERN stack. Employers post jobs, candidates browse and apply.

🔗 **Live Demo:** https://mern-job-board-git-main-khushi-kandhanis-projects.vercel.app

📁 **GitHub:** https://github.com/Khushi-Kandhani/mern-job-board

---

## Features

### Employers
- ✅ Post, edit and delete job listings
- ✅ View all applicants (name + email) per job
- ✅ Dashboard with total jobs and applicant count stats

### Candidates
- ✅ Browse all jobs with search and filter
- ✅ Apply to jobs with one click
- ✅ Duplicate application prevention

### General
- ✅ JWT authentication — role-based (Employer / Candidate)
- ✅ Search by job title or company name
- ✅ Filter by job type (full-time, part-time, remote, contract, internship)
- ✅ Pagination — 9 jobs per page
- ✅ Protected routes with automatic redirect to login
- ✅ Responsive dark UI built with Tailwind CSS
- ✅ Toast notifications for all user actions

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React.js 18 + Vite + Tailwind CSS v3 |
| Backend | Node.js + Express.js |
| Database | MongoDB Atlas + Mongoose |
| Auth | JWT + bcryptjs |
| HTTP Client | Axios with request interceptors |
| Deployment | Vercel (frontend) + MongoDB Atlas (database) |

---

## Project Structure

```
mern-job-board/
└── jobfixed/
    ├── backend/
    │   ├── config/
    │   │   └── db.js                 # MongoDB connection
    │   ├── controllers/
    │   │   ├── authController.js     # Register, login, getMe
    │   │   └── jobController.js      # CRUD + apply + applicants
    │   ├── middleware/
    │   │   └── auth.js               # JWT protect middleware
    │   ├── models/
    │   │   ├── User.js               # name, email, password, role
    │   │   └── Job.js                # title, company, applications[]
    │   ├── routes/
    │   │   ├── auth.js
    │   │   └── jobs.js
    │   ├── .env.example
    │   └── server.js
    └── frontend/
        ├── src/
        │   ├── components/
        │   │   └── Navbar.jsx
        │   ├── context/
        │   │   └── AuthContext.jsx   # JWT state + localStorage
        │   ├── pages/
        │   │   ├── Home.jsx          # Browse + search + filter + pagination
        │   │   ├── JobDetail.jsx     # Single job + apply / edit / delete
        │   │   ├── Dashboard.jsx     # Stats + posted jobs management
        │   │   ├── PostJob.jsx       # Create job form
        │   │   ├── EditJob.jsx       # Edit existing job
        │   │   ├── Applicants.jsx    # Applicant list per job
        │   │   ├── Login.jsx
        │   │   └── Register.jsx
        │   └── utils/
        │       └── api.js            # Axios instance + JWT interceptor
        └── vercel.json
```

---

## Getting Started

### Prerequisites
- Node.js v18+
- Free MongoDB Atlas account — [mongodb.com/atlas](https://mongodb.com/atlas)

### 1. Clone the repo
```bash
git clone https://github.com/Khushi-Kandhani/mern-job-board.git
cd mern-job-board/jobfixed
```

### 2. Set up backend
```bash
cd backend
npm install
cp .env.example .env
# Fill in MONGO_URI and JWT_SECRET
npm run dev
# Server runs on http://localhost:5000
```

### 3. Set up frontend
```bash
cd ../frontend
npm install
npm run dev
# App runs on http://localhost:5173
```

---

## Environment Variables

Create a `.env` file in `jobfixed/backend/`:

```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/jobboard
JWT_SECRET=your_super_secret_key
JWT_EXPIRE=7d
NODE_ENV=development
```

---

## API Reference

### Auth
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | ❌ | Register new user |
| POST | `/api/auth/login` | ❌ | Login and get token |
| GET | `/api/auth/me` | ✅ | Get current user |

### Jobs
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/jobs` | ❌ | Get all jobs (search, filter, paginate) |
| GET | `/api/jobs/:id` | ❌ | Get single job |
| GET | `/api/jobs/myjobs` | ✅ | Get my posted jobs |
| GET | `/api/jobs/:id/applicants` | ✅ Owner | Get job applicants |
| POST | `/api/jobs` | ✅ | Post new job |
| PUT | `/api/jobs/:id` | ✅ Owner | Update job |
| DELETE | `/api/jobs/:id` | ✅ Owner | Delete job |
| POST | `/api/jobs/:id/apply` | ✅ | Apply to job |

---

## How It Works

**JWT Interceptor**
Axios reads the token from localStorage and automatically attaches `Authorization: Bearer <token>` to every protected API request — no manual header setting needed anywhere.

**Role-based UI**
The same app renders differently based on `user.role`. Employers see Post Job button, Dashboard with stats, and Applicants button on each job. Candidates see Apply Now button and browse-only dashboard.

**Ownership Protection**
Both frontend and backend enforce ownership. Backend verifies `job.postedBy.toString() === req.user._id.toString()` before allowing edit, delete, or viewing applicants. Frontend hides these buttons from non-owners.

**Search + Pagination**
MongoDB `$regex` query matches job title and company name case-insensitively. Results paginated server-side — backend returns `{ jobs, total, pages, currentPage }`. Frontend renders Previous/Next with disabled states.

---

## Deployment

### Frontend — Vercel
1. Import repo on [vercel.com](https://vercel.com)
2. Set Root Directory to `jobfixed/frontend`
3. Deploy — Vercel auto-detects Vite

### Backend — Any Node.js host
Set environment variables and start command:
```bash
node server.js
```

---

## Author

**Khushi Kandhani** — Full-Stack Developer

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=flat&logo=linkedin&logoColor=white)](https://linkedin.com/in/khushi-kandhani)
[![GitHub](https://img.shields.io/badge/GitHub-100000?style=flat&logo=github&logoColor=white)](https://github.com/Khushi-Kandhani)

*7th semester BSCS student at SZABIST Karachi*

---

*Built with React, Node.js, Express, MongoDB, JWT, Tailwind CSS*
