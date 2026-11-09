# Student Management System

Next.js (App Router) + Tailwind CSS + MongoDB + Mongoose দিয়ে তৈরি CRUD অ্যাপ।

## Features
- Create / Read / Update / Delete (API route দিয়ে)
- Student: Name, Email, Phone, Department
- Email unique validation

## Run locally
```bash
npm install
cp .env.example .env.local   # MONGODB_URI বসান (local MongoDB বা Atlas)
npm run dev
```
http://localhost:3000

## API
| Method | Endpoint | কাজ |
|---|---|---|
| GET | /api/students | সব Student |
| POST | /api/students | নতুন Student |
| PUT | /api/students/:id | Edit |
| DELETE | /api/students/:id | Delete |
