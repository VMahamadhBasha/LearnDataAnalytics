# LDAWSPT - Codebase Navigation & Feature Development Guide

This document acts as an architectural guide for developers working on the **LDAWSPT** learning platform. It maps out the directory layout, configuration configurations, default database credentials, and provides target instructions for developing upcoming roadmap features.
this file helps to understand the clear knowledge aboy the prohect and 
---

## 📂 Codebase Maps & Architecture Reference - it helps to achieve the project efficiency and right process for work done progress

### 1. Spring Boot Backend Layout
The backend uses a standard MVC design patterns (Controller -> Service Implementation -> Repository -> Database Entity).
Root Directory: [backend/src/main/java/com/ldawspt](file:///e:/LDAWSPT/backend/src/main/java/com/ldawspt)

* **Security & Tokens Configuration**:
  * [WebSecurityConfig.java](file:///e:/LDAWSPT/backend/src/main/java/com/ldawspt/config/WebSecurityConfig.java) - Maps authentication policies, routes (student vs admin), and CORS filters.
  * [JwtTokenProvider.java](file:///e:/LDAWSPT/backend/src/main/java/com/ldawspt/security/JwtTokenProvider.java) - Generates JWT claims, parses incoming authorization signatures, and extracts student identification tokens.
  * [JwtAuthenticationFilter.java](file:///e:/LDAWSPT/backend/src/main/java/com/ldawspt/security/JwtAuthenticationFilter.java) - Intercepts HTTP requests, validates token health, and resolves user identities to security contexts.

* **REST Endpoint Layer (Controllers)**:
  * [AuthController.java](file:///e:/LDAWSPT/backend/src/main/java/com/ldawspt/controller/AuthController.java) - Maps registration criteria checks and login assertions.
  * [CourseController.java](file:///e:/LDAWSPT/backend/src/main/java/com/ldawspt/controller/CourseController.java) - Catalog lists, modules groupings, and lesson detail views.
  * [ProgressController.java](file:///e:/LDAWSPT/backend/src/main/java/com/ldawspt/controller/ProgressController.java) - Track completed lesson checkboxes and bookmark toggles.
  * [CertificateController.java](file:///e:/LDAWSPT/backend/src/main/java/com/ldawspt/controller/CertificateController.java) - Stream dynamically created verification PDFs from memory.
  * [AdminController.java](file:///e:/LDAWSPT/backend/src/main/java/com/ldawspt/controller/AdminController.java) - Content management CRUD endpoints (courses, modules, lessons).

* **Service Logic Layer**:
  * Located under [backend/src/main/java/com/ldawspt/service/impl](file:///e:/LDAWSPT/backend/src/main/java/com/ldawspt/service/impl).
  * Executes course completion equations, user password updates, and database updates.

* **Database Repositories**:
  * Located under [backend/src/main/java/com/ldawspt/repository](file:///e:/LDAWSPT/backend/src/main/java/com/ldawspt/repository).
  * Spring Data JPA criteria mappings.

---

### 2. React Frontend Structure
The frontend is a single-page application built on Vite + React 19.
Root Directory: [frontend/src](file:///e:/LDAWSPT/frontend/src)

* **SPA Router Component**:
  * [App.jsx](file:///e:/LDAWSPT/frontend/src/App.jsx) - Custom pathname-based route manager which maps URL patterns directly to components.

* **API Interceptors**:
  * [api.js](file:///e:/LDAWSPT/frontend/src/services/api.js) - Sets baseURL, intercepts outgoing requests to inject local JWT tokens, and redirects expired sessions (401 status) back to login.

* **Auth Context Handler**:
  * [AuthContext.jsx](file:///e:/LDAWSPT/frontend/src/context/AuthContext.jsx) - Caches user data locally, handles user registration, and updates profile context data.

* **Pages Catalog**:
  * Located in [frontend/src/pages](file:///e:/LDAWSPT/frontend/src/pages):
    * `Home.jsx` - Landing catalog view.
    * `Login.jsx` & `Register.jsx` - Form components with advanced client-side validator constraints and strength meters.
    * `Dashboard.jsx` - Displays active learning path summaries, progress metrics, and credentials.
    * `LessonViewer.jsx` - Split-screen design with media players (YouTube/PDF support), bookmarks, local notes text caching, and SQL simulation sandboxes.
    * `Profile.jsx` - User profile updates and credentials change validators.
    * `Certificates.jsx` - Earned certificates listing.
  * Located in [frontend/src/pages/admin](file:///e:/LDAWSPT/frontend/src/pages/admin):
    * `AdminDashboard.jsx` - Metrics overview charts.
    * `CourseMgmt.jsx` - Add, edit, or delete courses/modules/lessons inside dynamic modals.
    * `UserMgmt.jsx` - Registry table to inspect permissions and disable/enable user accounts.
    * `AdminCertificates.jsx` - Mappings of generated student credentials with regeneration buttons.

---

## 🔑 Connection Credentials & Seed Configurations

### 1. Database Mappings
File: [backend/src/main/resources/application.properties](file:///e:/LDAWSPT/backend/src/main/resources/application.properties)

Configure your local MySQL settings here:
```properties
spring.datasource.url=${DATABASE_URL:jdbc:mysql://localhost:3306/ldawspt?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true}
spring.datasource.username=${DATABASE_USERNAME:root}
spring.datasource.password=${DATABASE_PASSWORD:password}
```

### 2. JWT Configuration Keys
Configure cryptographic secrets to sign user login tokens securely:
```properties
ldawspt.jwt.secret=${JWT_SECRET:d2Etd29yay1oYXJkLXRvLWNyZWF0ZS1hLXNlY3VyZS1hbmQtcm9idXN0LWp3dC1zZWNyZXQta2V5LXdpdGgtZW5vdWdoLWxlbmd0aC1mb3ItYWxnb3JpdGht}
ldawspt.jwt.expiration-ms=${JWT_EXPIRATION_MS:86400000}
```

### 3. Pre-Seeded Default Accounts
File: [backend/src/main/resources/data-mysql.sql](file:///e:/LDAWSPT/backend/src/main/resources/data-mysql.sql)

Use these credentials to sign in and test features without manually creating new roles:
* **System Administrator**:
  * **Username**: `admin`
  * **Email**: `admin@ldawspt.com`
  * **Password**: `admin123` *(Seeded as pre-hashed BCrypt token)*
* **Sample Paths**:
  1. SQL for Data Analytics (ID: 1)
  2. Snowflake Cloud Data Warehousing (ID: 2)
  3. Python for Data Analytics (ID: 3)

---

## 🛠️ Feature Development Targets (Roadmap)

To implement the upcoming platform features, locate and edit code in these target areas:

### 1. AI Doubt Solver & Chat Assistant
Provide an interactive LLM chat helper contextually aware of the current lesson material.
* **Frontend Integration**:
  * In [LessonViewer.jsx](file:///e:/LDAWSPT/frontend/src/pages/LessonViewer.jsx), find the `aiChat` state and `handleSendAiMessage` method. Replace the mockup logic with an HTTP POST request to `/api/lessons/${lessonId}/doubt`.
* **Backend Endpoint**:
  * Update `CourseController.java` or add `DoubtController.java` inside `com.ldawspt.controller`.
  * Map a POST endpoint `/api/lessons/{id}/doubt` which queries the lesson description context (via `LessonRepository`) and feeds it alongside the student's query to a Spring AI LLM client bean.

### 2. Live Snowflake & SQL Sandbox
Allow students to execute SQL statements directly against active database containers.
* **Frontend Integration**:
  * In [LessonViewer.jsx](file:///e:/LDAWSPT/frontend/src/pages/LessonViewer.jsx), look for the `sandboxQuery` state and `handleRunSandbox` form submission method. Connect it to `/api/sandbox/execute`.
* **Backend Endpoint**:
  * Create `SandboxController.java` in `com.ldawspt.controller`.
  * Connect to a sandbox Snowflake trial account or run statements against H2 memory clusters.
  * **Security Constraint**: Add logic to validate query strings, ensuring they only perform read-only actions (`SELECT`) to prevent data modifications.

### 3. Dashboard Project Submissions
Allow students to upload packaged dashboard files (`.pbix` or `.twbx`) to earn credits.
* **Frontend Integration**:
  * In [LessonViewer.jsx](file:///e:/LDAWSPT/frontend/src/pages/LessonViewer.jsx), implement a file drop input. On upload, trigger a multipart POST request to `/api/progress/lessons/{id}/submit`.
* **Backend/Database Integration**:
  * Create a `Submission.java` database entity to track file urls, student IDs, and project scores.
  * Implement an upload handler endpoint in `ProgressController.java` that saves files to cloud storage (AWS S3/OCI) and updates status logs.

### 4. Daily Learning Streaks
Record consecutive login streaks to gamify learning milestones.
* **Frontend Integration**:
  * Add a streak calendar visual indicator inside [Dashboard.jsx](file:///e:/LDAWSPT/frontend/src/pages/Dashboard.jsx) referencing user properties.
* **Backend Integration**:
  * In `User.java`, add `consecutiveStreak` and `lastActiveDate` database columns.
  * In `UserServiceImpl.java`, update the login authentication callback: compare the current date with `lastActiveDate`. If exactly 1 day has passed, increment `consecutiveStreak`. If longer, reset it to 1.

### 5. Multi-Language & Dark Mode
* **Frontend Integration**:
  * Install `react-i18next` and define resource files (`en.json`, `es.json`, etc.).
  * Integrate translate context hooks in [Profile.jsx](file:///e:/LDAWSPT/frontend/src/pages/Profile.jsx) and navigation components.
  * To customize light mode styling, edit [index.css](file:///e:/LDAWSPT/frontend/src/index.css) and configure light variable overrides inside a `:root.light-theme` selector block.
