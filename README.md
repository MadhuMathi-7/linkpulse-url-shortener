# LinkPulse - Shorten. Track. Analyze.

LinkPulse is a production-grade, full-stack SaaS URL Shortener platform built with React, Node.js, and MongoDB. It allows users to generate clean shortened links, register custom aliases, set optional expiry boundaries, download instant high-resolution QR codes, perform bulk URL shortening via CSV uploads, and track deep analytics on a dark-themed glassmorphism dashboard.

---

## 🏗️ Architecture Diagram

┌──────────────────────────────────────────────────────────┐
│                      👤 USERS                            │
│          Web Browser / Mobile Browser Users             │
└───────────────────────┬──────────────────────────────────┘
                        │
                        ▼
┌──────────────────────────────────────────────────────────┐
│                  🌐 REACT FRONTEND                      │
│                                                          │
│  • Landing Page                                          │
│  • Login / Signup                                        │
│  • Protected Dashboard                                   │
│  • URL Management                                        │
│  • Analytics Dashboard                                   │
│  • Public Stats Page                                     │
│  • CSV Upload                                            │
└───────────────────────┬──────────────────────────────────┘
                        │
                REST API Calls
                        │
                        ▼
┌──────────────────────────────────────────────────────────┐
│              ⚡ NODE.JS + EXPRESS BACKEND               │
│                                                          │
│  🔐 JWT Authentication Service                           │
│  🔗 URL Shortening Service                               │
│  ↪ Redirect Handler                                      │
│  📊 Analytics Service                                    │
│  📂 Bulk CSV Processing                                  │
│  📱 QR Code Generator                                    │
│  🛡 Validation & Security Middleware                     │
└─────────────┬─────────────────────┬─────────────────────┘
              │                     │
              │                     │
              ▼                     ▼
┌──────────────────┐      ┌──────────────────────────────┐
│ 🍃 MongoDB Atlas │      │       Analytics Engine       │
│                  │      │                              │
│  Users           │      │  • Click Tracking            │
│  URLs            │◄────►│  • Device Analytics          │
│  Visits          │      │  • Browser Analytics         │
│                  │      │  • Geolocation Analytics     │
└─────────┬────────┘      │  • Daily Click Trends        │
          │               └──────────────┬───────────────┘
          │                              │
          ▼                              ▼
┌──────────────────────────────────────────────────────────┐
│                  📈 ANALYTICS DASHBOARD                 │
│                                                          │
│  • Total Clicks                                          │
│  • Last Visit                                            │
│  • Recent Visits                                         │
│  • Browser Distribution                                  │
│  • Device Distribution                                   │
│  • Daily Trends Charts                                   │
└──────────────────────────────────────────────────────────┘

────────────────────────────────────────────────────────────

Deployment Architecture

▲ Vercel        → React Frontend
🚀 Render        → Express Backend
🍃 MongoDB Atlas → Database Hosting


## 🌟 Key Features

1. **Authentication Gate**: Complete user registration and login utilizing JWT tokens, password encryption (bcryptjs), protected client route shields, and persistent sessions.
2. **Short URL Generator**: Instantly generate unique 6-character NanoID slugs or custom marketing aliases, with custom backend validation preventing collisions.
3. **Instant QR Code Downloader**: Automatically generates high-resolution base64 PNG data-url QR codes that users can preview and download in one click.
4. **Asynchronous Tracking (Redirection)**: Delivers redirection responses within milliseconds by executing geolocation lookups, user-agent parsing, click updates, and log additions concurrently in background processes.
5. **Bulk URL Shortening**: Upload a CSV file matching structures to generate lists of short links. Offers summary cards of successfully parsed vs skipped lines, and downloads generated URL sheets.
6. **Advanced Interactive Dashboard**: Modern dark theme featuring overview counters (Total Links, Total Clicks, Active vs Expired Links) and searchable, filterable (Active/Expired), sorted paginated lists.
7. **Detailed Analytics Analytics Pages**: Incorporates line charts, bar charts, and pie charts (using Recharts) mapping click traffic trends, operating system types, browser environments, referrers, and city/country counts.
8. **Public Statistics Pages (`/stats/:shortCode`)**: Provides public access to general click metrics, creation dates, last visit, and QR download keys without exposing visitor IPs, user profiles, or private emails.

---

## 📂 Folder Structure

```text
Hackathon/
├── client/                     # React Frontend App
│   ├── src/
│   │   ├── components/
│   │   │   └── ui/             # Reusable UI Primitives (Button, Input, Card, Table, Dialog, Toast)
│   │   ├── contexts/           # AuthContext (JWT state & Session persistence)
│   │   ├── layouts/            # DashboardLayout (Sidebar navigation & route gates)
│   │   ├── pages/              # LandingPage, Login, Signup, Dashboard, AnalyticsDetails, PublicStats, NotFound, etc.
│   │   ├── services/           # api.js (Axios wrapper with JWT interceptor headers)
│   │   ├── App.jsx             # React Router structure
│   │   └── main.jsx            # Entry point
│   ├── tailwind.config.js      # Custom theme setup
│   └── package.json
│
├── server/                     # Node.js/Express.js Backend Server
│   ├── config/                 # db.js (Mongoose database link wrapper)
│   ├── controllers/            # authController, urlController, analyticsController
│   ├── models/                 # User, Url, and Visit schemas
│   ├── middlewares/            # auth.js (JWT validation checker)
│   ├── routes/                 # Express route configurations (auth, url, analytics)
│   ├── utils/                  # geo.js (Asynchronous geolocation checker)
│   ├── validators/             # auth.js & url.js (Input constraints using express-validator)
│   ├── seed.js                 # Database seeder (Pre-populates traffic data)
│   ├── server.js               # Entry point
│   └── package.json
```

---

## 🛠️ Setup Instructions

### Prerequisites
- Node.js (v18 or higher recommended)
- MongoDB running locally on `localhost:27017` or a MongoDB Atlas URI

### 1. Backend Server Setup
1. Open a terminal and navigate to the server folder:
   ```bash
   cd server
   ```
2. Copy the sample environment file and configure values if needed:
   ```bash
   cp .env.example .env
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Run the database seed script to populate mock entries (users, clicks, locations) for immediate evaluation:
   ```bash
   npm run seed
   ```
5. Start the API server in development mode:
   ```bash
   npm run dev
   ```
   *The backend should listen successfully at `http://localhost:5000`.*

### 2. Frontend Client Setup
1. Open a new terminal and navigate to the client folder:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   *The React application should launch at `http://localhost:5173`.*

---

## 💡 Assumptions Made

1. **IP Geolocation**: For local testing and grading, hits originating from local network IPs (e.g. `127.0.0.1`, `::1`) are mock-mapped to randomly selected international locations (e.g. New York, London, Berlin, Bangalore). This ensures geographical distribution charts render beautifully without requiring paid GeoIP subscriptions or external lookups.
2. **Redirection Performance**: REDIRECTS DO NOT await database operations. The user is redirected to the destination URL instantly, and visit logs are updated concurrently.
3. **Data Cascading**: Wiping a short URL cascades down, deleting all associated visit logs from the database to save space.

---

## 📡 API Documentation

### Authentication Endpoints
- **`POST /api/auth/signup`**: Registers a new user. Accepts JSON `{ name, email, password }`.
- **`POST /api/auth/login`**: Authenticates credentials. Returns JSON `{ success, token, user }`.
- **`GET /api/auth/me`**: Retrieves current logged in user details. Requires `Authorization: Bearer <JWT>`.

### URL Management Endpoints (Protected - JWT Required)
- **`POST /api/urls`**: Generates a short URL. Accepts JSON `{ originalUrl, customAlias?, expiryDate? }`.
- **`GET /api/urls`**: Lists user's short URLs. Supports query filters: `?page=1&search=...&status=active&sortBy=totalClicks&sortOrder=desc`.
- **`GET /api/urls/:id`**: Gets metadata for a specific URL.
- **`PUT /api/urls/:id`**: Edits destination path or expiry bounds. Accepts JSON `{ originalUrl, expiryDate }`.
- **`DELETE /api/urls/:id`**: Deletes link and cascades visits.
- **`POST /api/urls/bulk`**: Processes arrays of links. Accepts JSON `{ urls: [{ originalUrl, customAlias, expiryDate }] }`.

### Analytics Endpoints (Protected - JWT Required)
- **`GET /api/analytics/:urlId`**: Gathers visit counts, browser/device charts, daily timelines, and logs.

### Public Redirects & Stats (Public - No JWT Required)
- **`GET /:shortCode`**: Redirects to target destination URL (Records traffic logs asynchronously).
- **`GET /stats/:shortCode`**: Retrieves public statistics JSON for page displays.

---

## 🚀 Deployment Guide

### Frontend (Deploying to Vercel)
1. Install Vercel CLI globally or use the Vercel Dashboard.
2. Configure an environment variable in the Vercel dashboard:
   - `VITE_API_URL` = `<your-deployed-render-api-url>/api`
3. Build & Deploy:
   ```bash
   vercel
   ```

### Backend (Deploying to Render)
1. Create a new Web Service on Render linking your repository.
2. Specify environment variables under configurations:
   - `PORT` = `5000`
   - `NODE_ENV` = `production`
   - `MONGO_URI` = `<your-mongodb-atlas-connection-string>`
   - `JWT_SECRET` = `<your-secure-production-jwt-key>`
   - `BASE_URL` = `<your-deployed-render-app-url>`
3. Set the start command:
   ```bash
   npm run start
   ```

---

## 📊 Database Schemas

### User Schema
```javascript
{
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
}
```

### URL Schema
```javascript
{
  userId: { type: ObjectId, ref: 'User', required: true },
  originalUrl: { type: String, required: true },
  shortCode: { type: String, required: true, unique: true },
  customAlias: { type: String, unique: true, sparse: true },
  qrCode: { type: String, required: true }, // base64 PNG
  expiryDate: { type: Date, default: null },
  totalClicks: { type: Number, default: 0 }
}
```

### Visit Schema
```javascript
{
  urlId: { type: ObjectId, ref: 'Url', required: true, index: true },
  timestamp: { type: Date, default: Date.now, index: true },
  ipAddress: { type: String, default: 'Unknown' },
  browser: { type: String, default: 'Unknown' },
  operatingSystem: { type: String, default: 'Unknown' },
  deviceType: { type: String, default: 'Unknown' },
  country: { type: String, default: 'Unknown' },
  city: { type: String, default: 'Unknown' },
  referrer: { type: String, default: 'Direct' }
}
```

---

## 🦾 AI Development Log

### AI Planning Document
Our development was guided by the AI [implementation plan](file:///C:/Users/HP/.gemini/antigravity-ide/brain/d84539ab-4454-46eb-aa83-bd8e17c466cc/implementation_plan.md) and task tracker checklist.

### Sample Prompts Used
- *Scaffold a Vite React application with template React and configure dark theme properties.*
- *Generate a seeder script that populates Mongoose databases with mock redirect details.*
- *Write a CSS stylesheet for global Outfit fonts and scrollbars.*

---

This project is a part of a hackathon run by https://katomaran.com
