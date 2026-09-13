# JobPortal — Full-Stack Job Portal (CodSoft Week 2)

A full-stack recruitment platform built with **React**, **Node.js/Express**, and **MongoDB**.
Job seekers can create profiles, search and apply for jobs. Recruiters can post jobs and manage applications.

## Tech Stack
- **Frontend:** React (Vite), React Router, Axios
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (Mongoose)
- **Auth:** JWT + bcrypt password hashing

## Project Structure
```
job-portal/
├── backend/
│   ├── config/db.js
│   ├── models/        (User, Job, Application)
│   ├── controllers/    (auth, job, application logic)
│   ├── routes/          (auth, job, application routes)
│   ├── middleware/auth.js   (JWT protect + role authorize)
│   ├── server.js
│   └── package.json
└── frontend/
    ├── src/
    │   ├── api/axios.js
    │   ├── context/AuthContext.jsx
    │   ├── components/ (Navbar, JobCard, ProtectedRoute)
    │   ├── pages/       (Home, JobListing, JobDetails, Login, Register,
    │   │                 JobSeekerDashboard, RecruiterDashboard, PostJob)
    │   ├── App.jsx / main.jsx / index.css
    └── package.json
```

## Setup

### 1. Backend
```bash
cd backend
cp .env.example .env      # edit MONGO_URI and JWT_SECRET
npm install
npm run dev                # starts on http://localhost:5000
```
Requires a running MongoDB instance (local `mongod` or a MongoDB Atlas URI in `.env`).

### 2. Frontend
```bash
cd frontend
cp .env.example .env      # points to the backend API
npm install
npm run dev                # starts on http://localhost:5173
```

## Features Implemented
- User registration & login (Job Seeker / Recruiter) with JWT auth, bcrypt password hashing
- Protected routes (role-based: jobseeker vs recruiter)
- Job search with keyword, location, type, and salary-range filters + pagination
- Job details page with full description, responsibilities, skills, qualifications
- Job Seeker Dashboard: profile editing, application history/status tracking
- Recruiter Dashboard: post/delete jobs, view stats, manage & update application status
- Full CRUD on Jobs (Create, Read, Update, Delete) restricted to the owning recruiter
- Applications collection linking Users ↔ Jobs with unique index (one application per user per job)

## API Overview
| Method | Endpoint | Access |
|---|---|---|
| POST | /api/auth/register | Public |
| POST | /api/auth/login | Public |
| GET/PUT | /api/auth/me | Authenticated |
| GET | /api/jobs | Public (search/filter/paginate) |
| GET | /api/jobs/:id | Public |
| POST/PUT/DELETE | /api/jobs/:id | Recruiter (owner only) |
| GET | /api/jobs/recruiter/mine | Recruiter |
| PUT | /api/jobs/:id/save | Job Seeker |
| POST | /api/applications/:jobId | Job Seeker |
| GET | /api/applications/mine | Job Seeker |
| GET | /api/applications/job/:jobId | Recruiter (owner only) |
| GET | /api/applications/recruiter/all | Recruiter |
| PUT | /api/applications/:id/status | Recruiter (owner only) |

## Notes / Next Steps (Bonus Features to extend)
- Resume file upload (currently a URL field — wire up multer + S3/Cloudinary for real uploads)
- Email notifications on application status changes
- Admin dashboard
- AI-based job recommendations
- Dark mode toggle
