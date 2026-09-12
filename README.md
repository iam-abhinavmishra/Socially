# Socially

A full-stack social media platform built with React, Spring Boot, and PostgreSQL.

Socially allows users to create posts, interact with other users, follow people, like and comment on posts, bookmark content, and receive notifications. The application includes authentication, protected routes, relational database management, and production deployment.

## 🚀 Live Demo

**Frontend:** https://socially-si0w.onrender.com

**Backend API:** https://socially-backend-qq6e.onrender.com

---

## ✨ Features

### Authentication & Security
- User registration and login
- JWT-based authentication
- Google OAuth login
- Protected frontend routes
- Password hashing using BCrypt
- Persistent login sessions

### Social Features
- Create and delete posts
- View personalized feed
- Follow and unfollow users
- Like and unlike posts
- Comment on posts
- Bookmark posts
- View followers and following
- User profiles
- Explore users and posts
- Notifications

### Backend
- RESTful API architecture
- Spring Boot backend
- PostgreSQL relational database
- JPA/Hibernate for database interaction
- CORS configuration
- JWT authentication filter
- Referential data cleanup when deleting posts
- Validation and error handling

### Frontend
- React
- Vite
- React Router
- Tailwind CSS
- API integration using Axios
- Protected routes
- Loading states and action guards
- Responsive UI

---

## 🛠️ Tech Stack

### Frontend
- React
- Vite
- React Router
- Tailwind CSS
- Axios

### Backend
- Java
- Spring Boot
- Spring Data JPA
- Spring Security
- JWT
- BCrypt

### Database
- PostgreSQL

### Authentication
- JWT
- Google OAuth

### Deployment
- Render
- GitHub

---

## 🏗️ Architecture

The application follows a client-server architecture:

```text
                    ┌─────────────────────┐
                    │     React + Vite    │
                    │      Frontend       │
                    └──────────┬──────────┘
                               │
                         REST API / HTTP
                               │
                               ▼
                    ┌─────────────────────┐
                    │    Spring Boot      │
                    │      Backend        │
                    └──────────┬──────────┘
                               │
                         JPA / Hibernate
                               │
                               ▼
                    ┌─────────────────────┐
                    │     PostgreSQL      │
                    │      Database       │
                    └─────────────────────┘
