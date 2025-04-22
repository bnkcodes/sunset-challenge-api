# Sunset Challenge - Backend API

<p align="center">
  <img src="https://i.ibb.co/kch2SVb/sunset-logo.png" alt="Sunset Logo" width="200" />
</p>

This is the backend API for the Sunset Challenge, a todo list application with color customization features. This project was developed as part of a full-stack developer assessment for Sunset.

## 🚀 Technologies

- **Framework**: NestJS
- **Language**: TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT with Passport
- **API Documentation**: Swagger/OpenAPI
- **Testing**: Jest
- **Email**: SendGrid/Nodemailer
- **Validation**: Class Validator, Joi
- **Logging**: Winston
- **Code Quality**: ESLint, Prettier, Husky

## 📋 Features

- RESTful API architecture
- User authentication and authorization
- Todo list management
- Task management
- Color customization for lists
- Email notifications
- API documentation
- Unit and integration tests
- Database migrations
- Environment configuration
- Request validation
- Error handling
- Logging system

## 🛠️ Getting Started

### Prerequisites

- Node.js (v16 or higher)
- Yarn package manager
- PostgreSQL database
- Docker and Docker Compose (optional)

### Running with Docker (Recommended)

1. Clone the repository:
```bash
git clone https://github.com/brunownk/sunset-challenge.git
cd sunset-challenge
```

2. Copy the environment files:
```bash
cp sunset-challenge-web/.env.example sunset-challenge-web/.env
cp sunset-challenge-api/.env.example sunset-challenge-api/.env
```

3. Start the services:
```bash
docker-compose up -d
```

The API will be available at http://localhost:3000

### Running Locally

1. Clone the repository:
```bash
git clone https://github.com/brunownk/sunset-challenge-api.git
cd sunset-challenge-api
```

2. Copy the environment file:
```bash
cp .env.example .env
```

3. Install dependencies:
```bash
yarn install
```

4. Set up the database:
```bash
yarn prisma generate
yarn prisma migrate dev
```

5. Start the development server:
```bash
yarn start:dev
```

### Available Scripts

- `yarn start:dev` - Start development server
- `yarn build` - Build for production
- `yarn start:prod` - Start production server
- `yarn test` - Run tests
- `yarn test:watch` - Run tests in watch mode
- `yarn test:cov` - Run tests with coverage
- `yarn lint` - Run ESLint
- `yarn format` - Format code with Prettier

## 📦 Project Structure

```
src/
├── config/         # Application configuration
├── domains/        # Domain-driven design modules
│   ├── user/      # User domain
│   ├── task/      # Task domain
│   ├── list/      # List domain
│   └── abstrations/ # Domain abstractions
├── shared/         # Shared resources
│   ├── decorators/# Custom decorators
│   ├── dto/       # Data Transfer Objects
│   ├── guards/    # Guards
│   ├── infra/     # Infrastructure components
│   ├── interfaces/# Interfaces
│   ├── providers/ # Service providers
│   ├── strategies/# Authentication strategies
│   ├── types/     # TypeScript types
│   └── utils/     # Utilities
└── main.ts        # Application entry point
```

## 🗄️ Database Schema

The application uses PostgreSQL with the following main entities:

### Users
- ID (UUID)
- Name
- Email
- Password (hashed)
- Role (USER/ADMIN)
- Lists
- Tasks

### Lists
- ID (UUID)
- User ID
- Name
- Color
- Created/Updated timestamps
- Tasks

### Tasks
- ID (UUID)
- User ID
- List ID
- Title
- Description
- Completion status
- Created/Updated timestamps

## 🔒 Authentication

The API uses JWT-based authentication with the following features:
- User registration
- Email verification
- Password reset
- Role-based access control
- Token refresh mechanism

## 📝 API Documentation

API documentation is available at `/api` when running the server. It includes:
- Endpoint descriptions
- Request/response schemas
- Authentication requirements
- Example requests

## 🧪 Testing

The project includes:
- Unit tests
- Integration tests
- E2E tests
- Test coverage reports
- Mocked services

## 🔒 Security

- JWT authentication
- Password hashing
- Input validation
- CORS configuration
- Environment variables
- Secure headers

## 🌐 Production URL

The API is available at: [https://sunset-challenge-api.vercel.app](https://sunset-challenge-api.vercel.app)

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](../LICENSE) file for details.

## 🔄 Navigation

- [Back to Top](#sunset-challenge---backend-api)
- [Root Documentation](../README.md)
- [Frontend Documentation](../sunset-challenge-web/README.md)
