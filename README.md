# Pet Adoption System

Pet Adoption System is a full-stack web application that helps users browse pets available for adoption, adopt pets, and manage adoption data. The system includes authentication, role-based access (admin/user), pet management, and a clean user interface.

Admins can create, update, and delete pets. Regular users can view pets and adopt them.

## Features
- User registration and login
- JWT authentication
- Role-based access (Admin / User)
- Pet listing and filtering
- Adopt pet functionality
- Admin CRUD operations
- Secure password hashing
- Clean UI design
- Google Maps location section
- Partners section

## Technologies

**Backend:**
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT (JSON Web Token)
- bcrypt
- dotenv
- express-validator

**Frontend:**
- HTML
- CSS
- JavaScript
- Axios (if used)

**Other Tools:**
- Git & GitHub
- Postman (API testing)

## Setup

1. Clone repository
   ```bash
   git clone <repository_url>
   cd pet-adoption-system
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Environment variables

   Create a `.env` file in the root directory with:
   ```
   PORT=4000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   ```

4. Start the server
   ```bash
   npm start
   ```

## API Documentation

### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`

### Users (Protected)
- `GET /api/users/profile`
- `PUT /api/users/profile`

### Pets
**Admin only:**
- `POST /api/pets`
- `PUT /api/pets/:id`
- `DELETE /api/pets/:id`

**Public / User:**
- `GET /api/pets`
- `GET /api/pets/:id`
- `PUT /api/pets/:id/adopt`

## Validation & Error Handling

- Input validation is enforced using middleware to ensure request bodies and parameters meet required formats.
- Standard HTTP status codes are used to communicate errors:
  - 400 Bad Request
  - 401 Unauthorized
  - 403 Forbidden
  - 404 Not Found
  - 500 Server Error
- A global error-handling middleware provides consistent error responses across the API.

## Deployment

This project can be deployed using platforms such as Render, Railway, or similar services. Environment variables must be configured in the deployment platform.

## Screenshots

### 1. Home Page
![alt text](<Снимок экрана 2026-02-08 223325.png>)


### 2. Pet Card Component
![alt text](<Снимок экрана 2026-02-08 223537.png>)

### 3. Adopt Button (Before Adoption)
![alt text](<Снимок экрана 2026-02-08 223615.png>)

### 4. Login Page
![alt text](<Снимок экрана 2026-02-08 223803.png>)

### 5. Register Page
![alt text](<Снимок экрана 2026-02-08 223840.png>)

### 6. User Profile Page
![alt text](<Снимок экрана 2026-02-08 223949.png>)

### 7. Admin Dashboard
![alt text](<Снимок экрана 2026-02-08 223254.png>)

### 8. Create Pet (Admin)
![alt text](<Снимок экрана 2026-02-08 224026.png>)
![alt text](<Снимок экрана 2026-02-08 224735.png>)


### 9. Google Maps Location Section
![alt text](<Снимок экрана 2026-02-08 224110.png>)

### 10. MongoDB Database (User Collection)
![alt text](<Снимок экрана 2026-02-08 224225.png>)

### 11. MongoDB Database (Pets Collection)
![alt text](<Снимок экрана 2026-02-08 224140.png>)

### 12. Register User
![alt text](<Снимок экрана 2026-02-08 225951.png>)

### 13. Login User
![alt text](<Снимок экрана 2026-02-08 230551.png>)


This project was developed for educational purposes and demonstrates full-stack web development concepts including authentication, REST APIs, database design, and role-based access control.
