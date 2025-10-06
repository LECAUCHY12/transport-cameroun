# Architecture Système - Transport Cameroun

## Vue d'ensemble de l'Architecture

```
┌──────────────────────────────────────────────────────────### 4.1 Stack Technologique Moderne (2025)
```
Frontend Web:     Next.js 15 + React 19 + TypeScript 5.6 + Tailwind CSS 4
                  + Shadcn/ui + Framer Motion + React Query (TanStack)
Mobile (futur):   Expo Router + React Native 0.75 + NativeWind
Backend:          Node.js 22 + Fastify + TypeScript + Zod validation
                  + Prisma ORM + GraphQL (Apollo Server v4)
Base de données:  PostgreSQL + Redis Stack + Vector DB (Pinecone)
Temps réel:       WebSockets + Server-Sent Events + Pusher
IA/ML:            OpenAI GPT-4 + Langchain + Vector Search
Géolocalisation:  Mapbox GL JS + Google Maps Platform + HERE Maps
Paiements:        Stripe + Orange Money + MTN MoMo + Flutterwave
Auth:             Clerk + NextAuth.js v5 + Supabase Auth
Monitoring:       Sentry + Posthog + Vercel Analytics
Déploiement:      Vercel + Railway + Docker + Kubernetes
Testing:          Vitest + Playwright + Testing Library
DevOps:           GitHub Actions + Turborepo + pnpm
```──────┐
│                        FRONTEND LAYER                          │
├─────────────────────────────────────────────────────────────────┤
│  Next.js Web App     │  React Native Mobile (Phase 2)         │
│  - React Components  │  - iOS & Android                        │
│  - TypeScript        │  - Shared API layer                     │
│  - Tailwind CSS      │  - Offline capabilities                 │
│  - Real-time UI      │  - Push notifications                   │
└─────────────────────────────────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                         API GATEWAY                            │
├─────────────────────────────────────────────────────────────────┤
│  - Route management        │  - Rate limiting                   │
│  - Authentication         │  - Request/Response logging        │
│  - Load balancing         │  - API versioning                  │
└─────────────────────────────────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                    MICROSERVICES LAYER                         │
├─────────────────────────────────────────────────────────────────┤
│ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ │
│ │   Auth      │ │    User     │ │  Vehicle    │ │  Booking    │ │
│ │  Service    │ │  Service    │ │  Service    │ │  Service    │ │
│ │             │ │             │ │             │ │             │ │
│ │ - JWT       │ │ - Profiles  │ │ - Fleet     │ │ - Reserve   │ │
│ │ - SMS       │ │ - Settings  │ │ - Tracking  │ │ - Cancel    │ │
│ │ - Verify    │ │ - History   │ │ - Status    │ │ - History   │ │
│ └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘ │
│                                                                 │
│ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ │
│ │  Payment    │ │  Location   │ │Notification │ │ Analytics   │ │
│ │  Service    │ │  Service    │ │  Service    │ │  Service    │ │
│ │             │ │             │ │             │ │             │ │
│ │ - OrangeMY  │ │ - GPS       │ │ - SMS       │ │ - Reports   │ │
│ │ - MTN MoMo  │ │ - Maps      │ │ - Email     │ │ - Metrics   │ │
│ │ - Cards     │ │ - Routes    │ │ - Push      │ │ - Business  │ │
│ └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                      DATA LAYER                                │
├─────────────────────────────────────────────────────────────────┤
│ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ │
│ │  MongoDB    │ │   Redis     │ │ File Store  │ │  External   │ │
│ │             │ │             │ │             │ │   APIs      │ │
│ │ - Users     │ │ - Sessions  │ │ - Images    │ │             │ │
│ │ - Vehicles  │ │ - Cache     │ │ - Documents │ │ - SMS API   │ │
│ │ - Bookings  │ │ - Real-time │ │ - Logs      │ │ - Maps API  │ │
│ │ - Routes    │ │ - Queues    │ │ - Backups   │ │ - Payment   │ │
│ │ - Payments  │ │             │ │             │ │   APIs      │ │
│ └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

## Architecture Détaillée par Service

### 1. Service d'Authentification

```typescript
// Structure du service Auth
├── controllers/
│   ├── auth.controller.ts
│   └── verification.controller.ts
├── services/
│   ├── jwt.service.ts
│   ├── sms.service.ts
│   └── crypto.service.ts
├── middleware/
│   ├── auth.middleware.ts
│   └── rateLimit.middleware.ts
├── models/
│   ├── user.model.ts
│   └── session.model.ts
└── utils/
    ├── validators.ts
    └── errors.ts
```

**Responsabilités :**
- Inscription et connexion utilisateurs
- Génération et validation JWT
- Vérification par SMS
- Gestion des sessions
- Politique de sécurité

### 2. Service Utilisateur

```typescript
// Structure du service User
├── controllers/
│   ├── profile.controller.ts
│   ├── driver.controller.ts
│   └── passenger.controller.ts
├── services/
│   ├── profile.service.ts
│   ├── upload.service.ts
│   └── validation.service.ts
├── models/
│   ├── user.model.ts
│   ├── driver.model.ts
│   └── passenger.model.ts
└── utils/
    ├── imageProcessor.ts
    └── validators.ts
```

**Responsabilités :**
- Gestion des profils utilisateur
- Upload et traitement d'images
- Historique des activités
- Préférences utilisateur
- Validation des données

### 3. Service Véhicule

```typescript
// Structure du service Vehicle
├── controllers/
│   ├── vehicle.controller.ts
│   ├── fleet.controller.ts
│   └── tracking.controller.ts
├── services/
│   ├── vehicle.service.ts
│   ├── location.service.ts
│   └── maintenance.service.ts
├── models/
│   ├── vehicle.model.ts
│   ├── location.model.ts
│   └── maintenance.model.ts
└── utils/
    ├── gpsValidator.ts
    └── distanceCalculator.ts
```

**Responsabilités :**
- Enregistrement des véhicules
- Suivi GPS en temps réel
- Gestion de l'état des véhicules
- Planification de la maintenance
- Calculs de distance et d'itinéraire

### 4. Service de Réservation

```typescript
// Structure du service Booking
├── controllers/
│   ├── booking.controller.ts
│   ├── search.controller.ts
│   └── rating.controller.ts
├── services/
│   ├── booking.service.ts
│   ├── search.service.ts
│   ├── pricing.service.ts
│   └── notification.service.ts
├── models/
│   ├── booking.model.ts
│   ├── route.model.ts
│   └── rating.model.ts
└── utils/
    ├── priceCalculator.ts
    ├── availabilityChecker.ts
    └── routeOptimizer.ts
```

**Responsabilités :**
- Création et gestion des réservations
- Recherche de transport disponible
- Calcul des prix dynamiques
- Système de notation et avis
- Optimisation des correspondances

## Communication Entre Services

### 1. API REST
```typescript
// Interface standardisée pour tous les services
interface APIResponse<T> {
  success: boolean
  data?: T
  error?: {
    code: string
    message: string
    details?: any
  }
  metadata?: {
    timestamp: string
    requestId: string
    version: string
  }
}
```

### 2. Events (Message Queue)
```typescript
// Système d'événements pour communication asynchrone
interface Event {
  type: string
  source: string
  data: any
  timestamp: Date
  correlationId: string
}

// Exemples d'événements
- USER_REGISTERED
- BOOKING_CREATED
- PAYMENT_COMPLETED
- VEHICLE_LOCATION_UPDATED
- TRIP_COMPLETED
```

### 3. WebSocket (Temps Réel)
```typescript
// Namespace pour différents types de données temps réel
io.of('/tracking').on('connection', (socket) => {
  // Suivi de position véhicules
  socket.on('join-vehicle', (vehicleId) => {})
  socket.on('location-update', (data) => {})
})

io.of('/bookings').on('connection', (socket) => {
  // Mises à jour réservations
  socket.on('join-booking', (bookingId) => {})
  socket.on('status-change', (data) => {})
})
```

## Patterns d'Architecture Utilisés

### 1. Repository Pattern
```typescript
interface UserRepository {
  findById(id: string): Promise<User | null>
  findByPhone(phone: string): Promise<User | null>
  create(user: CreateUserDTO): Promise<User>
  update(id: string, updates: UpdateUserDTO): Promise<User>
  delete(id: string): Promise<boolean>
}
```

### 2. Service Layer Pattern
```typescript
class BookingService {
  constructor(
    private bookingRepo: BookingRepository,
    private vehicleService: VehicleService,
    private paymentService: PaymentService,
    private notificationService: NotificationService
  ) {}

  async createBooking(data: CreateBookingDTO): Promise<Booking> {
    // Logique métier complexe
    // Validation, calculs, orchestration
  }
}
```

### 3. Event Sourcing (Partiel)
```typescript
// Pour les événements critiques comme les paiements
interface PaymentEvent {
  id: string
  bookingId: string
  type: 'INITIATED' | 'PROCESSING' | 'COMPLETED' | 'FAILED'
  amount: number
  timestamp: Date
  metadata: any
}
```

## Sécurité et Monitoring

### 1. Sécurité par Couche
```typescript
// Middleware de sécurité
const securityMiddleware = [
  helmet(),                    // Headers sécurisés
  cors(corsOptions),          // CORS configuré
  rateLimit(),               // Limitation de taux
  authenticateJWT(),         // Validation JWT
  validateInput(),           // Validation entrées
  auditLogger()             // Logs d'audit
]
```

### 2. Monitoring et Observabilité
```typescript
// Métriques business et techniques
interface Metrics {
  // Business
  activeBookings: number
  dailyRevenue: number
  userRegistrations: number
  
  // Techniques
  apiResponseTime: number
  errorRate: number
  databaseConnections: number
}
```

Cette architecture modulaire permet :
- **Scalabilité** : Chaque service peut être mis à l'échelle indépendamment
- **Maintenabilité** : Séparation claire des responsabilités
- **Fiabilité** : Isolation des pannes
- **Évolutivité** : Ajout facile de nouvelles fonctionnalités
- **Performance** : Optimisation par service selon les besoins
