# Medicine Prescription Billing System - Architectural Design

This document outlines the architectural design of the Medicine Prescription Billing System, covering both the frontend and backend components, data flow, and key design decisions.

## 1. High-Level Overview

The application is a full-stack MERN-based system designed for managing medical stores, medicines, and patient billing. It features a role-based access control system to distinguish between regular users and administrators.

- **Frontend:** A single-page application (SPA) built with React and TypeScript, styled with Tailwind CSS.
- **Backend:** A RESTful API built with Node.js and Express.js, using a MongoDB database for data persistence.
- **Database:** MongoDB, a NoSQL database, is used to store data for stores, medicines, users, and billing.

---

## 2. Backend Architecture

The backend is responsible for handling business logic, data storage, and authentication.

### 2.1. Technology Stack

- **Runtime Environment:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB
- **ODM (Object Data Modeling):** Mongoose
- **Authentication:** JSON Web Tokens (JWT)

### 2.2. Project Structure

The backend code is organized into the following directories:

- `src/models/`: Contains Mongoose schemas that define the structure of the data in the database (`User.ts`, `Store.ts`, `Medicine.ts`, `Billing.ts`).
- `src/routes/`: Defines the API endpoints and maps them to the corresponding controller logic (`auth.ts`, `user.ts`, `store.ts`, `medicine.ts`, `billing.ts`).
- `src/middleware/`: Contains middleware functions, such as `auth.ts` for handling authentication and authorization.
- `src/index.ts`: The entry point of the server application.

### 2.3. API Endpoints & Data Flow

The backend exposes a RESTful API for the frontend to consume.

**Authentication Flow:**

1.  A user submits their credentials via the login form.
2.  The frontend sends a `POST` request to `/api/auth/login`.
3.  The `auth` route handler validates the credentials against the `User` model.
4.  If successful, a JWT is generated and sent back to the client.
5.  The frontend stores this token in local storage for subsequent authenticated requests.

**Authenticated Routes:**

- All protected routes require a valid JWT in the `Authorization` header.
- The `auth` middleware (`src/middleware/auth.ts`) intercepts requests, verifies the JWT, and attaches the user's information to the request object.
- The `isAdmin` middleware provides an additional layer of security, restricting access to certain routes to admin users only.

**CRUD Operations:**

- **Stores, Medicines, Users:** Full CRUD functionality is available, but restricted to admin users via the `isAdmin` middleware.
- **Billing:** All authenticated users can perform CRUD operations on billing records.

---

## 3. Frontend Architecture

The frontend is a responsive and interactive single-page application.

### 3.1. Technology Stack

- **Framework:** React
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Icons:** Lucide React

### 3.2. Project Structure

The frontend code is organized as follows:

- `src/components/`: Contains reusable React components that make up the user interface (`Login.tsx`, `Header.tsx`, `Store.tsx`, etc.).
- `src/services/`: Includes the `api.ts` file, which centralizes all communication with the backend API.
- `src/types.ts`: Defines shared TypeScript interfaces (`IUser`, `IStore`, etc.) for type safety and consistency.
- `src/App.tsx`: The main application component that manages routing, state, and data fetching.

### 3.3. Data Flow and State Management

- **State Management:** The application uses React's built-in state management hooks (`useState`, `useEffect`). The main `App.tsx` component holds the primary state for stores, medicines, and billings, passing data and operations down to child components as props.
- **API Communication:** The `src/services/api.ts` file provides a structured way to interact with the backend. It handles adding the JWT to requests and basic error handling.
- **Component Interaction:**
    1.  The `App.tsx` component fetches all necessary data upon user login.
    2.  This data is passed down to child components (e.g., `StoreComponent`, `MedicineComponent`).
    3.  When a user performs an action (e.g., clicks "Add Store"), the child component calls a function passed down as a prop from `App.tsx`.
    4.  This function then uses the `api.ts` service to send a request to the backend.
    5.  Upon a successful response, the state in `App.tsx` is updated, causing the UI to re-render with the new data.

### 3.4. Role-Based UI

- The UI dynamically adapts based on the logged-in user's role.
- The `currentUser` object, fetched after login, is passed to components that have restricted actions.
- Components like `Store.tsx` and `Medicine.tsx` check if `currentUser.type === 'admin'` before rendering buttons for creating, editing, or deleting records. This prevents non-admin users from seeing UI elements for actions they are not authorized to perform.

---

## 4. Database Schema

The MongoDB database consists of four main collections:

- **Users:** Stores user credentials and role information (`email`, `password`, `type`, `storeId`).
- **Stores:** Contains information about each medical store (`name`).
- **Medicines:** Details about each medicine, linked to a store (`name`, `storeId`, `expirydate`, `stock`, `batchNumber`).
- **Billings:** Records of prescriptions, linked to a medicine and a store (`medicineId`, `storeId`, `frequency`, `name`, `number`, `description`).

This architecture creates a robust, secure, and maintainable system for managing medical billing and inventory.
