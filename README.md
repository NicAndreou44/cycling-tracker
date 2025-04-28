# Cycling Tracker

## Project Overview
Thanks for visiting my Cycling Tracker project! This README reflects the current state of the project as of April 28, 2025.

I'm building a backend with Node.js and Express, implementing JWT authentication, validated via ZOD schema, and using AWS DynamoDB for data storage.

The project aims to create a thorough platform for tracking physical activities, with a focus on cycling. The long-term vision includes a login system for real-world use, allowing users to track all their physical activities, gain insights, and find motivation for healthier lifestyles through personalized storytelling.

## Getting Started
Start the server locally:
```
cd backend
npm install
npm start
```
Then check health endpoint at: http://localhost:3000/health

## API Endpoints

### Authentication
- Register: POST http://localhost:3000/api/auth/register
- Login: POST http://localhost:3000/api/auth/login

### Rides
- Create Ride: POST http://localhost:3000/api/rides
- List All Rides: GET http://localhost:3000/api/rides
- Get Ride Details: GET http://localhost:3000/api/rides/:id
- Update Ride: PUT http://localhost:3000/api/rides/:id
- Delete Ride: DELETE http://localhost:3000/api/rides/:id

## Current Tech Stack
- Backend: Node.js (18+) & Express.js
- Validation: Zod
- Authentication: JWT
- Database: AWS DynamoDB
- Testing:
  - E2E Testing: Cypress
  - Unit Testing: Jest
- CI/CD: GitHub Actions

## Current Features
- Full CRUD API with proper status codes (200/201) and error handling
- JWT secured endpoints
- DynamoDB integration
- Comprehensive test coverage:
  - Jest unit tests for Schema, services, and route level
  - Cypress API tests covering authentication, create, read, and delete flows
- CI pipelines for automated testing

## Planned Features & Improvements
- Docker containerization (in progress)
- Frontend with either React.js or Angular (feedback welcome!)
- Reintegration of AWS Lambda and S3
- Strava API integration for importing ride data
- Enhanced storytelling features to provide insights and motivation

## Learning Approach
As a first-time programmer, I'm using the Feynman technique daily (morning and evening) to explain each part of the code to myself for deeper understanding. While I'm confident in my understanding, I'm always looking to refine my knowledge.

I'm thoroughly enjoying this career change. Studying from when I wake up at 5 to bed time. Whilst working full time.
