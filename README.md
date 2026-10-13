# Sahaya (सहाय) — Community Surplus Redistribution Platform

> Connecting surplus food, clothing, and essential items with verified NGOs, shelters, and care homes in real-time.

---

## 🌟 Key Features

1. **Role-Based Access Control (RBAC)**
   - **Donors**: Post surplus items (food, clothes, essentials), track claim status, and generate formal printable **Impact Certificates**.
   - **Receivers (NGOs/Shelters)**: Browse live surplus feed, request claims, post urgent shelter needs to the community board, and verify handovers.
   - **Volunteers**: View unclaimed delivery missions, accept pickup tasks, navigate to locations, and complete deliveries using two-factor handover codes.
   - **Admins**: Approve or reject newly registered receiver organizations.

2. **Perishable Food Expiry Tracker**
   - Real-time countdown badges (`Fresh`, `Urgent`, `Expired`) calculated using prepared and expiry timestamps.
   - Background Spring Boot scheduler automatically marks expired items to maintain food safety.

3. **Interactive Geographical Map**
   - Visualized with Leaflet (`react-leaflet`).
   - Color-coded pins for Food (Red), Goods (Blue), and Shelter Needs (Green) with distance and details popups.

4. **Community Shelter Needs Board**
   - Shelters can post urgent requirements (e.g., blankets, baby formula, rice bags) directly to the community feed.

5. **AI Assistant Chatbot ("Sahaya Sahayak")**
   - Floating assistant widget offering instant guidance on donating perishable food, volunteering, claim verification, and platform rules.

6. **Impact & Metrics Engine**
   - Live analytics counter tracking total donations completed, lives impacted, and active missions.

---

## 🛠️ Tech Stack

- **Backend**: Java 17, Spring Boot 4 / 3, Spring Data JPA, Spring Security, JJWT (v0.12.6)
- **Database**: PostgreSQL (Cloud-hosted on Neon DB)
- **Frontend**: React 19, Vite, React Router DOM, Leaflet / React-Leaflet, CSS3 Custom Properties
- **Deployment**: Render (Backend / Docker Container) & Vercel (Frontend Single Page App)

---

## 🚀 Running Locally

### 1. Backend (Spring Boot)
Ensure Java 17+ is installed.
```bash
cd backend
.\mvnw.cmd spring-boot:run
```
The backend will boot on `http://localhost:8080`.

### 2. Frontend (React + Vite)
```bash
cd frontend
npm install
npm run dev
```
Open `http://localhost:5173` in your browser.

---

## 🌐 Cloud Deployment Guide

### A. Deploy Backend to Render (Docker Web Service)
1. Go to [Render Dashboard](https://dashboard.render.com/) and click **New +** -> **Web Service**.
2. Connect your GitHub repository (`sahaya`).
3. Set the following settings:
   - **Name**: `sahaya-backend`
   - **Root Directory**: `backend`
   - **Runtime**: `Docker` (Render automatically picks up `backend/Dockerfile`)
   - **Instance Type**: `Free`
4. In **Environment Variables**, set:
   - `PORT`: `8080`
   - `SPRING_DATASOURCE_URL`: `jdbc:postgresql://ep-hidden-cloud-b59iz2q1.c-7.us-east-2.aws.neon.tech/neondb?sslmode=require`
   - `SPRING_DATASOURCE_USERNAME`: `neondb_owner`
   - `SPRING_DATASOURCE_PASSWORD`: `npg_19aCrsybEVNo`
   - `SAHAYA_JWT_SECRET`: `sahayaSuperSecretJwtKeyThatIsAtLeast32BytesLongForSecurity123456`
5. Click **Deploy Web Service** and copy your live backend URL (e.g. `https://sahaya-backend.onrender.com`).

---

### B. Deploy Frontend to Vercel
1. Go to [Vercel Dashboard](https://vercel.com/) and click **Add New...** -> **Project**.
2. Import the `sahaya` repository.
3. Configure settings:
   - **Framework Preset**: `Vite`
   - **Root Directory**: Click "Edit" and choose `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. In **Environment Variables**, add:
   - `VITE_API_URL`: `https://<YOUR-RENDER-BACKEND-URL>/api` (e.g., `https://sahaya-backend.onrender.com/api`)
5. Click **Deploy**. Your application is live!
