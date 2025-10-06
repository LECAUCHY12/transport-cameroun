# Spécifications Techniques - Transport Cameroun

## 1. SPÉCIFICATIONS FONCTIONNELLES

### 1.1 Module Authentification
```
RF001: L'utilisateur peut s'inscrire avec son numéro de téléphone
RF002: Vérification par SMS obligatoire
RF003: Choix du rôle (Passager/Conducteur) à l'inscription
RF004: Connexion par téléphone + mot de passe
RF005: Récupération mot de passe par SMS
```

### 1.2 Module Gestion Profils
```
RF006: Profil passager (nom, photo, téléphone, historique)
RF007: Profil conducteur (permis, véhicule, évaluations)
RF008: Modification profil avec vérification
RF009: Upload photo de profil
RF010: Historique des trajets
```

### 1.3 Module Véhicules
```
RF011: Enregistrement véhicule (type, plaque, capacité)
RF012: Validation documents véhicule
RF013: Statut véhicule (disponible/occupé/maintenance)
RF014: Localisation temps réel
RF015: Historique trajets véhicule
```

### 1.4 Module Itinéraires
```
RF016: Création itinéraire avec points d'arrêt
RF017: Horaires de passage estimés
RF018: Tarification par zone/distance
RF019: Recherche itinéraires par origine/destination
RF020: Affichage carte interactive
```

### 1.5 Module Réservations
```
RF021: Recherche transport disponible
RF022: Sélection nombre de places
RF023: Confirmation réservation
RF024: Annulation avec politique de remboursement
RF025: Historique réservations
```

### 1.6 Module Paiements
```
RF026: Paiement Orange Money
RF027: Paiement MTN Mobile Money
RF028: Paiement à bord (cash)
RF029: Reçu de paiement par SMS
RF030: Historique transactions
```

## 2. SPÉCIFICATIONS NON-FONCTIONNELLES

### 2.1 Performance
```
NFR001: Temps de réponse API < 2 secondes
NFR002: Chargement page < 3 secondes
NFR003: Support 1000 utilisateurs simultanés
NFR004: Mise à jour position véhicule toutes les 30 secondes
```

### 2.2 Sécurité
```
NFR005: Chiffrement HTTPS obligatoire
NFR006: Authentification JWT avec expiration
NFR007: Validation côté serveur de toutes les entrées
NFR008: Protection contre attaques CSRF/XSS
NFR009: Limitation taux de requêtes (rate limiting)
```

### 2.3 Disponibilité
```
NFR010: Uptime minimum 99.5%
NFR011: Mode dégradé en cas de panne partielle
NFR012: Sauvegarde données toutes les 6 heures
NFR013: Plan de reprise d'activité < 4 heures
```

### 2.4 Compatibilité
```
NFR014: Support navigateurs (Chrome, Firefox, Safari, Edge)
NFR015: Design responsive mobile-first
NFR016: Support réseaux 2G/3G/4G
NFR017: Fonctionnement offline basique
```

## 3. MODÈLE DE DONNÉES DÉTAILLÉ

### 3.1 Collection Users
```typescript
interface User {
  _id: ObjectId
  phone: string          // Unique, format +237XXXXXXXXX
  name: string
  email?: string
  role: 'passenger' | 'driver' | 'admin'
  language: 'fr' | 'en'
  profilePicture?: string
  isVerified: boolean
  createdAt: Date
  updatedAt: Date
  
  // Spécifique conducteur
  driverInfo?: {
    licenseNumber: string
    licenseExpiry: Date
    vehicleIds: ObjectId[]
    rating: number
    totalTrips: number
    isActive: boolean
  }
  
  // Spécifique passager
  passengerInfo?: {
    preferredLanguage: string
    paymentMethods: PaymentMethod[]
    emergencyContact?: string
  }
}
```

### 3.2 Collection Vehicles
```typescript
interface Vehicle {
  _id: ObjectId
  driverId: ObjectId
  type: 'bus' | 'taxi' | 'moto' | 'car'
  licensePlate: string
  brand: string
  model: string
  year: number
  capacity: number
  color: string
  status: 'active' | 'inactive' | 'maintenance'
  currentLocation?: {
    latitude: number
    longitude: number
    lastUpdate: Date
  }
  documents: {
    registration: string
    insurance: string
    inspection: string
  }
  createdAt: Date
  updatedAt: Date
}
```

### 3.3 Collection Routes
```typescript
interface Route {
  _id: ObjectId
  name: string
  origin: {
    name: string
    coordinates: [number, number] // [longitude, latitude]
  }
  destination: {
    name: string
    coordinates: [number, number]
  }
  stops: Array<{
    name: string
    coordinates: [number, number]
    order: number
    estimatedTime: number // minutes depuis origine
  }>
  distance: number        // en kilomètres
  estimatedDuration: number // en minutes
  basePrice: number      // prix de base en FCFA
  pricePerKm: number
  isActive: boolean
  createdAt: Date
}
```

### 3.4 Collection Bookings
```typescript
interface Booking {
  _id: ObjectId
  passengerId: ObjectId
  driverId: ObjectId
  vehicleId: ObjectId
  routeId: ObjectId
  
  pickup: {
    location: string
    coordinates: [number, number]
    time: Date
  }
  dropoff: {
    location: string
    coordinates: [number, number]
    estimatedTime: Date
  }
  
  passengers: number
  totalPrice: number
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled'
  
  payment: {
    method: 'cash' | 'orange_money' | 'mtn_momo' | 'card'
    status: 'pending' | 'paid' | 'refunded'
    transactionId?: string
    paidAt?: Date
  }
  
  rating?: {
    score: number // 1-5
    comment?: string
    ratedAt: Date
  }
  
  createdAt: Date
  updatedAt: Date
}
```

## 4. APIS REST

### 4.1 Authentication
```
POST /api/auth/register
POST /api/auth/verify-phone
POST /api/auth/login
POST /api/auth/logout
POST /api/auth/refresh-token
POST /api/auth/forgot-password
```

### 4.2 Users
```
GET    /api/users/profile
PUT    /api/users/profile
POST   /api/users/upload-avatar
GET    /api/users/bookings
GET    /api/users/drivers (pour passagers)
```

### 4.3 Vehicles
```
GET    /api/vehicles
POST   /api/vehicles (conducteurs)
PUT    /api/vehicles/:id
DELETE /api/vehicles/:id
PUT    /api/vehicles/:id/location
```

### 4.4 Routes
```
GET    /api/routes
GET    /api/routes/search?origin=X&destination=Y
GET    /api/routes/:id
POST   /api/routes (admin)
PUT    /api/routes/:id (admin)
```

### 4.5 Bookings
```
GET    /api/bookings
POST   /api/bookings
PUT    /api/bookings/:id
DELETE /api/bookings/:id
POST   /api/bookings/:id/rate
```

## 5. INTÉGRATIONS EXTERNES

### 5.1 SMS (Twilio ou local)
```typescript
interface SMSService {
  sendVerificationCode(phone: string, code: string): Promise<boolean>
  sendBookingConfirmation(phone: string, booking: Booking): Promise<boolean>
  sendPaymentReceipt(phone: string, payment: Payment): Promise<boolean>
}
```

### 5.2 Paiements Orange Money
```typescript
interface OrangeMoneyAPI {
  initiatePayment(amount: number, phone: string): Promise<{transactionId: string}>
  checkPaymentStatus(transactionId: string): Promise<PaymentStatus>
  processRefund(transactionId: string, amount: number): Promise<boolean>
}
```

### 5.3 Géolocalisation
```typescript
interface LocationService {
  getCurrentPosition(): Promise<Coordinates>
  watchPosition(callback: (position: Coordinates) => void): void
  calculateDistance(from: Coordinates, to: Coordinates): number
  getRoute(from: Coordinates, to: Coordinates): Promise<Route>
}
```

## 6. PLAN DE TEST

### 6.1 Tests Unitaires
- Services de validation
- Logique métier
- Utilitaires de calcul

### 6.2 Tests d'Intégration
- APIs REST
- Base de données
- Services externes

### 6.3 Tests E2E
- Parcours utilisateur complet
- Réservation bout en bout
- Processus de paiement

### 6.4 Tests de Performance
- Charge utilisateur
- Temps de réponse
- Consommation mémoire
