# Clean App - Express + Prisma v6 + MongoDB

A modern, production-ready Node.js application built with Express.js, Prisma v6 ORM, and MongoDB.

## 🚀 Features

- **Express.js** - Fast, minimalist web framework
- **Prisma v6** - Next-generation ORM with MongoDB support
- **EJS** - Embedded JavaScript templating
- **RESTful API** - Complete CRUD operations for User model
- **Modern UI** - Beautiful dark-themed interface with animations
- **Error Handling** - Comprehensive error handling and validation
- **Environment Configuration** - dotenv for environment variables

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18.0.0 or higher)
- **MongoDB** (running locally or remote instance)
- **npm** or **yarn**

## 🛠️ Installation

1. **Navigate to the project directory:**
   ```bash
   cd WEEK-10/clean-app
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   
   Update the `.env` file with your MongoDB connection string:
   ```env
   DATABASE_URL="mongodb://localhost:27017/cleanapp"
   PORT=3000
   NODE_ENV=development
   ```

4. **Generate Prisma Client:**
   ```bash
   npx prisma generate
   ```

5. **Push the database schema:**
   ```bash
   npx prisma db push
   ```

## 🚀 Running the Application

**Development mode:**
```bash
npm start
```

**With auto-reload (using nodemon):**
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## 📁 Project Structure

```
WEEK-10/clean-app/
├── bin/
│   └── www                  # Server startup script
├── controllers/
│   ├── userController.js    # HTTP request handlers
│   └── README.md            # Controller documentation
├── services/
│   ├── userService.js       # Business logic & DB operations
│   └── README.md            # Service documentation
├── public/
│   ├── images/              # Static images
│   ├── javascripts/         # Client-side JavaScript
│   └── stylesheets/
│       └── style.css        # Application styles
├── routes/
│   ├── index.js             # Homepage routes
│   └── users.js             # User API routes (uses controller)
├── views/
│   ├── error.ejs            # Error page template
│   ├── index.ejs            # Homepage template
│   └── layout.ejs           # Layout template
├── prisma/
│   ├── client.js            # Prisma Client singleton
│   ├── schema.prisma        # Prisma schema
│   └── migrations/          # Database migrations (auto-generated)
├── app.js                   # Express application setup
├── prisma.config.ts         # Prisma v6 configuration
├── package.json             # Dependencies and scripts
├── .env                     # Environment variables
└── README.md                # This file
```

## 🏗️ Architecture Pattern

This application follows the **MVC (Model-View-Controller)** architecture pattern:

### Routes Layer
- Defines HTTP endpoints
- Delegates to controllers
- Minimal logic

### Controllers Layer
- Handles HTTP requests/responses
- Validates input
- Calls service methods
- Returns formatted JSON responses

### Services Layer
- Contains business logic
- Performs database operations
- Reusable across controllers
- No HTTP concerns

### Prisma Client
- Singleton pattern prevents multiple instances
- Configured for development (with logging) and production
- Imported by services only

**Data Flow:**
```
Request → Route → Controller → Service → Prisma Client → Database
                                                             ↓
Response ← Route ← Controller ← Service ← Prisma Client ← Database
```


## 🔌 API Endpoints

### Users API

| Method | Endpoint | Description | Request Body |
|--------|----------|-------------|--------------|
| GET | `/users` | Get all users | - |
| POST | `/users` | Create a new user | `{ name, email }` |
| GET | `/users/:id` | Get user by ID | - |
| PUT | `/users/:id` | Update user | `{ name?, email? }` |
| DELETE | `/users/:id` | Delete user | - |

### Example API Usage

**Create a user:**
```bash
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com"}'
```

**Get all users:**
```bash
curl http://localhost:3000/users
```

**Get user by ID:**
```bash
curl http://localhost:3000/users/YOUR_USER_ID
```

**Update user:**
```bash
curl -X PUT http://localhost:3000/users/YOUR_USER_ID \
  -H "Content-Type: application/json" \
  -d '{"name":"Jane Doe"}'
```

**Delete user:**
```bash
curl -X DELETE http://localhost:3000/users/YOUR_USER_ID
```

## 📊 Database Schema

### User Model

```prisma
model User {
  id        String   @id @default(auto()) @map("_id") @db.ObjectId
  name      String
  email     String   @unique
  createdAt DateTime @default(now())
}
```

## 🎨 Prisma v6 Features

This project uses **Prisma v6** which includes:

- **MongoDB Support** - Native MongoDB integration
- **Modern PrismaClient** - Latest client initialization
- **Environment-based Configuration** - Datasource URL via environment variables
- **Type Safety** - Full TypeScript support
- **Auto-completion** - IntelliSense for queries

### Prisma Commands

```bash
# Generate Prisma Client
npx prisma generate

# Push schema to database (without migrations)
npx prisma db push

# Open Prisma Studio (Database GUI)
npx prisma studio

# Format schema file
npx prisma format

# Validate schema
npx prisma validate
```

## 🔧 Development

### Adding a New Model

1. Update `prisma/schema.prisma`:
   ```prisma
   model Post {
     id        String   @id @default(auto()) @map("_id") @db.ObjectId
     title     String
     content   String
     authorId  String   @db.ObjectId
     author    User     @relation(fields: [authorId], references: [id])
     createdAt DateTime @default(now())
   }
   ```

2. Update the User model to include the relation:
   ```prisma
   model User {
     id        String   @id @default(auto()) @map("_id") @db.ObjectId
     name      String
     email     String   @unique
     posts     Post[]
     createdAt DateTime @default(now())
   }
   ```

3. Regenerate Prisma Client:
   ```bash
   npx prisma generate
   npx prisma db push
   ```

## 🎨 Styling

The application uses a modern dark theme with:
- Gradient backgrounds
- Smooth animations
- Glassmorphism effects
- Responsive design
- Hover effects and micro-interactions

## 🐛 Error Handling

The application includes comprehensive error handling:
- Validation errors (400)
- Not found errors (404)
- Duplicate email errors (409)
- Server errors (500)
- Stack traces in development mode

## 📝 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | MongoDB connection string | `mongodb://localhost:27017/cleanapp` |
| `PORT` | Server port | `3000` |
| `NODE_ENV` | Environment mode | `development` |

## 🚢 Deployment

### MongoDB Atlas Setup

1. Create a free cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Get your connection string
3. Update `.env`:
   ```env
   DATABASE_URL="mongodb+srv://username:password@cluster.mongodb.net/cleanapp"
   ```

### Production Build

1. Set environment to production:
   ```env
   NODE_ENV=production
   ```

2. Ensure all dependencies are installed:
   ```bash
   npm ci --production
   ```

3. Start the server:
   ```bash
   npm start
   ```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Express.js team
- Prisma team
- MongoDB team

---

**Built with ❤️ using Express + Prisma v6 + MongoDB**
