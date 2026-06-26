# 🎫 GitTix — Ticket Booking Microservices Application

A full-stack ticket booking platform built with microservices architecture. Users can create, buy, and sell event tickets with real-time order expiration and Stripe payment integration.

---

## 🏗️ Architecture Overview

This application is built using a **microservices architecture** with the following services:

```
┌─────────────────────────────────────────────────────────┐
│                    Ingress (Nginx)                       │
└──────┬──────────┬──────────┬──────────┬─────────────────┘
       │          │          │          │
  ┌────▼───┐ ┌───▼────┐ ┌───▼────┐ ┌───▼──────┐
  │  Auth  │ │Tickets │ │ Orders │ │ Payments │
  └────┬───┘ └───┬────┘ └───┬────┘ └───┬──────┘
       │          │          │          │
  ┌────▼──────────▼──────────▼──────────▼──────┐
  │              NATS Streaming Server           │
  └─────────────────────────────────────────────┘
       │
  ┌────▼──────────┐
  │   Expiration  │
  │  (Redis Queue)│
  └───────────────┘
```

---

## 🚀 Services

### 1. 🔐 Auth Service
Handles user authentication and authorization.
- Sign Up / Sign In / Sign Out
- JWT-based authentication via cookies
- MongoDB for user storage

### 2. 🎟️ Tickets Service
Manages ticket creation and updates.
- Create and edit tickets
- Publishes `ticket:created` and `ticket:updated` events
- Listens for `order:created` and `order:cancelled` events
- Optimistic concurrency control with versioning

### 3. 📦 Orders Service
Manages order lifecycle.
- Create and cancel orders
- 15-minute order expiration window
- Publishes `order:created` and `order:cancelled` events
- Listens for `ticket:created`, `ticket:updated`, and `expiration:complete` events

### 4. ⏰ Expiration Service
Handles order expiration using a job queue.
- Bull queue with Redis backend
- Publishes `expiration:complete` after 15 minutes
- Listens for `order:created` events

### 5. 💳 Payments Service
Processes payments via Stripe.
- Stripe charge creation
- Publishes `payment:created` events
- Listens for `order:created` and `order:cancelled` events

### 6. 🖥️ Client (Next.js)
Frontend application.
- Server-side rendering with Next.js
- Stripe Checkout integration
- Real-time order countdown timer

### 7. 📚 Common Library (`@tikticket/common`)
Shared NPM package used across all services.
- Custom error classes
- Authentication middlewares
- Event interfaces and base classes
- TypeScript types

---

## 🛠️ Tech Stack

| Category | Technology |
|---|---|
| Frontend | Next.js, React, Bootstrap |
| Backend | Node.js, Express, TypeScript |
| Database | MongoDB (per service) |
| Messaging | NATS Streaming Server |
| Queue | Bull + Redis |
| Payments | Stripe |
| Container | Docker |
| Orchestration | Kubernetes (Minikube for local) |
| CI/CD | GitHub Actions |
| Ingress | Nginx Ingress Controller |
| Auth | JWT + Cookie Session |

---

## 📁 Project Structure

```
ticketing/
├── auth/                    # Auth microservice
│   ├── src/
│   │   ├── models/         # User model
│   │   ├── routes/         # signin, signup, signout, currentuser
│   │   └── index.ts
│   └── Dockerfile
│
├── tickets/                 # Tickets microservice
│   ├── src/
│   │   ├── events/         # Publishers & Listeners
│   │   ├── models/         # Ticket model with versioning
│   │   ├── routes/         # CRUD routes
│   │   └── index.ts
│   └── Dockerfile
│
├── orders/                  # Orders microservice
│   ├── src/
│   │   ├── events/         # Publishers & Listeners
│   │   ├── models/         # Order & Ticket models
│   │   ├── routes/         # Create, delete, show orders
│   │   └── index.ts
│   └── Dockerfile
│
├── payments/                # Payments microservice
│   ├── src/
│   │   ├── events/         # Publishers & Listeners
│   │   ├── models/         # Payment model
│   │   ├── routes/         # Stripe charge creation
│   │   └── index.ts
│   └── Dockerfile
│
├── expiration/              # Expiration microservice
│   ├── src/
│   │   ├── events/         # Publishers & Listeners
│   │   ├── queues/         # Bull queue setup
│   │   └── index.ts
│   └── Dockerfile
│
├── client/                  # Next.js frontend
│   ├── pages/
│   │   ├── auth/           # signin, signup, signout
│   │   ├── tickets/        # new ticket, ticket show
│   │   ├── orders/         # order show
│   │   └── index.js        # Landing page
│   └── Dockerfile
│
├── common/                  # Shared NPM package
│   └── src/
│       ├── errors/         # Custom error classes
│       ├── events/         # Event interfaces
│       └── middlewares/    # Auth middlewares
│
└── infra/
    └── k8s/                # Kubernetes manifests
        ├── auth-depl.yaml
        ├── tickets-depl.yaml
        ├── orders-depl.yaml
        ├── payments-depl.yaml
        ├── expiration-depl.yaml
        ├── client-depl.yaml
        ├── nats-depl.yaml
        └── ingress-srv.yaml
```

---

## 🔄 Event Flow

```
User Creates Ticket
      │
      ▼
ticket:created ──► Orders Service (saves ticket replica)

User Places Order
      │
      ▼
order:created ──► Tickets Service (marks ticket as reserved)
              ──► Expiration Service (starts 15min timer)
              ──► Payments Service (saves order replica)

Timer Expires
      │
      ▼
expiration:complete ──► Orders Service (cancels order)

Order Cancelled
      │
      ▼
order:cancelled ──► Tickets Service (frees ticket)
               ──► Payments Service (updates order status)

User Pays
      │
      ▼
payment:created ──► Orders Service (marks order complete)
```

---

## ⚙️ Local Development Setup

### Prerequisites
- Docker
- Kubernetes (Minikube)
- Skaffold
- Node.js

### 1. Start Minikube
```bash
minikube start
eval $(minikube docker-env)
```

### 2. Pull Required Images
```bash
docker pull mongo
docker pull redis
```

### 3. Setup Hosts File
```bash
echo "$(minikube ip) ticketing.dev" | sudo tee -a /etc/hosts
```

### 4. Create Kubernetes Secrets
```bash
kubectl create secret generic jwt-secret --from-literal=JWT_KEY=your_jwt_secret
kubectl create secret generic stripe-secret --from-literal=STRIPE_KEY=your_stripe_key
```

### 5. Run with Skaffold
```bash
skaffold dev
```

### 6. Access Application
Open `https://ticketing.dev` in your browser.

---

## 🧪 Running Tests

Each service has its own test suite:

```bash
# Auth service tests
cd auth && npm test

# Tickets service tests
cd tickets && npm test

# Orders service tests
cd orders && npm test

# Payments service tests
cd payments && npm test
```

---

## 🔐 Environment Variables

| Variable | Service | Description |
|---|---|---|
| `JWT_KEY` | Auth, Orders, Tickets, Payments | JWT signing secret |
| `STRIPE_KEY` | Payments | Stripe secret key |
| `MONGO_URI` | All services | MongoDB connection string |
| `NATS_URL` | All services | NATS server URL |
| `NATS_CLUSTER_ID` | All services | NATS cluster ID |
| `NATS_CLIENT_ID` | All services | NATS client ID |

---

## 🚢 CI/CD Pipeline

GitHub Actions automatically builds and pushes Docker images on every push to `main`:

```
Push to main
     │
     ▼
GitHub Actions
     │
     ├── Build Auth Image ──► Docker Hub
     ├── Build Tickets Image ──► Docker Hub
     ├── Build Orders Image ──► Docker Hub
     ├── Build Payments Image ──► Docker Hub
     ├── Build Expiration Image ──► Docker Hub
     └── Build Client Image ──► Docker Hub
```

---

## 📡 API Endpoints

### Auth Service
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/users/signup` | Register new user |
| POST | `/api/users/signin` | Login user |
| POST | `/api/users/signout` | Logout user |
| GET | `/api/users/currentuser` | Get current user |

### Tickets Service
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/tickets` | Create ticket |
| GET | `/api/tickets` | Get all tickets |
| GET | `/api/tickets/:id` | Get ticket by ID |
| PUT | `/api/tickets/:id` | Update ticket |

### Orders Service
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/orders` | Create order |
| GET | `/api/orders` | Get user orders |
| GET | `/api/orders/:id` | Get order by ID |
| DELETE | `/api/orders/:id` | Cancel order |

### Payments Service
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/payments` | Create payment |

---

## 👨‍💻 Author

**Raza Rehman**  
GitHub: [@Raza181261](https://github.com/Raza181261)

---

## 📄 License

This project is for educational purposes.
