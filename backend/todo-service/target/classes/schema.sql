-- MySQL Database Schema for Todo Service
-- Run this script to create the database and tables

-- Create database if it doesn't exist
CREATE DATABASE IF NOT EXISTS tododb CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Use the database
USE tododb;

-- Create todos table
CREATE TABLE IF NOT EXISTS todos (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    completed BOOLEAN NOT NULL DEFAULT FALSE,
    user_id VARCHAR(255) NOT NULL,
    priority ENUM('LOW', 'MEDIUM', 'HIGH', 'URGENT') NOT NULL DEFAULT 'MEDIUM',
    due_date DATETIME,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_user_id (user_id),
    INDEX idx_completed (completed),
    INDEX idx_priority (priority),
    INDEX idx_due_date (due_date),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_completed ON todos(user_id, completed);
CREATE INDEX IF NOT EXISTS idx_user_priority ON todos(user_id, priority);
CREATE INDEX IF NOT EXISTS idx_user_due_date ON todos(user_id, due_date);

