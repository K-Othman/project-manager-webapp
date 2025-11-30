/* 
===============================================================
 Database Schema for Project Management Web Application
 Author: [Your Name]
 Description:
   - This file creates the database tables for the application.
   - Includes users and projects tables.
   - Implements proper constraints, relationships, and character sets.
   - Drops existing tables first to allow repeatable execution.
===============================================================
*/

/* -------------------------------------------------------------
   SAFETY: Remove existing tables if they exist
   This ensures the script can be re-run without errors.
-------------------------------------------------------------- */
DROP TABLE IF EXISTS projects;
DROP TABLE IF EXISTS users;

/* -------------------------------------------------------------
   TABLE: users
   Purpose:
     - Stores registered user accounts.
   Notes:
     - Passwords will be stored as bcrypt hashes in production.
     - UNIQUE constraints prevent duplicate usernames or emails.
-------------------------------------------------------------- */
CREATE TABLE users (
  uid INT AUTO_INCREMENT PRIMARY KEY,              -- Unique user ID (PK)
  username VARCHAR(50) NOT NULL UNIQUE,            -- Username chosen by the user
  password VARCHAR(255) NOT NULL,                  -- Hashed password (bcrypt hash)
  email VARCHAR(100) NOT NULL UNIQUE,              -- Unique email address
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP   -- Timestamp of account creation
) ENGINE=InnoDB
  DEFAULT CHARSET = utf8mb4                         -- Supports all Unicode (including emojis)
  COLLATE = utf8mb4_unicode_ci;                     -- Case-insensitive collation

/* -------------------------------------------------------------
   TABLE: projects
   Purpose:
     - Stores all software projects belonging to registered users.
   Notes:
     - Each project is linked to a single user (FK).
     - Phase uses ENUM as required in the specification.
-------------------------------------------------------------- */
CREATE TABLE projects (
  pid INT AUTO_INCREMENT PRIMARY KEY,                          -- Unique project ID (PK)
  title VARCHAR(150) NOT NULL,                                 -- Project name/title
  start_date DATE NOT NULL,                                     -- Start date
  end_date DATE NULL,                                           -- Optional end date
  short_description VARCHAR(255) NOT NULL,                      -- Summary description
  phase ENUM('design','development','testing','deployment','complete')
    NOT NULL DEFAULT 'design',                                  -- Project phase (required values)
  uid INT NOT NULL,                                             -- Foreign key to users.uid
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,               -- Timestamp of project creation

  /* -----------------------------------------------------------
     Foreign Key: links project to its owner
     - ON DELETE CASCADE ensures that when a user is deleted,
       all their projects are automatically removed.
     - ON UPDATE CASCADE keeps relationships consistent.
  ------------------------------------------------------------ */
  CONSTRAINT fk_projects_user
    FOREIGN KEY (uid)
    REFERENCES users(uid)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci;