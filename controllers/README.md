# Clean App - MVC Architecture

This directory contains the controllers for the application.

## Structure

Controllers handle HTTP requests and responses. They:
- Receive requests from routes
- Validate input data
- Call appropriate service methods
- Return formatted responses
- Handle errors appropriately

## Controllers

### UserController
- `getAllUsers()` - GET /users
- `getUserById(id)` - GET /users/:id
- `createUser(data)` - POST /users
- `updateUser(id, data)` - PUT /users/:id
- `deleteUser(id)` - DELETE /users/:id

## Usage

Controllers are imported in route files and used as middleware:

```javascript
const userController = require('../controllers/userController');
router.get('/', userController.getAllUsers.bind(userController));
```
