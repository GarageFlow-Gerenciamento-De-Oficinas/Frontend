# GarageFlow — Frontend

Frontend application for **GarageFlow**, a workshop management system designed for **Oficina Mecânica Avenida**.

The application provides the user interface for managing workshop operations through a centralized platform, replacing fragmented workflows based on paper records, messaging applications, and spreadsheets.

GarageFlow is being developed as a portfolio project with a focus on maintainable architecture, reliable API integration, authentication, automated testing, and incremental product development.

---

## About the Project

The frontend is responsible for the user-facing experience of GarageFlow and communicates with the backend through a REST API.

The application is built with React and TypeScript, following a component-based architecture.

Current functionality includes:

- User authentication
- Protected and public routes
- User management interface
- API communication
- Automatic access token renewal

The frontend is maintained as an independent application, allowing it to evolve separately from the backend.

---

## Architecture

GarageFlow uses a separate frontend and backend architecture.

```text
┌──────────────────────────────┐
│       React + TypeScript     │
│           Frontend           │
└──────────────┬───────────────┘
               │
               │ HTTP / JSON
               ▼
┌──────────────────────────────┐
│       Django REST Framework  │
│            Backend           │
└──────────────┬───────────────┘
               │
               │ Django ORM
               ▼
┌──────────────────────────────┐
│          PostgreSQL          │
└──────────────────────────────┘
```

The frontend follows a modular structure, separating application routing, components, contexts, layouts, pages, services, styles, and shared types.

API communication is centralized through service modules to avoid duplicating request and authentication logic throughout the application.

---

## Technology Stack

### Core

- React 19
- TypeScript
- Vite
- React Router

### Styling

- Sass

### Testing

- Vitest
- React Testing Library
- Mock Service Worker (MSW)
- jsdom

### Development and Quality

- Node.js 22
- npm
- ESLint
- Docker
- Docker Compose
- Git

---

## Project Structure

The frontend follows a feature-oriented structure with shared application infrastructure.

```text
src/
├── app/
│   └── AppRouter.tsx
│
├── components/
│   ├── Header/
│   ├── Sidebar/
│   ├── cards/
│   ├── ProtectedRoute/
│   └── PublicRoute/
│
├── contexts/
│   └── AuthContext/
│
├── layouts/
│   └── DashboardLayout/
│
├── pages/
│   ├── HomePage/
│   ├── LoginPage/
│   └── Users/
│
├── services/
│   ├── apiService.ts
│   ├── authService.ts
│   └── usersService.ts
│
├── styles/
│
├── test/
│
└── types/
```

### Main Responsibilities

| Directory | Responsibility |
|---|---|
| `app/` | Application routing and configuration |
| `components/` | Reusable interface components |
| `contexts/` | Shared application state |
| `layouts/` | Page layout structures |
| `pages/` | Application screens |
| `services/` | API communication and application services |
| `styles/` | Global and shared styling |
| `test/` | Test configuration and shared testing utilities |
| `types/` | Shared TypeScript definitions |

---

## Requirements

To run the frontend locally, you need:

- Node.js 22 or later
- npm
- Git

Docker and Docker Compose are optional when using the containerized development environment.

---

## Environment Configuration

The frontend uses environment variables provided by Vite.

Create a `.env` file in the frontend project root:

```env
VITE_API_URL=http://localhost:8000/api
```

`VITE_API_URL` defines the base URL used by the frontend to communicate with the backend.

Vite automatically loads environment variables from `.env` files.

Only variables prefixed with `VITE_` are exposed to the frontend application. Never store secrets or private credentials in frontend environment variables.

---

## Running Locally

Clone the repository and navigate to the frontend directory:

```bash
git clone <repository-url>
cd garageflow/frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The frontend will be available at:

```text
http://localhost:5173
```

---

## Running with Docker

The frontend includes a Docker-based development environment.

Build and start the application:

```bash
docker compose up --build
```

Run in detached mode:

```bash
docker compose up -d --build
```

Stop the containers:

```bash
docker compose down
```

The development server is exposed on port `5173`.

The Docker configuration uses a bind mount for the application source code and a named volume for `node_modules`, allowing development changes to be reflected without rebuilding the image for every source modification.

---

## Authentication

GarageFlow uses JWT-based authentication through the Django backend.

The frontend implements a token management strategy that separates access token storage from refresh token storage.

### Token Storage

| Token | Storage |
|---|---|
| Access token | `sessionStorage` |
| Refresh token | HttpOnly cookie managed by the backend |

The access token is stored in the browser session and is removed when the local authentication state is cleared.

The refresh token is stored in an HttpOnly cookie named `garageflow_refresh`. It is not directly accessible through JavaScript.

### Login Flow

The authentication process is handled by `authService.ts`.

The login flow is:

1. The frontend requests a CSRF token from the backend.
2. The user submits their email and password.
3. The frontend sends the credentials and CSRF token to the login endpoint.
4. The backend validates the credentials.
5. The backend returns an access token in the response body.
6. The backend stores the refresh token in an HttpOnly cookie.
7. The frontend stores the access token in `sessionStorage`.

### Automatic Access Token Renewal

API communication is centralized through `apiService.ts`.

When an authenticated request receives a `401 Unauthorized` response, the frontend attempts to obtain a new access token using the refresh token cookie.

The process is:

1. An authenticated request receives a `401` response.
2. The frontend checks whether another request has already renewed the access token.
3. If a renewal is already in progress, the request waits for the shared Promise.
4. Otherwise, the frontend requests a new access token.
5. The new access token is stored in `sessionStorage`.
6. The original request is retried using the new token.

A shared Promise prevents multiple simultaneous requests from triggering independent token refresh operations.

If token renewal fails, the local authentication data is cleared.

### CSRF and Cookie Handling

Authentication requests use `credentials: "include"` to allow the browser to send and receive cookies.

The frontend obtains the CSRF token through:

`GET /api/auth/csrf/`

The token is then sent through the `X-CSRFToken` request header for protected authentication operations.

### Route Protection

The application uses dedicated route components:

- `ProtectedRoute` restricts access to authenticated application areas.
- `PublicRoute` handles routes intended for unauthenticated users.

Authentication state is managed through the application authentication context.

---

## API Communication

API communication is centralized through the service layer.

### apiService.ts

Responsible for:

- Building API requests.
- Setting request headers.
- Attaching the access token to authenticated requests.
- Handling unauthorized responses.
- Refreshing expired access tokens.
- Retrying requests after successful renewal.
- Managing concurrent token refresh operations.

### authService.ts

Responsible for:

- User login.
- Access token storage.
- Access token retrieval.
- Local authentication cleanup.
- CSRF token retrieval.
- Access token renewal.
- Logout requests.

### usersService.ts

Responsible for communication with user management endpoints.

This separation keeps API-related responsibilities outside the presentation components and makes the application easier to maintain and test.

---

## Testing

The frontend uses an automated testing stack composed of:

- Vitest
- React Testing Library
- Mock Service Worker (MSW)
- jsdom

Tests cover application behavior, authentication, API communication, and protected routing.

Current tested areas include:

- Authentication context
- API service
- Authentication service
- Login page
- Protected routes
- Public routes

### Running Tests

Run tests:

```bash
npm run test
```

Run tests with the interactive UI:

```bash
npm run test:ui
```

Run tests once:

```bash
npm run test:run
```

Mock Service Worker is used to intercept API requests during tests, allowing frontend behavior to be validated without depending on a running backend.

---

## Code Quality and Build

The project uses ESLint for code quality checks.

Run linting:

```bash
npm run lint
```

Create a production build:

```bash
npm run build
```

The build command runs TypeScript project checks before generating the production assets with Vite.

The generated application files are placed in the `dist/` directory.

Preview the production build locally:

```bash
npm run preview
```

---

## Backend Integration

The frontend communicates with the GarageFlow backend through its REST API.

By default, local development uses:

| Application | URL |
|---|---|
| Frontend | `http://localhost:5173` |
| Backend | `http://localhost:8000` |
| Swagger UI | `http://localhost:8000/api/docs/` |

The backend URL can be changed through the `VITE_API_URL` environment variable.

The backend must also allow the frontend origin through its CORS configuration and support credentialed requests for cookie-based authentication.

For backend setup, API documentation, and business rules, refer to the backend README.

---

## Development Roadmap

### Foundation

- [x] React application
- [x] TypeScript configuration
- [x] Vite development environment
- [x] Application routing
- [x] Shared component structure
- [x] Docker development environment

### Authentication

- [x] Login interface
- [x] Authentication context
- [x] Access token storage
- [x] HttpOnly refresh cookie integration
- [x] CSRF integration
- [x] Automatic access token renewal
- [x] Concurrent refresh handling
- [x] Protected routes
- [x] Public routes

### User Management

- [x] User management interface
- [x] User service integration

### Customers and Vehicles

- [ ] Customer management interface
- [ ] Vehicle management interface

### Service Orders

- [ ] Service Order workflow
- [ ] Quote management
- [ ] Service execution interface
- [ ] Testing workflow
- [ ] Vehicle delivery workflow

### Inventory

- [ ] Inventory management
- [ ] Stock visualization
- [ ] Parts reservation interface

### Finance

- [ ] Payment management
- [ ] Financial adjustments
- [ ] Balance visualization

### Quality and Delivery

- [x] Automated tests
- [x] ESLint configuration
- [x] Production build configuration
- [ ] Frontend CI/CD pipeline
- [ ] Automated deployment

---

## Documentation

The frontend README documents the application architecture, development environment, authentication strategy, API integration, testing, and development workflow.

The backend README contains the backend architecture, domain rules, API endpoints, database configuration, and backend development instructions.

Both documents are maintained separately to keep the responsibilities of each application clear.

---

## Development

GarageFlow is being developed by **Jean França** as a portfolio and software engineering project.

The frontend is intended to demonstrate:

- Component-based application architecture
- Type-safe development with TypeScript
- API integration
- Authentication and route protection
- Secure token handling
- Automated access token renewal
- Concurrent request handling
- Automated frontend testing
- Maintainable application structure
- Incremental product development