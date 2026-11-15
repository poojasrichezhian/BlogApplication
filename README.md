# Blog Application

## About the Project

The Blog Application is a responsive full-stack web application that allows users to register, log in, create blog posts, and view published blogs.

The application uses a frontend built with HTML, CSS, and JavaScript, connected to a backend developed using Node.js and Express.js. JWT authentication is used to secure blog creation, and bcrypt.js is used for password hashing.

## Features

### Frontend
- Responsive home page.
- User registration and login pages.
- Dashboard to view published blogs.
- Create and publish new blog posts.
- User-friendly interface.
- Integration with backend APIs.

### Backend
- User registration and login APIs.
- Password hashing using bcrypt.js.
- JWT-based authentication.
- Protected blog creation endpoint.
- API to retrieve all blog posts.
- Input validation and error handling.

## Technologies Used

### Frontend
- HTML5
- CSS3
- JavaScript
- Browser Local Storage

### Backend
- Node.js
- Express.js
- bcrypt.js
- JSON Web Token (JWT)
- CORS

## Project Structure

```text
BlogApplication/
│
├── index.html
├── login.html
├── register.html
├── dashboard.html
├── create.html
├── styles.css
├── app.js
├── README.md
├── .gitignore
│
└── backend/
    ├── controllers/
    │   ├── authController.js
    │   └── blogController.js
    │
    ├── routes/
    │   ├── authRoutes.js
    │   └── blogRoutes.js
    │
    ├── server.js
    ├── package.json
    └── package-lock.json
```

## Installation and Setup

### 1. Clone the Repository

```bash
git clone https://github.com/poojasrichezhian/BlogApplication.git
```

### 2. Open the Project

Open the cloned project folder in Visual Studio Code.

### 3. Install Backend Dependencies

Open the terminal and navigate to the backend folder:

```bash
cd backend
```

Install the required dependencies:

```bash
npm install
```

### 4. Start the Backend Server

Run:

```bash
node server.js
```

The backend server will start at:

```text
http://localhost:5000
```

### 5. Run the Frontend

Open the project folder in VS Code and launch `index.html` using the Live Server extension.

The frontend communicates with the backend running at `http://localhost:5000`.

## API Endpoints

| Method | Endpoint | Description | Authentication |
|---|---|---|---|
| GET | `/` | Check backend server status | Not required |
| GET | `/api/test` | Test backend API | Not required |
| POST | `/api/auth/register` | Register a new user | Not required |
| POST | `/api/auth/login` | Log in an existing user | Not required |
| GET | `/api/blogs` | Retrieve all blogs | Not required |
| POST | `/api/blogs` | Create a new blog | JWT required |

## Authentication

- User passwords are hashed using bcrypt.js before storage.
- Successful login generates a JWT token.
- The frontend stores the authentication token in browser Local Storage.
- Protected blog creation requests include the JWT token in the Authorization header.
- Users without a valid token cannot create blog posts.

## Testing

The following functionalities have been tested successfully:

- Backend server startup.
- User registration.
- User login.
- Password hashing.
- JWT token generation.
- Blog creation with authentication.
- Retrieving all blog posts.
- Frontend and backend integration.
- Protected blog creation without authentication.

## Current Limitations

- User and blog data are temporarily stored in server-side arrays.
- Data is lost when the backend server restarts.
- A permanent database has not yet been integrated.
- The backend must be running locally for frontend API requests to work.
- The application is currently configured for local development.

## Future Enhancements

- MongoDB database integration for permanent data storage.
- Complete CRUD operations, including edit and delete.
- User profile management.
- Logout functionality.
- Improved security using environment variables.
- Deployment of the frontend and backend.

## Author

**Poojasri I S**

GitHub: [poojasrichezhian](https://github.com/poojasrichezhian)