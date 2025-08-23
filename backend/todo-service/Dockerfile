# Use OpenJDK 21 as base image
FROM openjdk:21-jdk-slim

# Set working directory
WORKDIR /app

# Copy Maven files
COPY pom.xml .
COPY src ./src

# Install Maven
RUN apt-get update && apt-get install -y maven

# Build the application
RUN mvn clean package -DskipTests

# Expose port 8080 (Render expects this)
EXPOSE 8080

# Run the application
CMD ["java", "-jar", "target/todo-service-1.0.0.jar"]
