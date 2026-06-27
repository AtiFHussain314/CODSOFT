# TalentBridge Job Board

TalentBridge is a full-stack job board where employers can post openings and manage applicants while candidates can search roles, apply with a resume, and track application status.

## Tech stack

- React and Vite frontend
- Node.js and Express API
- MongoDB with Mongoose
- JWT authentication with role-based authorization
- Multer resume uploads
- Nodemailer email notifications

## Features

- Home page with welcome message, search, and featured jobs
- Searchable job listings with role, location, and job type filters
- Job detail pages with salary, requirements, benefits, and application flow
- Employer dashboard for account details, job posting, and applicant status updates
- Candidate dashboard for profile management and application tracking
- Resume upload for PDF, DOC, and DOCX files
- Email notifications for successful applications and status updates
- Password hashing, JWT-protected routes, rate limiting, Helmet security headers, and role checks
- Responsive layout for desktop, tablet, and mobile screens

## Getting started

From this directory:

```bash
pnpm install
```

Create the server environment file:

```bash
cp server/.env.example server/.env
```

Update `server/.env` with your MongoDB connection string and a long `JWT_SECRET`.

Seed sample data:

```bash
pnpm run seed
```

Run the React client and Express API together:

```bash
pnpm run dev
```

Frontend: `http://localhost:5173`

API: `http://localhost:5000/api`

## Sample accounts

After running the seed script:

- Employer: `employer@example.com` / `Password123`
- Candidate: `candidate@example.com` / `Password123`

## Email notifications

If SMTP settings are provided in `server/.env`, emails are sent through Nodemailer. If SMTP is omitted, email payloads are printed in the server console so the application flow still works locally.

## Resume uploads

Uploaded resumes are saved under `server/uploads/resumes` and served from `/uploads/resumes/<filename>`. The upload directory is ignored by Git.
