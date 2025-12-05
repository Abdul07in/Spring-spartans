# Spring Spartans

A full-stack application with a React TypeScript frontend and Node.js backend, featuring authentication, dashboards, and application management.

## Project Overview

This project is organized into two main parts:

- **Frontend**: A React TypeScript application built with Vite
- **Backend**: A Node.js server with data management capabilities

## Table of Contents

- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the Project](#running-the-project)
- [Frontend](#frontend)
- [Backend](#backend)
- [Development](#development)
- [Build & Deployment](#build--deployment)

## Project Structure

\\\
Spring-spartans/
├── frontend/                 # React TypeScript frontend application
│   ├── src/
│   │   ├── components/      # Reusable React components
│   │   │   └── dashboard/   # Dashboard-related components
│   │   │       ├── AdminDashboard.tsx
│   │   │       ├── ApplicationCard.tsx
│   │   │       ├── ApplicationOwnerApplications.tsx
│   │   │       ├── ApplicationOwnerDashboard.tsx
│   │   │       ├── ApplicationOwnerRequestsTable.tsx
│   │   │       ├── BusinessOwnerApplications.tsx
│   │   │       ├── BusinessOwnerDashboard.tsx
│   │   │       ├── BusinessOwnerRequestsTable.tsx
│   │   │       ├── KPICard.tsx
│   │   │       ├── ManageUserAccessPage.tsx
│   │   │       ├── ModuleBadge.tsx
│   │   │       ├── PendingRequestsTable.tsx
│   │   │       ├── RaiseRequestModal.tsx
│   │   │       ├── ReportingManagerApplications.tsx
│   │   │       ├── ReportingManagerDashboard.tsx
│   │   │       └── UserAccessTable.tsx
│   │   ├── types/           # TypeScript type definitions
│   │   │   └── dashboard.ts
│   │   ├── App.tsx          # Main App component
│   │   ├── App.css          # App styles
│   │   ├── LoginPage.tsx    # Login page component
│   │   ├── LoginPage.css    # Login page styles
│   │   ├── main.tsx         # React entry point
│   │   ├── index.css        # Global styles
│   │   └── assets/          # Static assets
│   ├── public/              # Static files served as-is
│   ├── vite.config.ts       # Vite configuration
│   ├── tsconfig.json        # TypeScript configuration
│   ├── eslint.config.js     # ESLint configuration
│   ├── package.json         # Frontend dependencies
│   └── README.md            # Frontend-specific documentation
├── backend/                 # Node.js backend server
│   ├── server.js            # Main server file
│   ├── data.js              # Data management/models
│   ├── package.json         # Backend dependencies
│   └── README.md            # Backend-specific documentation
└── README.md               # Project-wide documentation
\\\

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v14 or higher)
- **npm** (v6 or higher) or **yarn**
- **Git** (for version control)

## Installation

### 1. Clone the Repository

\\\ash
git clone <repository-url>
cd Spring-spartans
\\\

### 2. Install Frontend Dependencies

\\\ash
cd frontend
npm install
\\\

### 3. Install Backend Dependencies

\\\ash
cd ../backend
npm install
\\\

## Running the Project

### Development Mode

#### Terminal 1: Start the Backend Server

\\\ash
cd backend
npm start
\\\

The backend server will run on \http://localhost:3000\ (or configured port).

#### Terminal 2: Start the Frontend Development Server

\\\ash
cd frontend
npm run dev
\\\

The frontend development server will typically run on \http://localhost:5173\ (Vite default).

### Access the Application

Open your browser and navigate to the frontend URL (usually \http://localhost:5173\).

## Frontend

### Overview

The frontend is a modern React application built with **TypeScript** and **Vite**, providing a fast development experience and optimized production builds.

### Technology Stack

- **React** - UI library
- **TypeScript** - Type safety and better developer experience
- **Vite** - Fast build tool and dev server
- **ESLint** - Code quality and style consistency
- **CSS** - Styling (modular approach with component-specific CSS files)

### Key Features

- **Authentication**: Login page for user authentication
- **Multi-Role Dashboards**: 
  - Admin Dashboard for system administration
  - Application Owner Dashboard for managing applications
  - Business Owner Dashboard for business operations
  - Reporting Manager Dashboard for manager oversight
- **Application Management**: 
  - View and manage applications with \ApplicationCard\ component
  - Track pending requests and approvals
  - Manage user access and permissions
- **Request Management**: 
  - Raise and track application requests
  - View request status and approvals
- **KPI Tracking**: Performance metrics displayed via \KPICard\ component
- **User Access Control**: Manage and audit user access to modules

### Core Components

#### Dashboard Components
- **AdminDashboard.tsx** - System administration interface
- **ApplicationOwnerDashboard.tsx** - Application owner workspace
- **BusinessOwnerDashboard.tsx** - Business operations dashboard
- **ReportingManagerDashboard.tsx** - Manager oversight dashboard

#### Supporting Components
- **ApplicationCard.tsx** - Displays application information
- **KPICard.tsx** - Key performance indicator display
- **ModuleBadge.tsx** - Module status indicator
- **RaiseRequestModal.tsx** - Modal for creating new requests
- **PendingRequestsTable.tsx** - Displays pending approvals
- **UserAccessTable.tsx** - Shows user access permissions
- **ManageUserAccessPage.tsx** - Manage access control

### Available Scripts

\\\ash
# Development server with hot reload
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview

# Run ESLint for code quality checks
npm run lint
\\\

### Styling

The application uses modular CSS with component-specific stylesheets:
- **index.css** - Global styles and resets
- **App.css** - Main application layout styles
- **LoginPage.css** - Authentication page styles

### TypeScript Configuration

- **tsconfig.json** - Main TypeScript configuration
- **tsconfig.node.json** - TypeScript for Node.js tooling (Vite, etc.)
- **types/dashboard.ts** - Shared dashboard type definitions

## Backend

### Overview

The backend is a Node.js server that handles business logic, data management, and API endpoints for the frontend application.

### Technology Stack

- **Node.js** - Runtime environment
- **JavaScript** - Server-side language
- Check \package.json\ for framework and library details

### Key Features

- **User Authentication** - Handle login and session management
- **Application Management** - CRUD operations for applications
- **Request Processing** - Handle application requests and approvals
- **User Access Management** - Manage permissions and access control
- **Data Persistence** - Manage data storage and retrieval

### Project Structure

- **server.js** - Main server entry point and route configuration
- **data.js** - Data models, business logic, and data access layer
- **package.json** - Dependencies and npm scripts

### Available Scripts

\\\ash
# Start the server
npm start

# Development mode with auto-reload (if configured)
npm run dev
\\\

## Development Workflow

### Frontend Development

1. **Component Development**: Add new components to \src/components/\ with TypeScript
2. **Type Safety**: Define types in \	ypes/dashboard.ts\ for shared types
3. **Styling**: Create modular CSS files alongside components
4. **Code Quality**: Run \
pm run lint\ regularly to maintain code standards
5. **Testing**: Build comprehensive components with proper props typing

### Backend Development

1. **API Design**: Follow RESTful principles for endpoint design
2. **Data Validation**: Validate all incoming data and requests
3. **Error Handling**: Implement comprehensive error responses
4. **CORS Configuration**: Ensure proper cross-origin communication
5. **Data Modeling**: Keep \data.js\ organized with clear separation of concerns

### Best Practices

- **TypeScript**: Always use type definitions for better code maintainability
- **Component Reusability**: Create reusable components to reduce code duplication
- **Modular CSS**: Keep styles close to components for easier maintenance
- **API Communication**: Use consistent request/response formats between frontend and backend
- **Error Handling**: Implement proper error handling and user feedback
- **Code Reviews**: Follow the pull request process for code quality

## Build & Deployment

### Frontend Build

\\\ash
cd frontend
npm run build
\\\

This creates an optimized production build in the \dist/\ directory. The build includes:
- Minified JavaScript and CSS
- Optimized asset loading
- Source map generation for debugging

### Backend Deployment

Ensure all environment variables are configured before deployment.

### Environment Configuration

Create a \.env\ file in the backend directory:

\\\
PORT=3000
NODE_ENV=production
# Add other required variables
\\\

**Important**: Never commit \.env\ files to version control.

### Deployment Steps

1. Build the frontend: \
pm run build\ in the frontend directory
2. Serve the built frontend from the backend or CDN
3. Configure backend environment variables
4. Deploy backend to your hosting platform
5. Update API endpoints if necessary
6. Test all functionality in production environment

## Troubleshooting

### Frontend Issues

| Issue | Solution |
|-------|----------|
| Port already in use | Change the Vite port in config or kill the process using the port |
| Module not found errors | Delete \
ode_modules\ and \package-lock.json\, then run \
pm install\ |
| TypeScript errors | Check \	sconfig.json\ and ensure all imports are correct |
| Hot reload not working | Restart the dev server with \
pm run dev\ |
| CORS errors | Verify backend CORS configuration and ensure it allows frontend origin |

### Backend Issues

| Issue | Solution |
|-------|----------|
| Connection refused | Ensure backend server is running and listening on correct port |
| Undefined data | Check \data.js\ for data initialization and structure |
| Port conflicts | Change the port in configuration or identify process using the port |

## Project Status & Features

### Current Features
- ✅ User authentication with login page
- ✅ Multi-role dashboard system
- ✅ Application management interface
- ✅ Request tracking and management
- ✅ User access control
- ✅ KPI tracking and display
- ✅ TypeScript support for type safety

### Frontend Stack
- React with TypeScript
- Vite for fast development
- Modular component architecture
- CSS for styling

### Backend Stack
- Node.js server
- RESTful API design
- Data management system

## Contributing

1. Create a feature branch from \main\
2. Make your changes following the code style guidelines
3. Test your changes thoroughly
4. Commit with clear, descriptive messages
5. Submit a pull request for review

## Support & Documentation

For detailed information about specific parts of the project:
- Frontend-specific docs: See \rontend/README.md\
- Backend-specific docs: See \ackend/README.md\

---

**Project**: Spring Spartans  
**Repository**: Abdul07in/Spring-spartans  
**Branch**: main  
**Last Updated**: December 5, 2025
