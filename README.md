# 🎓 EventMate

### Smart College Event Management System

<p align="center">

![React](https://img.shields.io/badge/Frontend-React%2019-blue?style=for-the-badge)
![SpringBoot](https://img.shields.io/badge/Backend-Spring%20Boot%203-brightgreen?style=for-the-badge)
![Java](https://img.shields.io/badge/Java-21-orange?style=for-the-badge)
![Database](https://img.shields.io/badge/Database-MySQL%20%7C%20PostgreSQL-blue?style=for-the-badge)
![Deployment](https://img.shields.io/badge/Deployment-Vercel%20%7C%20Render-purple?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

</p>

---

## 📌 Overview

**EventMate** is a **modern full-stack event management platform** designed to simplify the organization, discovery, and registration of college events.

It enables:

* 🎓 **Students** to discover and register for events easily
* 🛠 **Administrators** to manage the full event lifecycle
* 📊 **Real-time analytics and reporting** for better decision making

The system is built with **React + Spring Boot**, providing a scalable architecture and modern user experience.

---

# 🚀 Live Application

### 🌐 Frontend

[https://eventmate-eta.vercel.app/](https://eventmate-eta.vercel.app/)

### ⚙️ Backend API

[https://eventmate-collegeeventmanagementsystem.onrender.com/api](https://eventmate-collegeeventmanagementsystem.onrender.com/api)

---

# 📸 Screenshots

### Student Event Dashboard

```
/screenshots/student-dashboard.png
```

---

### Event Registration Page

```
/screenshots/event-registration.png
```

---

### Admin Analytics Dashboard

```
/screenshots/admin-dashboard.png
```

---

# ✨ Core Features

## 👩‍🎓 Student Experience

### 🔎 Event Discovery

Students can browse:

* Workshops
* Seminars
* Hackathons
* Cultural Events

Displayed in a **modern responsive grid layout**.

---

### 📝 Quick Event Registration

Students can register using:

* Name
* Email
* Phone
* Department
* Year

Registration takes **less than 10 seconds**.

---

### 📧 Email-Based Registration Lookup

Students can **view all their registered events** simply by entering their email.

No account or login required.

---

### 🎟 Smart Seat Management

Features:

* Real-time seat availability
* Prevents overbooking
* Displays remaining slots

---

# 🔐 Admin Panel

## 📊 Executive Dashboard

Displays key statistics:

* Total Events
* Upcoming Events
* Total Registrations
* Most Popular Event

---

## 🛠 Event Management

Admins can:

* Create events
* Update event details
* Delete events
* Manage event capacity

---

## 👥 Attendee Tracking

Admins can view:

* Registered students
* Event participation history

---

## 📄 CSV Report Export

Download:

* Event attendee list
* Event summary reports

Useful for **offline reporting and analysis**.

---

# 🏗 System Architecture

```
            ┌──────────────────────────┐
            │        React App         │
            │   (Vite + Tailwind)      │
            └─────────────┬────────────┘
                          │
                          │ REST API
                          ▼
            ┌──────────────────────────┐
            │      Spring Boot API     │
            │   (Spring Security JWT)  │
            └─────────────┬────────────┘
                          │
                          │ JPA / Hibernate
                          ▼
            ┌──────────────────────────┐
            │        Database          │
            │   MySQL / PostgreSQL     │
            └──────────────────────────┘
```

---

# 🛠 Tech Stack

## Frontend

| Technology   | Purpose               |
| ------------ | --------------------- |
| React 19     | UI Framework          |
| Vite         | Fast build system     |
| Tailwind CSS | Styling               |
| Material UI  | UI components         |
| Lucide React | Icons                 |
| Context API  | Global state          |
| Fetch API    | Backend communication |

---

## Backend

| Technology      | Purpose               |
| --------------- | --------------------- |
| Spring Boot     | Backend framework     |
| Spring Security | Authentication        |
| JWT             | Secure API access     |
| Spring Data JPA | ORM                   |
| Hibernate       | Persistence           |
| Lombok          | Boilerplate reduction |
| Maven           | Dependency management |

---

## Database

| Database   | Usage       |
| ---------- | ----------- |
| MySQL      | Development |
| PostgreSQL | Production  |

---

# 📡 API Documentation

## Authentication

| Method | Endpoint          | Description |
| ------ | ----------------- | ----------- |
| POST   | `/api/auth/login` | Admin login |

---

## Events

| Method | Endpoint           | Description    |
| ------ | ------------------ | -------------- |
| GET    | `/api/events`      | Get all events |
| POST   | `/api/events`      | Create event   |
| PUT    | `/api/events/{id}` | Update event   |
| DELETE | `/api/events/{id}` | Delete event   |

---

## Registrations

| Method | Endpoint                             | Description               |
| ------ | ------------------------------------ | ------------------------- |
| POST   | `/api/registrations`                 | Register student          |
| GET    | `/api/registrations/student/{email}` | Get student registrations |

---

# 📂 Project Structure

```
EventMate
│
├── reactapp
│   ├── src
│   │   ├── components
│   │   ├── pages
│   │   ├── services
│   │   └── context
│   │
│   └── public
│
└── springapp
    ├── controller
    ├── model
    ├── repository
    ├── service
    ├── config
    └── exception
```

---

# ⚙️ Installation

## Prerequisites

Install:

* Node.js 18+
* Java 21
* Maven
* MySQL / PostgreSQL

---

# 🔧 Backend Setup

```
cd springapp
```

Create database

```
eventmate
```

Update database config in

```
application.properties
```

Run backend

```
mvn spring-boot:run
```

Server runs at:

```
http://localhost:8080
```

---

# 💻 Frontend Setup

```
cd reactapp
```

Install dependencies

```
npm install
```

Create `.env`

```
VITE_BASE_URL=http://localhost:8080/api
```

Run project

```
npm run dev
```

Frontend runs at:

```
http://localhost:5173
```

---

# 📈 Recent Improvements

* ✅ Email-based registration lookup
* ✅ CSV export reports
* ✅ Admin analytics dashboard
* ✅ Skeleton loading screens
* ✅ Global exception handling
* ✅ Improved UI responsiveness

---

# 🚀 Future Improvements

* 🔔 Email notifications for registrations
* 📅 Calendar integration
* 📱 Mobile app version
* 📊 Advanced analytics
* 🎫 QR code event check-in

---

# 🤝 Contributing

1️⃣ Fork the project

2️⃣ Create feature branch

```
git checkout -b feature/new-feature
```

3️⃣ Commit changes

```
git commit -m "Add new feature"
```

4️⃣ Push branch

```
git push origin feature/new-feature
```

5️⃣ Open Pull Request

---

# 📄 License

This project is licensed under the **MIT License**.

---

# 👨‍💻 Author

**Gnaneshwar Nani**

Full Stack Developer

Tech Stack:

* React
* Spring Boot
* Java
* DevOps
* System Design

---

⭐ **If you like this project, consider giving it a star on GitHub.**

---
