# Todo List Backend - Microservices Architecture

This is a Spring Boot microservices backend for a todo list application.

## Architecture

The backend consists of the following microservices:

1. **todo-service** (Port 8081) - Core todo management service
2. **todo-api-gateway** (Port 8080) - API Gateway for routing requests
3. **todo-auth-service** (Port 8082) - Authentication and authorization service
4. **todo-notification-service** (Port 8083) - Notification service

## Prerequisites

- Java 17 or higher
- Maven 3.6 or higher
- MySQL 8.0 or higher (or Docker for containerized setup)

## Database Setup

### Option 1: Docker Compose (Recommended)

```bash
cd backend
docker-compose up -d
```

This starts MySQL on port 3306 and phpMyAdmin on port 8080.

### Option 2: Manual MySQL Installation

See [MYSQL_SETUP.md](MYSQL_SETUP.md) for detailed instructions.

## Getting Started

### 1. Build the Project

From the root directory:
```bash
mvn clean install
```

### 2. Run the Services

#### Todo Service
```bash
cd todo-service
mvn spring-boot:run
```

The todo service will be available at `http://localhost:8081`

#### API Gateway
```bash
cd todo-api-gateway
mvn spring-boot:run
```

The API gateway will be available at `http://localhost:8080`

## Configuration

The application uses Spring profiles for different environments:

- **Development** (default): `application-dev.yml` - Connects to local MySQL
- **Production**: `application-prod.yml` - Uses environment variables for database config

### Database Configuration

- **Host**: `localhost:3306`
- **Database**: `tododb`
- **Username**: `root`
- **Password**: `password`

## API Endpoints

### Todo Service (Port 8081)

#### Get All Todos
```
GET /api/todos?userId={userId}
```

#### Get Todo by ID
```
GET /api/todos/{id}?userId={userId}
```

#### Create Todo
```
POST /api/todos
Content-Type: application/json

{
  "title": "Task title",
  "description": "Task description",
  "userId": "user123",
  "priority": "HIGH",
  "dueDate": "2024-12-31T23:59:59"
}
```

#### Update Todo
```
PUT /api/todos/{id}?userId={userId}
Content-Type: application/json

{
  "title": "Updated title",
  "description": "Updated description",
  "completed": true,
  "priority": "MEDIUM",
  "dueDate": "2024-12-31T23:59:59"
}
```

#### Delete Todo
```
DELETE /api/todos/{id}?userId={userId}
```

#### Toggle Todo Status
```
PATCH /api/todos/{id}/toggle?userId={userId}
```

#### Get Todos by Status
```
GET /api/todos/status/{completed}?userId={userId}
```

#### Get Todos by Priority
```
GET /api/todos/priority/{priority}?userId={userId}
```

#### Get Overdue Todos
```
GET /api/todos/overdue?userId={userId}
```

#### Get Statistics
```
GET /api/todos/stats/completed?userId={userId}
GET /api/todos/stats/pending?userId={userId}
```

## Database

The application uses MySQL database. You can access phpMyAdmin at:
`http://localhost:8080`

- **Server**: `mysql`
- **Username**: `root`
- **Password**: `password`

## Features

- ✅ CRUD operations for todos
- ✅ Priority levels (LOW, MEDIUM, HIGH, URGENT)
- ✅ Due date management
- ✅ Status tracking (completed/pending)
- ✅ User-specific todo management
- ✅ Search and filtering capabilities
- ✅ Statistics and reporting
- ✅ RESTful API design
- ✅ Input validation
- ✅ Comprehensive logging
- ✅ Health check endpoints
- ✅ MySQL database with optimized schema
- ✅ Docker support for easy development setup

## Next Steps

1. Implement the API Gateway service
2. Implement the Authentication service
3. Implement the Notification service
4. Add service discovery (Eureka)
5. Add circuit breakers and resilience patterns
6. Implement distributed tracing
7. Add monitoring and metrics (Prometheus/Grafana)
8. Set up database migrations (Flyway/Liquibase)
