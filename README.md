# Blog Application

## Live Demo

- **Website (frontend):** https://poojasri-blog-app.onrender.com
- **Backend API:** https://blogapplication-hec0.onrender.com
- **Example API:** https://blogapplication-hec0.onrender.com/api/blogs

> The backend uses Render's free plan, so the first request after a period of inactivity can take up to about a minute.

## About the Project

The Blog Application is a responsive full-stack web application that allows users to register, log in, create blog posts, and view published blogs.

The application uses a frontend built with HTML, CSS, and JavaScript, connected to a backend developed using Node.js and Express.js. All users and blog posts are stored permanently in a MongoDB Atlas cloud database using Mongoose. JWT authentication is used to secure blog creation, and bcrypt.js is used for password hashing.

## Features

### Frontend
- Responsive home page.
- User registration and login pages.
- Dashboard to view published blogs.
- Blog details page to read a single blog.
- Edit and delete buttons (shown only to the blog's author).
- Search blogs by title or content.
- Blog categories with a category filter on the dashboard.
- Private pages (Dashboard, Create Blog, Profile) that require login.
- Dashboard shows only the logged-in user's blogs; Home shows all blogs.
- User profile page (name, email, joined date, number of blogs).
- Logout, and a navigation menu that changes based on login status.
- Automatic logout when the login session (JWT) expires.
- Create and publish new blog posts.
- User-friendly interface.
- Integration with backend APIs.

### Backend
- User registration and login APIs.
- Password hashing using bcrypt.js.
- JWT-based authentication.
- Protected blog creation endpoint.
- API to retrieve all blog posts, with optional search and category filters.
- API to retrieve a single blog by ID.
- Update and delete APIs (only the blog's author can change it).
- Shared JWT authentication middleware.
- API to get only the logged-in user's blogs.
- Profile API for the logged-in user (password is never returned).
- MongoDB Atlas database with Mongoose models (User, Blog).
- Secrets stored in environment variables (.env).
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
- dotenv

### Database
- MongoDB Atlas
- Mongoose

## Project Structure

```text
BlogApplication/
│
├── index.html
├── login.html
├── register.html
├── dashboard.html
├── create.html
├── blog-details.html
├── profile.html
├── styles.css
├── app.js
├── README.md
├── .gitignore
│
└── backend/
    ├── config/
    │   └── db.js
    │
    ├── middleware/
    │   └── auth.js
    │
    ├── models/
    │   ├── User.js
    │   └── Blog.js
    │
    ├── controllers/
    │   ├── authController.js
    │   └── blogController.js
    │
    ├── routes/
    │   ├── authRoutes.js
    │   └── blogRoutes.js
    │
    ├── server.js
    ├── .env            (not uploaded to GitHub)
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

### 4. Create the .env File

Inside the `backend` folder, create a file named `.env`:

```text
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@<cluster-address>/blogapp?retryWrites=true&w=majority
JWT_SECRET=your_secret_key
```

Replace the values with your own MongoDB Atlas details. This file is listed in `.gitignore` and is never uploaded to GitHub.

### 5. Start the Backend Server

Run:

```bash
node server.js
```

The backend server will start at:

```text
http://localhost:5000
```

You should also see `MongoDB connected successfully!` in the terminal.

### 6. Run the Frontend

Open `index.html` in your browser (or use the VS Code Live Server extension).

The frontend communicates with the backend running at `http://localhost:5000`.

## API Endpoints

| Method | Endpoint | Description | Authentication |
|---|---|---|---|
| GET | `/` | Check backend server status | Not required |
| GET | `/api/test` | Test backend API | Not required |
| POST | `/api/auth/register` | Register a new user | Not required |
| POST | `/api/auth/login` | Log in an existing user | Not required |
| GET | `/api/auth/me` | Get the logged-in user's profile | JWT required |
| GET | `/api/blogs` | Retrieve all blogs (optional `?search=` and `?category=`) | Not required |
| GET | `/api/blogs/my` | Retrieve only the logged-in user's blogs | JWT required |
| POST | `/api/blogs` | Create a new blog | JWT required |
| GET | `/api/blogs/:id` | Retrieve a single blog by ID | Not required |
| PUT | `/api/blogs/:id` | Update a blog (author only) | JWT required |
| DELETE | `/api/blogs/:id` | Delete a blog (author only) | JWT required |

Available blog categories: General, Technology, Travel, Food, Lifestyle, Education, Health.

## Authentication

- User passwords are hashed using bcrypt.js before storage.
- Successful login generates a JWT token.
- The frontend stores the authentication token in browser Local Storage.
- Protected blog creation requests include the JWT token in the Authorization header.
- Users without a valid token cannot create blog posts.
- The token expires after 1 hour; the website then logs the user out automatically.
- Dashboard, Create Blog and Profile pages redirect to Login when the user is not logged in.
- Logout removes the token and user details from Local Storage.

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
- MongoDB Atlas connection.
- Users and blogs saved in MongoDB.
- Duplicate email registration is rejected.
- Passwords stored as bcrypt hashes in the database.
- Retrieving a single blog by ID.
- Invalid blog ID returns "Blog not found".
- Blog details page in the browser.
- Full website flow: register, login, create blog, view dashboard, view blog details.
- Editing a blog from the website (author only).
- Deleting a blog from the website (author only).
- Edit and delete buttons hidden for blogs written by other users.
- Creating blogs with categories.
- Searching blogs and filtering by category.
- Dashboard shows only the logged-in user's blogs.
- Profile page shows the correct user details and blog count.
- Logout clears the session and updates the menu.
- Private pages redirect to Login when the user is not logged in.

## Current Limitations

- The backend must be running locally for frontend API requests to work.
- The application is currently configured for local development.

## Future Enhancements

- Edit profile details and change password.

## Author

**Poojasri I S**

GitHub: [poojasrichezhian](https://github.com/poojasrichezhian)