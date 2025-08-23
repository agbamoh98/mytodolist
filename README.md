# 📝 My Todo Management App

A modern, full-stack todo application built with React, TypeScript, Spring Boot, and MySQL.

## 🌐 Live Demo

**Frontend**: [https://mytodolist-beryl-nine.vercel.app](https://mytodolist-beryl-nine.vercel.app)

> **Note**: Currently the backend is running locally. Full deployment coming soon!

## ✨ Features

### 🎯 Core Functionality
- ✅ **User Authentication** - Register, login with JWT tokens
- ✅ **Todo Management** - Add, edit, complete, delete todos
- ✅ **User-Specific Data** - Each user sees only their own todos

### 🚀 Advanced Features
- ✅ **Priority System** - Low, Medium, High, Urgent with color coding
- ✅ **Due Date Tracking** - Set deadlines with overdue warnings
- ✅ **Smart Filtering** - Filter by status (All, Active, Completed)
- ✅ **Priority Filtering** - Filter by priority levels
- ✅ **Search Functionality** - Search todos by title and description
- ✅ **Live Statistics** - Real-time todo counts and progress

### 🎨 Modern UI/UX
- ✅ **Beautiful Design** - Modern gradient backgrounds and glass-morphism
- ✅ **Smooth Animations** - Hover effects and transitions
- ✅ **Responsive Layout** - Works perfectly on desktop and mobile
- ✅ **Professional Styling** - Tailwind CSS with custom components

## 🏗️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **Axios** for API communication
- **Context API** for state management

### Backend
- **Java 21** with Spring Boot 3
- **Spring Security** with JWT authentication
- **Spring Data JPA** for database operations
- **MySQL** database
- **Maven** for dependency management

### Deployment
- **Frontend**: Vercel (automatic deployments from GitHub)
- **Backend**: Coming soon (Railway)
- **Database**: Coming soon (PlanetScale)

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Java 21+
- Maven 3.6+
- MySQL 8.0+

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/agbamoh98/mytodolist.git
   cd mytodolist
   ```

2. **Set up the database**
   ```sql
   CREATE DATABASE tododb;
   ```

3. **Start the backend**
   ```bash
   cd backend/todo-service
   mvn spring-boot:run
   ```

4. **Start the frontend**
   ```bash
   cd frontend/todo-app
   npm install
   npm run dev
   ```

5. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:8081

## 📊 Project Structure

```
mytodolist/
├── backend/
│   └── todo-service/          # Spring Boot application
│       ├── src/main/java/     # Java source code
│       ├── src/main/resources/ # Configuration files
│       └── pom.xml            # Maven dependencies
├── frontend/
│   └── todo-app/              # React application
│       ├── src/               # React components and logic
│       ├── public/            # Static assets
│       └── package.json       # NPM dependencies
└── README.md                  # This file
```

## 🎯 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login

### Todos
- `GET /api/todos` - Get user's todos
- `POST /api/todos` - Create new todo
- `PUT /api/todos/{id}` - Update todo
- `DELETE /api/todos/{id}` - Delete todo
- `PATCH /api/todos/{id}/toggle` - Toggle todo completion

## 🌟 Upcoming Features

- 🌐 **Full Cloud Deployment** - Backend and database in the cloud
- 📱 **Mobile App** - React Native version
- 👥 **Team Collaboration** - Share todos with others
- 🏷️ **Categories & Tags** - Organize todos better
- 📎 **File Attachments** - Add files to todos
- 🌙 **Dark Mode** - Theme switching
- 📧 **Email Notifications** - Reminders for due dates

## 👨‍💻 Author

Built with ❤️ by [agbamoh98](https://github.com/agbamoh98)

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

⭐ **Star this repo** if you found it helpful!
