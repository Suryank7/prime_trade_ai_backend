# Prime Trade AI Backend API

Production-Grade Scalable REST API with Authentication & Role-Based Access Control.

## Tech Stack
- **Node.js + Express.js**
- **TypeScript**
- **PostgreSQL** (with **Prisma ORM**)
- **Redis** (for caching, optional setup)
- **JWT** (for Authentication)
- **Docker** & **docker-compose**
- **Jest** (Unit testing)

## Setup Steps

### Prerequisites
- Node.js (v18 or higher)
- Docker & docker-compose

### Local Development Setup
1. Clone the repository and navigate to the project directory.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy environment variables:
   ```bash
   cp .env.example .env
   ```
4. Start Docker containers (PostgreSQL & Redis):
   ```bash
   docker-compose up -d db redis
   ```
5. Apply Prisma migrations & generate schema:
   ```bash
   npm run prisma:migrate
   ```
6. Seed database (creates default admin user):
   ```bash
   npm run prisma:seed
   ```
7. Start the development server:
   ```bash
   npm run dev
   ```

### Running the Full Stack with Docker
You can start the application, database, and Redis completely via Docker:
```bash
docker-compose up --build
```
*Note: Make sure your ports 3000, 5432, and 6379 are not in use by other services.*

## Environment Variables
Ensure `.env` matches the configuration provided in `.env.example`. Make sure `JWT_SECRET` is strong for production use.

## API Documentation
Once the server is running, visit the fully documented Swagger UI:
👉 **[http://localhost:3000/docs](http://localhost:3000/docs)**

## Folder Structure
```
├── prisma/             # Prisma schema, migrations, seed
├── public/             # Static files (if any)
├── src/                # Root of source code
│   ├── config/         # System configurations (DB, Redis, Env)
│   ├── docs/           # Swagger / OpenAPI documentation
│   ├── middlewares/    # Custom middlewares (Auth, Error handling, Rate Limits)
│   ├── modules/        # Modular API resources (auth, user, task)
│   ├── routes/         # Central API routing tree
│   ├── utils/          # Helper utilities (jwt, bcrypt)
│   ├── app.ts          # Express App configuration
│   └── server.ts       # Main entry point to start the server
├── test/               # Jest tests
├── .env.example        # Environment variable template
├── docker-compose.yml  # Docker Compose config for App, Postgres, Redis
├── Dockerfile          # Multi-stage production Docker build
├── jest.config.js      # Jest setup
├── package.json        # Dependencies and NPM scripts
└── tsconfig.json       # TypeScript configuration
```

## Scaling Strategy

This backend is designed with performance and extreme scale in mind.
- **Microservices Capabilities**: The modular architecture inside `src/modules` allows easy decoupling into dedicated microservices (e.g. Auth Service, Task Service) if the bounded context requirements diverge.
- **Load Balancing**: Can run multiple instances configured behind an NGINX reverse proxy or AWS API Gateway, effectively utilizing multi-core environments gracefully via horizontal scaling.
- **Horizontal Scaling**: Since JWT is stateless, sessions aren't bound to instances. Redis can be fully turned on for stateless cache syncing across a scaled farm.
- **Caching Layer**: Endpoints with intense reads can implement caching middleware using the preconfigured Redis service.
- **Message Queues**: In a hyper-growth state, heavy tasks (like email dispatching, complex job calculations) can be offloaded to RabbitMQ / BullMQ processing queues handled by worker nodes.
