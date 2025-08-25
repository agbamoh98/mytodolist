# 📝 My Todo Management App

A modern, full-stack todo application built with React, TypeScript, Spring Boot, and MySQL, fully deployed and production-ready.

## 🌐 Live Demo

**Frontend**: [https://mytodolist-beryl-nine.vercel.app](https://mytodolist-beryl-nine.vercel.app)
**Backend API**: [https://mytodolist-production.up.railway.app](https://mytodolist-production.up.railway.app)

> **✅ Status**: Fully deployed and production-ready! Both frontend and backend are live in the cloud.

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
- **Java 21** with Spring Boot 3.1.8
- **Spring Security** with JWT authentication
- **Spring Data JPA** for database operations
- **MySQL** database with HikariCP connection pooling
- **Maven** for dependency management

### Deployment & Infrastructure
- **Frontend**: Vercel (automatic deployments from GitHub)
- **Backend**: Railway (automatic deployments from GitHub)
- **Database**: Railway MySQL (persistent, production-ready)
- **CI/CD**: GitHub → Vercel + Railway (fully automated)

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Java 21+
- Maven 3.6+
- MySQL 8.0+ (for local development)

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/agbamoh98/mytodolist.git
   cd mytodolist
   ```

2. **Set up the database**
   ```bash
   # Using Docker (recommended)
   docker-compose up -d
   
   # Or manually create MySQL database
   CREATE DATABASE tododb;
   ```

3. **Start the backend**
   ```bash
   cd backend/todo-service
   mvn spring-boot:run -Dspring.profiles.active=dev
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

### Production Deployment

The application is automatically deployed to production:

- **Frontend**: Automatically deploys to Vercel on every push to main branch
- **Backend**: Automatically deploys to Railway on every push to main branch
- **Database**: Railway MySQL with persistent data storage

## 📊 Project Structure

```
mytodolist/
├── backend/
│   ├── docker-compose.yml     # Local MySQL setup
│   └── todo-service/          # Spring Boot application
│       ├── src/main/java/     # Java source code
│       ├── src/main/resources/ # Configuration files
│       │   ├── application.yml        # Global config
│       │   ├── application-dev.yml    # Development profile
│       │   └── application-prod.yml   # Production profile (Railway)
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

### Health Check
- `GET /actuator/health` - Application health status

## 🔧 Configuration Profiles

### Development Profile (`dev`)
- **Database**: Local MySQL (localhost:3306)
- **Port**: 8081
- **DDL**: `update` (preserves data)
- **Logging**: SQL queries visible

### Production Profile (`prod`)
- **Database**: Railway MySQL (cloud)
- **Port**: Railway auto-assigned
- **DDL**: `update` (preserves data between deployments)
- **Logging**: Production-optimized
- **SSL**: Required for security

## 🚀 Deployment Features

### ✅ **Fully Automated CI/CD**
- **GitHub push** → **Automatic deployment** to both platforms
- **No manual intervention** required
- **Rollback capability** through Railway and Vercel dashboards

### ✅ **Data Persistence**
- **Database tables preserved** between deployments
- **User data maintained** across updates
- **No data loss** during backend updates

### ✅ **Production Ready**
- **SSL encryption** for all connections
- **Connection pooling** with HikariCP
- **JWT authentication** with secure tokens
- **Environment-based** configuration

## 🌟 Recent Achievements

- ✅ **Full Cloud Deployment** - Backend and database successfully deployed
- ✅ **Data Persistence** - Database tables and data preserved between deployments
- ✅ **Automated Deployments** - Zero-downtime updates from GitHub
- ✅ **Production Security** - SSL, JWT, and secure database connections

## 🔮 Future Enhancements

- 📱 **Mobile App** - React Native version
- 👥 **Team Collaboration** - Share todos with others
- 🏷️ **Categories & Tags** - Organize todos better
- 📎 **File Attachments** - Add files to todos
- 🌙 **Dark Mode** - Theme switching
- 📧 **Email Notifications** - Reminders for due dates
- 📊 **Advanced Analytics** - User productivity insights

## 👨‍💻 Author

Built with ❤️ by [agbamoh98](https://github.com/agbamoh98)

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

⭐ **Star this repo** if you found it helpful!

## 🎉 **Live Demo Status**

**Your todo app is now fully accessible from anywhere on the internet!**

- **🌐 Frontend**: [https://mytodolist-beryl-nine.vercel.app](https://mytodolist-beryl-nine.vercel.app)
- **🔧 Backend**: [https://mytodolist-production.up.railway.app](https://mytodolist-production.up.railway.app)
- **📊 Health Check**: [https://mytodolist-production.up.railway.app/actuator/health](https://mytodolist-production.up.railway.app/actuator/health)

**Try it out - register, login, and start managing your todos!** 🚀
