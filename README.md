# Medicine Prescription Management System

A full-stack application for managing medicine prescriptions, built with React, TypeScript, Node.js, Express, and MongoDB.

## Features

- **Prescription Management**: Create, view, and manage prescriptions
- **Medicine Inventory**: Track medicine stock and details
- **Responsive Design**: Works on desktop and mobile devices
- **PDF Generation**: Export prescriptions as PDF documents

## Tech Stack

### Frontend (Client)
- React 19 with TypeScript
- Tailwind CSS for styling
- React Testing Library for testing
- jsPDF for PDF generation
- Lucide React for icons

### Backend (Server)
- Node.js with Express 5
- TypeScript
- MongoDB with Mongoose ODM
- JWT for authentication (if implemented)
- CORS enabled for cross-origin requests

## Project Structure

```
medicine-prescription/
├── client/                 # Frontend React application
│   ├── public/             # Static files
│   └── src/                # Source files
│       ├── components/     # Reusable UI components
│       ├── services/       # API services
│       └── ...
├── server/                 # Backend server
│   ├── src/
│   │   ├── middleware/    # Express middleware
│   │   ├── models/        # Database models (Mongoose)
│   │   └── routes/        # API routes
│   └── ...
├── .gitignore
└── README.md
```

## Prerequisites

- Node.js (v18 or higher)
- npm (v9 or higher) or yarn
- MongoDB (local or cloud instance)

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/Rajii-Quixentsolution/Medicine-Prescription.git
cd medicine-prescription
```

### 2. Set up the Backend

1. Navigate to the server directory:
   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the server directory and add your environment variables:
   ```env
   MONGODB_URI=mongodb://localhost:27017/medicine_prescription
   JWT_SECRET=your_jwt_secret
   PORT=3001
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

### 3. Set up the Frontend

1. Open a new terminal and navigate to the client directory:
   ```bash
   cd ../client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. The application should automatically open in your default browser at [http://localhost:3000](http://localhost:3000)

## Available Scripts

### Client
- `npm start`: Start the development server
- `npm test`: Run tests
- `npm run build`: Create a production build
- `npm run eject`: Eject from Create React App

### Server
- `npm run dev`: Start the development server with hot-reload using nodemon
- `postinstall`: Automatically runs Prisma generate after installation

## Development

- The frontend runs on port 3000
- The backend API runs on port 3001
- The frontend is configured to proxy API requests to the backend

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
