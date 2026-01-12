ETNAir 

API backend

Cette API permet de gérer :

les utilisateurs (TENANT / OWNER),

les logements (annonces),

les réservations (bookings),

un workflow sécurisé avec JWT + rôles.

## Architecture du projet
src/
├── app.ts                 # Configuration Express
├── server.ts              # Lancement du serveur
├── prisma.ts              # Client Prisma (DB)
├── swagger.ts             # Configuration Swagger / OpenAPI
│
├── routes/                # Définition des routes HTTP
│   ├── auth.routes.ts
│   ├── properties.routes.ts
│   ├── bookings.routes.ts
│   └── me.routes.ts
│
├── controllers/           # Logique métier
│   ├── auth.controller.ts
│   ├── properties.controller.ts
│   └── bookings.controller.ts
│
├── middleware/            # Sécurité & contrôles
│   ├── auth.ts            # Vérification JWT
│   └── role.ts            # Gestion des rôles (RBAC)
│
└── prisma/
    └── schema.prisma      # Modèle de données

## Rôles utilisateurs


| Rôle   | Description |
|--------|------------|
| TENANT | Locataire, peut réserver des logements |
| OWNER  | Propriétaire, peut publier et gérer ses logements |
| ADMIN  | Prévu pour évolution future |

> Les rôles sont appliqués via des **middlewares**, pas dans les URLs.

## Sécurité

### Authentification
- Basée sur JWT
- Token transmis via le header :

Authorization: Bearer <token>

### Middlewares
- `requireAuth` → vérifie le token JWT et injecte `req.user`
- `requireRole(...)` → contrôle l’accès selon le rôle (RBAC)

### Auth (`/auth`)
| Méthode | Route | Description |
|--------|------|-------------|
| POST | `/auth/register` | Créer un compte |
| POST | `/auth/login` | Se connecter (JWT) |

### Utilisateur connecté
| Méthode | Route | Description |
|--------|------|-------------|
| GET | `/me` | Infos de l’utilisateur connecté |

### Logements (`/properties`)
| Méthode | Route | Accès | Description |
|--------|------|------|-------------|
| GET | `/properties` | Public | Lister les logements |
| GET | `/properties/:id` | Public | Détail d’un logement |
| POST | `/properties` | OWNER | Créer un logement |
| PATCH | `/properties/:id` | OWNER | Modifier partiellement |
| PUT | `/properties/:id` | OWNER | Modifier (complet) |
| DELETE | `/properties/:id` | OWNER | Supprimer un logement |

> Un OWNER ne peut modifier/supprimer que ses propres logements.

### Réservations (`/bookings`)
| Méthode | Route | Accès | Description |
|--------|------|------|-------------|
| POST | `/bookings` | TENANT | Créer une réservation |
| GET | `/bookings/me` | TENANT | Voir ses réservations |
| PATCH | `/bookings/:id/cancel` | TENANT | Annuler sa réservation |
| GET | `/bookings/owned` | OWNER | Voir réservations de ses logements |
| PATCH | `/bookings/:id/confirm` | OWNER | Confirmer une réservation |
| PATCH | `/bookings/:id/cancel-by-owner` | OWNER | Annuler une réservation (côté owner) |

#### Workflow réservation
- TENANT crée une réservation → `PENDING`
- OWNER confirme → `CONFIRMED`
- TENANT ou OWNER peut annuler → `CANCELLED` (selon règles)


## Controllers (logique métier)

### `auth.controller.ts`
- `register` : création utilisateur + hash password
- `login` : vérification + génération JWT

### `properties.controller.ts`
- CRUD des logements
- Vérification du propriétaire avant modification/suppression

### `bookings.controller.ts`
- Création réservation
- Vérification des chevauchements de dates (anti-overlap)
- Validation / annulation selon rôle + propriété

---

## Swagger / OpenAPI

Documentation interactive disponible à :
- `http://localhost:3000/api-docs`

Fonctionnalités :
- liste complète des endpoints
- authentification JWT via bouton **Authorize**
- schemas OpenAPI : `User`, `Property`, `Booking`, `Error`


## Configurer l’environnement

 un fichier .env.exemple dans /api à changer en .env avec les informations:

DATABASE_URL=postgresql://user:password@localhost:5432/etnair
JWT_SECRET="dev_secret"
PORT=3000


## Lancer en local (sans Docker)

### Installer les dépendances
```bash
npm install

### generer le client prisma à partir du schema json 

npx prisma generate

## Lancer l’API
npm run dev


## Docker Compose (DB + API + pgAdmin)

docker compose up --build -d

# Services  :

# API : http://localhost:3000

# Swagger : http://localhost:3000/api-docs

# pgAdmin : http://localhost:5050

# Postgres : localhost:5432



### K8S (Kubernetes) 

## (DB + API)

kubectl apply -f etnair-k8s.yaml   # Infra principale (API + Postgres

kubectl apply -f etnair-db-init.yaml   # ConfigMap (SQL)

kubectl apply -f etnair-db-job.yaml   # Job d'init PostgreSQL

### tester en local depuis l'execution sur kubernetes 

kubectl -n etnair port-forward svc/etnair-api 3000:3000

ouvrir le sawgger dans le navigateur :  http://localhost:3000/api-docs/

## envoyer une requete sur l'api sur bash 

curl http://localhost:3000/api-docs/



### testes 

## npm run test:cov

---------------------------|---------|----------|---------|---------|-------------------
File                       | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s 
---------------------------|---------|----------|---------|---------|-------------------
All files                  |   87.13 |       67 |   96.22 |   94.77 | 
 src                       |   95.23 |       50 |      50 |   97.56 | 
  app.ts                   |   96.66 |       50 |      50 |     100 | 26
  prisma.ts                |      90 |       50 |     100 |      90 | 8
  swagger.ts               |     100 |      100 |     100 |     100 | 
 src/controllers           |   92.23 |    76.47 |     100 |      95 | 
  auth.controller.ts       |   86.66 |       80 |     100 |   86.66 | 18,36
  bookings.controller.ts   |   96.96 |       80 |     100 |   96.96 | 16
  properties.controller.ts |   93.33 |    71.42 |     100 |   96.55 | 31
  users.controller.ts      |      88 |       75 |     100 |   95.65 | 42
 src/middleware            |   89.79 |    79.48 |     100 |   95.29 | 
  auth.ts                  |   88.88 |       80 |     100 |      96 | 75
  auth.validation.ts       |   89.47 |    83.33 |     100 |     100 | 30,50
  error.ts                 |     100 |       90 |     100 |     100 | 16,19
  role.ts                  |    87.5 |       75 |     100 |    87.5 | 9
  users.validation.ts      |   77.77 |    66.66 |     100 |   86.66 | 17,49             
  validation.ts            |     100 |       60 |     100 |     100 | 13
 src/routes                |   97.95 |      100 |       0 |   97.95 | 
  auth.routes.ts           |     100 |      100 |     100 |     100 | 
  bookings.routes.ts       |     100 |      100 |     100 |     100 | 
  me.routes.ts             |   83.33 |      100 |       0 |   83.33 | 27
  properties.routes.ts     |     100 |      100 |     100 |     100 | 
 src/services              |   75.33 |    52.38 |     100 |   91.52 | 
  auth.service.ts          |    87.5 |       70 |     100 |     100 | 10,24-49
  bookings.service.ts      |      75 |       50 |     100 |     100 | 8-174
  properties.service.ts    |   70.21 |       50 |     100 |   85.71 | 111-112,116-118  
  users.service.ts         |   73.91 |       50 |     100 |   76.19 | 14,23-24,28,49   
 src/utils                 |     100 |      100 |     100 |     100 | 
  appError.ts              |     100 |      100 |     100 |     100 | 
  asyncHandler.ts          |     100 |      100 |     100 |     100 | 
---------------------------|---------|----------|---------|---------|-------------------

Test Suites: 13 passed, 13 total
Tests:       36 passed, 36 total