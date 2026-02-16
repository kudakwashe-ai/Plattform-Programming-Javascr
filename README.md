# 🎬 Movie Search App

A full-stack movie discovery application built with Node.js, Express, Prisma, and MongoDB. Features include user authentication, role-based access control, personalized watchlists, movie reviews, and admin dashboard.

## ✨ Features

### Public Features
- 🔍 Search movies and TV shows (powered by TMDB)
- 📊 Browse trending content
- 🎬 View movie details, trailers, and watch providers
- 📖 Read user reviews

### Premium Features (Requires Authentication)
- ⭐ Add movies to favorites
- 📝 Create and manage watchlists
- ✍️ Write and edit reviews
- ⚡ Rate movies and TV shows

### Admin Features
- 👥 User management (CRUD operations)
- 🔐 Role assignment (FREE, PREMIUM, ADMIN)
- 📈 Application analytics and statistics
- 🔒 Account activation/deactivation

## 🚀 Tech Stack

### Backend
- **Node.js** & **Express** - Server framework
- **Prisma ORM** - Database management
- **MongoDB** - Primary database
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Joi** - Input validation

### Security & Middleware
- **Helmet** - Security headers
- **Express Rate Limit** - DDoS protection
- **CORS** - Cross-origin resource sharing
- **Morgan** - HTTP request logging

### Testing
- **Jest** - Testing framework
- **Supertest** - API integration testing

### External APIs
- **TMDB API** - Movie and TV show data

## 📋 Prerequisites

- Node.js (v16+)
- MongoDB (Atlas or local)
- TMDB API Key ([Get one here](https://www.themoviedb.org/settings/api))

## ⚡ Quick Start

### 1. Clone and Install
```bash
git clone <repository-url>
cd movieAPP
npm install
```

### 2. Environment Setup
```bash
cp .env.example .env
```

Edit `.env` with your credentials:
```env
DATABASE_URL="mongodb+srv://username:password@cluster.mongodb.net/movie_app"
TMDB_API_KEY=your_tmdb_api_key
JWT_SECRET=your_secure_secret_key
```

### 3. Database Setup
```bash
# Generate Prisma Client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# Seed database with test users
npm run prisma:seed
```

### 4. Start Server
```bash
# Development
npm run dev

# Production
npm start
```

Server runs at `http://localhost:3000`

## 🧪 Testing

```bash
# Run all tests
npm test

# Run unit tests only
npm run test:unit

# Run integration tests only
npm run test:integration

# Generate coverage report
npm run test:coverage
```

## 📚 Documentation

- [API Documentation](./API_DOCUMENTATION.md) - Complete API reference
- [Database Setup](./DATABASE_SETUP.md) - Detailed database configuration

## 👤 Test Users

After running `npm run prisma:seed`:

| Role    | Email                    | Password    |
|---------|--------------------------|-------------|
| Admin   | admin@movieapp.com       | Admin@123   |
| Premium | premium@movieapp.com     | Premium@123 |
| Free    | free@movieapp.com        | Free@123    |

## 🔑 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout

### Movies (Public)
- `GET /api/movies/search` - Search movies
- `GET /api/movies/trending` - Get trending content
- `GET /api/movies/details/:id` - Get movie details

### User Features (Premium+)
- `GET /api/users/watchlist` - Get watchlist
- `POST /api/users/favorites` - Add to favorites
- `POST /api/reviews` - Create review

### Admin (Admin Only)
- `GET /api/admin/users` - List all users
- `PUT /api/admin/users/:id/role` - Update user role
- `GET /api/admin/stats` - Get statistics

*See [API Documentation](./API_DOCUMENTATION.md) for complete endpoint list*

## 📁 Project Structure

```
movieAPP/
├── config/          # Database and app configuration
├── controllers/     # Request handlers
├── middleware/      # Auth, validation, error handling
├── prisma/          # Database schema and migrations
├── routes/          # API route definitions
├── services/        # Business logic layer
├── tests/           # Unit and integration tests
├── utils/           # Helper functions and utilities
├── app.js           # Express app setup
└── package.json     # Dependencies and scripts
```

## 🏗️ Architecture

### Clean Architecture Principles
- **Controllers**: Handle HTTP requests and responses
- **Services**: Contain business logic
- **Middleware**: Authentication, validation, error handling
- **Routes**: Define API endpoints
- **Prisma**: Database access layer

### Security Features
- ✅ JWT-based authentication
- ✅ Password hashing with bcrypt
- ✅ Role-based access control (RBAC)
- ✅ Request rate limiting
- ✅ Security headers (Helmet)
- ✅ Input validation (Joi)
- ✅ SQL injection protection (Prisma)

## 🔐 User Roles

| Role    | Permissions |
|---------|-------------|
| **FREE**    | Search movies, view details, read reviews |
| **PREMIUM** | All FREE permissions + watchlist, favorites, write reviews |
| **ADMIN**   | All PREMIUM permissions + user management, analytics |

## 📝 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- [TMDB](https://www.themoviedb.org/) for the amazing movie database API
- [Prisma](https://www.prisma.io/) for the excellent ORM

---

**Built with ❤️ following best practices from Meta, Google, and Anthropic**
