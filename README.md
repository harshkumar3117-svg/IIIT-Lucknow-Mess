# 🍽️ IIIT Lucknow Mess Management System

![License](https://img.shields.io/badge/License-MIT-blue.svg)
![React](https://img.shields.io/badge/React-19-blue)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2.5-brightgreen)
![MySQL](https://img.shields.io/badge/MySQL-Database-orange)

A comprehensive, full-stack Mess Management System designed specifically for the students of IIIT Lucknow. This application streamlines the process of managing daily meals, user feedback, and student authentication using a modern tech stack.

## 🚀 Live Demo

https://iiit-lucknow-mess-production-6a91.up.railway.app/

---

## ✨ Key Features

- **Secure Authentication & Authorization:** Robust user registration and login system protected by Spring Security and JWT (JSON Web Tokens). Ensures only verified IIIT Lucknow students can access mess services.
- **Interactive Daily Menu:** Students can seamlessly view daily meal offerings (Breakfast, Lunch, Snacks, Dinner) through an intuitive UI featuring `MealCard` components.
- **Feedback Mechanism:** Dedicated feedback portal for students to review meals, ensuring continuous improvement of mess food quality.
- **Responsive Dashboard:** Fully responsive design built with Bootstrap and custom CSS to provide an optimal viewing experience on desktops, tablets, and mobile devices.
- **Student Profiles:** Individual profile tracking capturing details like Enrollment Number, Program, and Branch.

---

## 💻 Tech Stack

### Frontend
- **Framework:** React 19 (built with Vite for lightning-fast HMR)
- **Routing:** React Router DOM
- **Styling:** Vanilla CSS & Bootstrap 5
- **HTTP Client:** Axios (for API integrations)

### Backend
- **Framework:** Spring Boot 3.2.5 (Java 21)
- **Security:** Spring Security & JWT (io.jsonwebtoken)
- **ORM / Database Access:** Spring Data JPA / Hibernate
- **Boilerplate Reduction:** Lombok

### Database & Deployment
- **Database:** MySQL
- **Environment Management:** Spring Dotenv
- **Deployment Strategy:** Vercel (Frontend) & Railway/Render (Backend - configured via application.properties)

---

## 🏗️ Architecture Overview

The system follows a decoupled Client-Server architecture:
1. **Client Layer (React):** Handles UI rendering, client-side routing, and local state. Communicates with the backend REST APIs using Axios and attaches JWT tokens for secure endpoints.
2. **Controller Layer (Spring Boot):** Intercepts HTTP requests (`AuthController`), validates input, and routes them to the appropriate services.
3. **Security Layer:** Intercepts requests to ensure the presence of a valid JWT token before granting access to protected resources.
4. **Data Access Layer:** Uses Spring Data JPA repositories to interface directly with the MySQL database for CRUD operations on entities (e.g., `Student`).

---

## 📂 Folder Structure

```text
IIIT-Lucknow-Mess/
│
├── public/                 # Static assets
├── src/                    # Frontend React Source Code
│   ├── assets/             # Images, icons, and illustrations
│   ├── components/         # Reusable UI components (Navbar, Footer, MealCard, CounterBox)
│   ├── context/            # React Context for global state management
│   ├── pages/              # Page views (Home, About, Menu, Feedback, Login, Signup)
│   ├── App.jsx             # Root React component
│   ├── index.css           # Global stylesheet
│   └── main.jsx            # Entry point for React application
│
├── src/main/java/.../Project/  # Backend Spring Boot Source Code
│   ├── controller/         # REST API Controllers (AuthController.java)
│   ├── model/              # JPA Entities (Student.java)
│   ├── Repository/         # Spring Data JPA Repositories
│   ├── security/           # JWT Utility and Security Configurations
│   └── ProjectApplication.java # Spring Boot Main Class
│
├── src/main/resources/     # Backend configuration files
│   └── application.properties  # DB and environment settings
│
├── pom.xml                 # Maven dependencies for backend
├── package.json            # NPM dependencies for frontend
└── vite.config.js          # Vite bundler configuration
```

---

## 🛠️ Installation & Setup Instructions

Follow these steps to run the application locally on your machine.

### Prerequisites
- Node.js (v18+)
- Java JDK 21
- Maven
- MySQL Server (running on port 3306)

### 1. Clone the repository
```bash
git clone https://github.com/your-username/IIIT-Lucknow-Mess.git
cd IIIT-Lucknow-Mess
```

### 2. Database Setup
1. Open your MySQL client and create a new database.
2. Create a `.env` file in the root directory and configure your credentials:
```env
MYSQLHOST=localhost
MYSQLPORT=3306
MYSQLDATABASE=your_database_name
MYSQLUSER=root
MYSQLPASSWORD=your_password
JWT_SECRET=your_super_secret_jwt_key_that_is_at_least_256_bits_long
PORT=8080
```

### 3. Backend Setup
Open a terminal in the root directory and run the Spring Boot application using Maven Wrapper:
```bash
# Windows
mvnw.cmd spring-boot:run

# Linux/Mac
./mvnw spring-boot:run
```
*The backend API will start on `http://localhost:8080`.*
---

## 📖 Usage Guide

1. **Sign Up:** Navigate to the `/signup` page. Enter your details including your IIITL Enrollment Number and a strong password.
2. **Login:** Access your account via the `/login` page to receive your session token.
3. **View Menu:** Navigate to the `/menu` section to check today's breakfast, lunch, snacks, and dinner.
4. **Submit Feedback:** Use the `/feedback` page to rate the meals and submit suggestions to the mess committee.

---



## 🔮 Future Improvements / Roadmap

- [ ] **Admin Dashboard:** Create a dedicated portal for the mess manager to update daily menus and view aggregate feedback analytics.
- [ ] **QR Code Integration:** Implement a QR code scanning feature for students to verify their mess subscriptions upon entry.
- [ ] **Leave/Rebate System:** Allow students to pause their mess subscription if they are going home, automatically calculating fee rebates.
- [ ] **Notification System:** Add email/push notifications for special meal announcements or sudden menu changes.

---

## 🤝 Contribution Guidelines

We welcome contributions from fellow IIITL students!
1. Fork the repository.
2. Create a new branch (`git checkout -b feature/AmazingFeature`).
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

Please ensure your code follows the existing style conventions and passes ESLint validations (`npm run lint`).

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---
*Built with ❤️ for IIIT Lucknow.*

