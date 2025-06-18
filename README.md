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

- [Docker](https://docs.docker.com/get-docker/) installed
- [Docker Compose](https://docs.docker.com/compose/install/) installed
- Create a `.env` file in the project root with the following variables:

```env
# .env example
REDIS_PASSWORD=your_redis_password
MONGO_INITDB_ROOT_USERNAME=your_mongo_user
MONGO_INITDB_ROOT_PASSWORD=your_mongo_password
MYSQL_ROOT_PASSWORD=your_mysql_root_password
MYSQL_PASSWORD=your_mysql_password
