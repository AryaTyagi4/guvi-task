# Project README

## Overview

This project is a web application running on a PHP backend with MySQL, Redis, and MongoDB databases, all containerized using Docker Compose. It serves frontend files (HTML, CSS, JS) and PHP scripts via an Apache server.

---

## Important Files and Git Ignore

- `.env` file: Contains sensitive environment variables like passwords and usernames — **NOT** committed to the repo for security.
- `docker-compose.yml`: Contains service definitions and environment variable placeholders.
- `Dockerfile-php`: Custom PHP Dockerfile for building the PHP-Apache container with required extensions.

These files are excluded from git commits via `.gitignore` to protect sensitive data and environment-specific configs.

---

## Prerequisites

- Docker installed
- Docker Compose installed
- Create a `.env` file in the project root with the following variables:

REDIS_PASSWORD=your_redis_password
MONGO_INITDB_ROOT_USERNAME=your_mongo_user
MONGO_INITDB_ROOT_PASSWORD=your_mongo_password
MYSQL_ROOT_PASSWORD=your_mysql_root_password
MYSQL_PASSWORD=your_mysql_password

## Running the Docker Containers

Build and start all containers (PHP, MySQL, Redis, MongoDB):

docker-compose up --build 
## Accessing MySQL and Creating the User Table

1. Log in to the MySQL container (replace `<projectname>` with your Docker Compose project name(container name)):
docker exec -it <projectname>_mysql_1 mysql -u guviuser -p

2. Enter your MySQL password (value of `MYSQL_PASSWORD` from `.env`).

3. Select the `guvi` database:
USE guvi;
 Create the `users` table (run only once):
CREATE TABLE users (
id INT AUTO_INCREMENT PRIMARY KEY,
username VARCHAR(50) UNIQUE NOT NULL,
password VARCHAR(255) NOT NULL
);
4. Exit MySQL: EXIT;
---

## Accessing MongoDB and Viewing Collections

1. Log in to MongoDB container:
2. Enter your MongoDB root password (value of `MONGO_INITDB_ROOT_PASSWORD` from `.env`).

3. Switch to your database:
use guvi;

4. Show collections:
show collections;
5. View documents in the `profiles` collection (formatted output):
 db.profiles.find().pretty();
 Exit Mongo shell:
exit
1. Log in to Redis container:
docker exec -it <projectname>_redis_1 redis-cli -a <REDIS_PASSWORD>
keys *
