# Changelog

All notable changes to this project will be documented in this file.

---

## v1.0.0-dev — Sprint 1

### Added

#### Project Setup

- Initialized npm workspace monorepo
- Configured React, Vite, and TypeScript
- Configured Express, Prisma, and SQLite
- Configured Tailwind CSS v4
- Configured shadcn/ui

#### Authentication

- Implemented JWT authentication
- Implemented password hashing using bcrypt
- Added login endpoint
- Added `GET /api/v1/auth/me` endpoint
- Added authentication middleware

#### Authorization

- Implemented Role-Based Access Control (RBAC)
- Added permission authorization middleware
- Added role repository
- Added permission repository
- Added permission service

#### Database

- Created Prisma schema
- Implemented database seed
- Seeded Super Admin role
- Seeded default permissions
- Seeded administrator account

#### Core

- Added global error handler
- Added request validation using Zod
- Added Express type augmentation

---

## v1.1.0-dev — Sprint 2

### Added

#### Core Infrastructure

- Added standardized API response helper
- Added environment variable validation
- Added centralized logging with Pino
- Added request logging middleware
- Added pagination helper
- Added pagination metadata helper
- Added search helper
- Added base service abstraction

#### Shared Package

- Added shared package structure
- Added shared API response types
- Added shared pagination types
- Added shared constants
- Added shared enums
- Added shared Zod schemas

### Changed

#### Architecture

- Refactored environment configuration
- Improved logging architecture
- Improved backend project structure
- Improved code organization for scalability

---

## v1.2.0-dev — Sprint 3

### Added

#### User Management

- Implemented complete User module
- Added User repository
- Added User service
- Added User controller
- Added User routes
- Added User DTOs and type definitions
- Added User mapper
- Added User validation using Zod

#### User Features

- Added user listing endpoint
- Added user detail endpoint
- Added user creation endpoint
- Added user update endpoint
- Added user deletion endpoint
- Added pagination, searching, and sorting support

### Changed

#### Architecture

- Refactored User module using Repository pattern
- Centralized response handling
- Centralized application messages
- Improved service layer organization
- Improved controller response consistency
- Improved password handling abstraction

### Security

- Prevented duplicate email addresses
- Prevented self-account deletion
- Improved request validation
- Improved authorization checks
- Removed password from API responses

---

## v1.3.0-dev — Sprint 4

### Added

#### Class Management

- Added SchoolClass Prisma model
- Implemented Class Repository
- Implemented Class Service
- Added Class Controller
- Added Class Routes
- Added Zod validation schemas
- Added Class response mapper
- Added CRUD endpoints
- Added pagination support
- Added search support

### Security

- Added RBAC authorization for class endpoints
- Added authentication protection

### Testing

- Validated CRUD operations
- Tested pagination and search
- Tested request validation
- Tested duplicate class handling
- Tested authorization and authentication
