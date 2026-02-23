# System Scalability & Architecture Note

This document outlines the architectural path to transition the **Prime Trade AI** application from its current Monolithic SQLite foundation to a globally distributed, high-availability Microservices architecture suited for millions of concurrent users.

Current Architecture (MVP Phase):
- **Frontend:** Single Page React Application (Vite).
- **Backend:** Node.js Express Monolith.
- **Database:** Local SQLite file.
- **State/Cache:** In-memory / DB lookups.

---

## 1. Database Scaling (From SQLite to Distributed PostgreSQL/NoSQL)

A local SQLite database is perfect for rapid prototyping and zero-dependency local setups. For production scalability:

1. **Migrate to Managed PostgreSQL (e.g., AWS RDS, Supabase, Neon):**
   - The Prisma ORM schema is completely agnostic. Changing `provider = "sqlite"` to `"postgresql"` and supplying a connection URL immediately scales the data layer.
   - Utilize Read Replicas: Direct all `SELECT` queries (e.g., fetching task boards) to read-only database replicas, while pointing `INSERT/UPDATE` operations to a primary Write node.
2. **Database Sharding:** 
   - Once data volume exceeds single-instance limits, shard databases geographically (e.g., US-East users on DB 1, EU-Central users on DB 2).

## 2. Server Load Balancing & Horizontal Pod Autoscaling

The Node.js Express API is stateless (JWTs are used instead of server-side sessions). This is a critical requirement for horizontal scaling.

1. **Kubernetes (K8s) or AWS ECS:**
   - Containerize the Node app using the included Dockerfile.
   - Deploy Pods/Containers across multiple server instances.
   - **Load Balancer (Nginx, AWS ALB):** Place a Load Balancer in front of the server instances. The LB will distribute incoming REST API traffic evenly across all available containers using algorithms like Round Robin or Least Connections.
   - Configure Auto-scaling groups to automatically spin up 50+ identical Node.js containers during traffic spikes.

## 3. Caching Strategy (Redis Integration)

To reduce Database bottlenecking, an aggressive caching layer must be implemented.

1. **Redis Cluster Integration:**
   - **Session Verification:** Store blocklisted JWTs or user permission states in Redis for ultra-fast, sub-millisecond lookups.
   - **Data Caching:** Frequently accessed but rarely modified data (e.g., global organization statistics, static task categories) should be read from Redis rather than querying the SQL database.
   - **Rate Limiting:** Use Redis as the global store for `express-rate-limit` to prevent brute-force attacks across multiple load-balanced server nodes.

## 4. Microservices Decomposition

If the application scope grows beyond Tasks and Auth (e.g., introducing Real-time Messaging, AI Data Analysis, Payment Processing), the Monolith should be split:

1. **Auth Service:** Dedicated microservice handling OAuth, JWT minting, and profile management.
2. **Core Operations Service:** Handles the CRUD of tasks and business logic.
3. **Notification/WebSocket Service:** A separate lightweight Go or Node.js service dedicated purely to maintaining persistent real-time connections using WebSockets or Server-Sent Events (SSE).
4. **API Gateway:** Sit a Gateway (like Kong or AWS API Gateway) at the edge of the network to route frontend requests to the correct internal Microservice securely.

## 5. Edge Delivery (CDN)
The Vite-built React Frontend should never be served by Node.js.
- Distribute the `frontend/dist` folder globally using a CDN (Cloudflare, AWS CloudFront). This guarantees the UI loads instantly for users worldwide by serving assets from servers physically closest to them.
