# LearnFinder — AI-Powered Learning Resource Finder

A full-stack web application that uses AI to curate personalized learning resources and generate structured learning paths for any topic.

🔗 Live Demo: https://learnfinder.vercel.app/

## Features
- 🔍 AI-powered resource search using Groq (Llama 3.3)
- 🗺️ 4-week structured learning path generator
- 📋 AI summarization for each resource
- 🔐 JWT authentication (register/login)
- 💾 Save resources and learning paths to personal dashboard

## Tech Stack
**Frontend:** React, Vite, Tailwind CSS, React Router  
**Backend:** Node.js, Express.js  
**Database:** MongoDB Atlas, Mongoose  
**AI:** Groq API (Llama 3.3 70B)  
**Auth:** JWT, bcryptjs  
**Deployment:** Vercel (frontend), Render (backend)

## Run Locally

**Backend**
```bash
cd server
npm install
# add .env with GROQ_API_KEY, MONGO_URI, JWT_SECRET
node server.js
```

**Frontend**
```bash
cd client
npm install
# add .env with VITE_API_URL=http://localhost:5000/api
npm run dev
```