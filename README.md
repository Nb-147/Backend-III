<p align="center"> Node.js API for managing pet adoptions and pet records. </p>

## Description

This project is a Node.js API for managing pet adoptions and pet records. Built with Express and MongoDB, it features:
- Comprehensive CRUD operations for users, pets, and adoptions.
- Interactive API documentation generated with Swagger.
- Automated tests using Mocha, Chai, and Supertest.
- Dockerization for easy deployment and scalability.


## DockerHub Image Repository

[DockerHub Image](https://hub.docker.com/r/nico147/adoptme)

## DockerHub Image

```bash
docker pull nico147/adoptme:1.0.0
```

## Project Setup

Install the project dependencies:

```bash
npm install
```

## Running the Project

### Development Mode

Start the server in development mode with live reloading(nodemon):

```bash
npm run dev
```

The application will run at [http://localhost:8080](http://localhost:8080).

### Production Mode

Start the application in production mode:

```bash
npm start
```

## API Documentation

The interactive API documentation is available at:

```
http://localhost:8080/api-docs

```

## Running Tests

Execute the test suite using:

```bash
npm test
```

The tests cover endpoints for authentication, users, pets, and adoptions.

## Project Structure

```
.
├── src
│   ├── config
│       └── config.js
│   ├── controllers
│       └── adoptions.controller.js
│       └── pets.controller.js
│       └── sessions.controller.js
│       └── users.controller.js
│   ├── dao
│       └── models
│            └── Adoption.js
│            └── Pet.js
│            └── User.js
│       └── Adoption.js
│       └── Pets.dao.js
│       └── Users.dao.js
│   ├── docs
│       └── adoptions.yaml
│       └── pets.yaml
│       └── sessions.yaml
│       └── users.yaml
│   ├── dto
│       └── Pet.dto.js
│       └── User.dto.js
│   ├── public
│       └── img
│   ├── repository
│       └── AdoptionRepository.js
│       └── GenericRepository.js
│       └── PetRepository.js
│       └── UserRepository.js
│   ├── routes
│       └── adoption.router.js
│       └── mocking.router.js
│       └── pets.router.js
│       └── sessions.router.js
│       └── users.router.js
│   ├── services
│       └── index.js
│   ├── utils
│       └── errorHandler.js
│       └── index.js
│       └── mocking.js
│       └── uploader.js
│   └── app.js
│   └── nodemon.json
├── test
│   └── userAndPets.test.js
├── .env.development
├── .env.production
├── .gitignore
├── Dockerfile
├── package-lock.json
├── package.json
└── README.md
```
