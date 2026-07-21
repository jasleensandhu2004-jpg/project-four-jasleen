# Express Integration & Cloud Deployment Dashboard

**Module 6 & 7 Capstone Project**  
*Author:* Jasleen Sandhu  
*Live Application URL:* [INSERT YOUR LIVE DEPLOYMENT URL HERE]

---

## 📌 Project Overview
This project transforms a client-side JavaScript dashboard into a full-stack Web Application powered by Express.js and deployed to the cloud. The back-end handles RESTful endpoints for retrieving and creating activity items while utilizing middleware for request logging and JSON parsing.

## 🚀 Key Features
* **Real Express REST API**: Integrated `GET /api/items` and `POST /api/items` routes serving JSON responses.
* **Environment Variables**: Dynamically reads `process.env.APP_ENV` to display environment context across backend and frontend layers.
* **UX/UI Improvements**: Implements dynamic loading indicators during server fetch operations, error handling banners, and responsive cards.
* **Cloud Platform Deployment**: Deployed on **Render** with persistent environment configuration settings.

---

## 🛠️ Environment Variables Configuration
The application consumes the following environment variable:
* `APP_ENV`: Defines the active execution environment (e.g., `Production-Cloud`).

### Setup Instructions:
1. **Local Development**: Create a `.env` file in the root directory and specify:
   ```env
   PORT=3000
   APP_ENV=Development