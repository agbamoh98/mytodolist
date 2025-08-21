# MySQL Setup Guide for Todo Backend

This guide will help you set up MySQL for the Todo backend application.

## Prerequisites

- Docker and Docker Compose installed
- Java 17+ and Maven 3.6+
- At least 1GB of free disk space

## Option 1: Using Docker Compose (Recommended for Development)

### 1. Start MySQL Database

From the `backend` directory, run:

```bash
docker-compose up -d
```

This will start:
- MySQL 8.0 on port 3306
- phpMyAdmin on port 8080

### 2. Access phpMyAdmin

Open your browser and go to: `http://localhost:8080`

- **Username**: `root`
- **Password**: `password`
- **Server**: `mysql`

### 3. Verify Database

The `tododb` database should be automatically created with the `todos` table.

## Option 2: Manual MySQL Installation

### 1. Install MySQL

#### Windows:
- Download MySQL Installer from [MySQL Downloads](https://dev.mysql.com/downloads/installer/)
- Install MySQL Server 8.0+
- Set root password as `password`

#### macOS:
```bash
brew install mysql
brew services start mysql
mysql_secure_installation
```

#### Linux (Ubuntu/Debian):
```bash
sudo apt update
sudo apt install mysql-server
sudo mysql_secure_installation
```

### 2. Create Database and User

```sql
-- Connect to MySQL as root
mysql -u root -p

-- Create database
CREATE DATABASE tododb CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Create user (optional)
CREATE USER 'todo_user'@'localhost' IDENTIFIED BY 'todo_password';
GRANT ALL PRIVILEGES ON tododb.* TO 'todo_user'@'localhost';
FLUSH PRIVILEGES;

-- Exit
EXIT;
```

### 3. Run Schema Script

```bash
mysql -u root -p tododb < todo-service/src/main/resources/schema.sql
```

## Configuration

### Development Profile (Default)

The application uses the `dev` profile by default, which connects to:
- **Host**: `localhost:3306`
- **Database**: `tododb`
- **Username**: `root`
- **Password**: `password`

### Production Profile

To use production settings, set the profile:

```bash
# Set environment variable
export SPRING_PROFILES_ACTIVE=prod

# Or run with profile
mvn spring-boot:run -Dspring.profiles.active=prod
```

Production environment variables:
- `DB_HOST`: Database host
- `DB_PORT`: Database port (default: 3306)
- `DB_NAME`: Database name (default: tododb)
- `DB_USERNAME`: Database username
- `DB_PASSWORD`: Database password

## Testing the Connection

### 1. Start the Application

```bash
cd todo-service
mvn spring-boot:run
```

### 2. Check Health Endpoint

```bash
curl http://localhost:8081/actuator/health
```

### 3. Test Database Connection

The application will automatically create tables on startup if they don't exist.

## Troubleshooting

### Common Issues

1. **Connection Refused**
   - Ensure MySQL is running
   - Check if port 3306 is available
   - Verify firewall settings

2. **Access Denied**
   - Check username/password
   - Verify user privileges
   - Ensure user can connect from localhost

3. **Database Not Found**
   - Create the database manually
   - Check database name in configuration
   - Verify user has CREATE privileges

### Docker Issues

1. **Port Already in Use**
   ```bash
   # Stop existing containers
   docker-compose down
   
   # Check what's using port 3306
   netstat -an | grep 3306
   ```

2. **Container Won't Start**
   ```bash
   # Check logs
   docker-compose logs mysql
   
   # Remove and recreate
   docker-compose down -v
   docker-compose up -d
   ```

## Performance Tuning

### MySQL Configuration

For better performance, consider these MySQL settings:

```ini
[mysqld]
innodb_buffer_pool_size = 256M
innodb_log_file_size = 64M
innodb_flush_log_at_trx_commit = 2
query_cache_size = 32M
max_connections = 100
```

### Application Configuration

In `application-prod.yml`:
```yaml
spring:
  jpa:
    properties:
      hibernate:
        jdbc:
          batch_size: 20
        order_inserts: true
        order_updates: true
```

## Backup and Restore

### Backup Database

```bash
mysqldump -u root -p tododb > backup.sql
```

### Restore Database

```bash
mysql -u root -p tododb < backup.sql
```

## Next Steps

1. **Test the application** with the new MySQL setup
2. **Implement other microservices** (API Gateway, Auth, etc.)
3. **Add connection pooling** with HikariCP (already included with Spring Boot)
4. **Set up monitoring** with MySQL Enterprise Monitor or similar tools
5. **Implement database migrations** with Flyway or Liquibase

