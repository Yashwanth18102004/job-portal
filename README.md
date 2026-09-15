# 💼 JobPortal — Full-Stack Job Portal & Recruitment Management System

A full-stack recruitment platform where **job seekers** can create profiles, search, and apply for jobs, and **recruiters** can post jobs and manage applications — built with **React**, **Node.js/Express**, and **MongoDB** as part of the CodSoft Full-Stack Web Development internship (Week 2).

![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-000000?style=flat&logo=express&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=flat&logo=react&logoColor=black)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat&logo=mongodb&logoColor=white)
![JWT](https://img.shields.io/badge/Auth-JWT-black?style=flat&logo=jsonwebtokens)
![Render](https://img.shields.io/badge/Deployed%20on-Render-46E3B7?style=flat&logo=render&logoColor=white)

---

## 🚀 Live Demo

| | |
|---|---|
| 🌐 **Frontend (try it live)** | [job-portal-frontend-3h9f.onrender.com](https://job-portal-frontend-3h9f.onrender.com) |
| ⚙️ **Backend API** | [job-portal-backend-j7pl.onrender.com](https://job-portal-backend-j7pl.onrender.com) |
| 💻 **GitHub Repository** | [github.com/Yashwanth18102004/job-portal](https://github.com/Yashwanth18102004/job-portal) |

> ⏳ Both services run on Render's free tier, so they may "sleep" after 15 minutes of inactivity. The first request afterward can take 20–30 seconds to wake up — this is normal.

---

## 📑 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started (Local Setup)](#-getting-started-local-setup)
- [Environment Variables](#-environment-variables)
- [API Reference](#-api-reference)
- [Deployment](#-deployment)
- [Usage Walkthrough](#-usage-walkthrough)
- [Roadmap / Bonus Features](#-roadmap--bonus-features)
- [Author](#-author)

---

## ✨ Features

**For Job Seekers**
- ✅ Register and log in securely (JWT-based auth)
- ✅ Build a profile with skills and resume link
- ✅ Search and filter jobs by keyword, location, type, and salary range
- ✅ View full job details (description, responsibilities, skills, qualifications)
- ✅ Apply to jobs with one click
- ✅ Track application status (Applied → Shortlisted → Hired/Rejected) on a personal dashboard

**For Recruiters**
- ✅ Register and log in with a company profile
- ✅ Post, edit, and delete job listings
- ✅ View dashboard stats (total jobs, applications, shortlisted, hired)
- ✅ Review and manage applications per job
- ✅ Update applicant status directly from the dashboard

**General**
- 🔒 Role-based protected routes (Job Seeker vs Recruiter)
- 🔐 Password hashing with bcrypt
- 📱 Responsive design — works on desktop, tablet, and mobile
- 🌍 Fully deployed and publicly accessible

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React.js (Vite), React Router, Axios |
| Backend | Node.js, Express.js |
| Database | MongoDB (Mongoose ODM), hosted on MongoDB Atlas |
| Auth | JSON Web Tokens (JWT) + bcrypt |
| Deployment | Render (Web Service for backend, Static Site for frontend) |

---

## 📁 Project Structure

```
job-portal/
├── backend/
│   ├── config/
│   │   └── db.js                  # MongoDB connection
│   ├── models/                    # Mongoose schemas
│   │   ├── User.js
│   │   ├── Job.js
│   │   └── Application.js
│   ├── controllers/               # Business logic
│   │   ├── authController.js
│   │   ├── jobController.js
│   │   └── applicationController.js
│   ├── routes/                    # Express routes
│   │   ├── authRoutes.js
│   │   ├── jobRoutes.js
│   │   └── applicationRoutes.js
│   ├── middleware/
│   │   └── auth.js                # JWT protect + role authorize
│   ├── server.js                  # App entry point
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── api/
    │   │   └── axios.js           # Axios instance with token interceptor
    │   ├── context/
    │   │   └── AuthContext.jsx    # Global auth state
    │   ├── components/
    │   │   ├── Navbar.jsx
    │   │   ├── JobCard.jsx
    │   │   └── ProtectedRoute.jsx
    │   ├── pages/
    │   │   ├── Home.jsx
    │   │   ├── JobListing.jsx
    │   │   ├── JobDetails.jsx
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   ├── JobSeekerDashboard.jsx
    │   │   ├── RecruiterDashboard.jsx
    │   │   └── PostJob.jsx
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    └── package.json
```

---

## 🏁 Getting Started (Local Setup)

### Prerequisites
- [Node.js](https://nodejs.org/) (LTS version)
- A [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register) account (or a local MongoDB instance)

### 1. Clone the repository
```bash
git clone https://github.com/Yashwanth18102004/job-portal.git
cd job-portal
```

### 2. Backend setup
```bash
cd backend
cp .env.example .env      # fill in MONGO_URI and JWT_SECRET
npm install
npm run dev                # starts on http://localhost:5000
```

### 3. Frontend setup
```bash
cd frontend
cp .env.example .env      # points to the backend API
npm install
npm run dev                # starts on http://localhost:5173
```

### 4. Open the app
Visit **http://localhost:5173** in your browser.

---

## 🔑 Environment Variables

**backend/.env**
```env
PORT=5000
MONGO_URI=<your MongoDB Atlas connection string>
JWT_SECRET=<a long random string>
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```

**frontend/.env**
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

---

## 📡 API Reference

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/auth/register` | Public | Register a new user |
| POST | `/api/auth/login` | Public | Log in |
| GET | `/api/auth/me` | Authenticated | Get current user profile |
| PUT | `/api/auth/me` | Authenticated | Update current user profile |
| GET | `/api/jobs` | Public | List jobs (search/filter/paginate) |
| GET | `/api/jobs/:id` | Public | Get a single job |
| POST | `/api/jobs` | Recruiter | Create a job |
| PUT | `/api/jobs/:id` | Recruiter (owner) | Update a job |
| DELETE | `/api/jobs/:id` | Recruiter (owner) | Delete a job |
| GET | `/api/jobs/recruiter/mine` | Recruiter | Get jobs posted by current recruiter |
| PUT | `/api/jobs/:id/save` | Job Seeker | Save/unsave a job |
| POST | `/api/applications/:jobId` | Job Seeker | Apply to a job |
| GET | `/api/applications/mine` | Job Seeker | Get my applications |
| GET | `/api/applications/job/:jobId` | Recruiter (owner) | Get applications for a job |
| GET | `/api/applications/recruiter/all` | Recruiter | Get all applications across my jobs |
| PUT | `/api/applications/:id/status` | Recruiter (owner) | Update application status |

---

## ☁️ Deployment

Deployed on **[Render](https://render.com)**:

| Service | Type | Root Directory | Build Command | Start/Publish |
|---|---|---|---|---|
| `job-portal-backend` | Web Service | `backend` | `npm install` | `node server.js` |
| `job-portal-frontend` | Static Site | `frontend` | `npm run build` | `dist` |

**Backend environment variables (set on Render):** `PORT`, `MONGO_URI`, `JWT_SECRET`, `JWT_EXPIRES_IN`, `CLIENT_URL` (comma-separated allowed origins)

**Frontend environment variable (set on Render):** `VITE_API_BASE_URL` (pointing to the live backend `/api`)

Database is hosted on **MongoDB Atlas** (cloud, always-on).

To redeploy after pushing new commits: go to the Render dashboard → select the service → **Manual Deploy → Deploy latest commit** (or enable auto-deploy on push).

---

## 🧭 Usage Walkthrough

1. **Register as a Recruiter** → fill in company details → land on Recruiter Dashboard
2. **Post a Job** → fill in title, description, skills, salary, etc.
3. **Register as a Job Seeker** (use an incognito window for a second session) → build your profile
4. **Search & Apply** → find the posted job → view details → apply
5. **Manage Applications** → back in the Recruiter session → update the applicant's status

---

## 🗺 Roadmap / Bonus Features

- [ ] Resume file upload (currently a URL field — add multer + S3/Cloudinary)
- [ ] Email notifications on application status changes
- [ ] Admin dashboard
- [ ] AI-based job recommendations
- [ ] Dark mode toggle
- [ ] Pagination improvements for large datasets

---

## 👤 Author

**Yashwanth G S**
MCA Student, Dr. Ambedkar Institute of Technology
Built as part of the **CodSoft Full-Stack Web Development Internship**

---

<p align="center">Made with ❤️ during the CodSoft internship</p>
