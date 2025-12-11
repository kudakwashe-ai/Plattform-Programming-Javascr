# Clean App - Services Layer

This directory contains the service layer for the application.

## Structure

Services handle business logic and database operations. They:
- Interact with Prisma Client
- Perform database queries
- Contain business logic
- Are called by controllers
- Return data or throw errors

## Services

### UserService
Handles all User model database operations:
- `getAllUsers()` - Fetch all users
- `getUserById(id)` - Fetch user by ID
- `createUser(data)` - Create new user
- `updateUser(id, data)` - Update existing user
- `deleteUser(id)` - Delete user
- `emailExists(email)` - Check if email exists

## Usage

Services are imported in controllers:

```javascript
const userService = require('../services/userService');
const users = await userService.getAllUsers();
```

## Benefits

- **Separation of Concerns**: Business logic separate from HTTP handling
- **Reusability**: Services can be used by multiple controllers
- **Testability**: Easy to unit test business logic
- **Maintainability**: Changes to business logic don't affect routes
