# 🌍 Lovable

> **Lovable** est une plateforme cloud-native de location courte et moyenne durée,  
> conçue et réalisée pour le client **SOGOGI**.

Le projet a été mené comme un **projet client réel**, avec une approche **produit**, **DevOps**, et **scalable**, depuis la conception de la base de données jusqu’au déploiement Kubernetes et à l’observabilité.

---

## ✨ Vision du projet

Lovable repose sur une conviction simple :

> *Un produit fiable ne repose pas uniquement sur du code fonctionnel,  
> mais sur une architecture maîtrisée, des déploiements automatisés  
> et une observabilité continue.*

Ce projet vise donc à démontrer :
- une **maîtrise full-stack**
- une **culture DevOps concrète**
- une **capacité à livrer un produit exploitable**

---

## 🎯 Objectifs

- Construire une **API robuste et sécurisée**
- Concevoir une **architecture cloud-native**
- Déployer une **infrastructure Kubernetes complète**
- Mettre en place une **CI/CD industrielle**
- Garantir **scalabilité, résilience et observabilité**
- Offrir une **expérience utilisateur fluide**

---

## 🧱 Architecture globale

Lovable est structuré autour de trois piliers :

1. **Frontend**  
2. **Backend API**  
3. **Infrastructure & Observabilité**

Le tout est orchestré via **Kubernetes**.

---

## 🛠️ Stack technique

### Backend
- Node.js / Express
- Prisma ORM
- PostgreSQL
- JWT (authentification & rôles)
- Swagger / OpenAPI
- Jest / Supertest
- MinIO (stockage objet S3)

### Frontend
- Framework moderne (Angular / React / Vue)
- Authentification JWT
- Routing et guards
- UI responsive
- Consommation API REST

### Infrastructure & DevOps
- Docker / Docker Compose
- Kubernetes (K3s / Minikube)
- GitLab CI/CD
- GitLab Runner auto-hébergé
- Helm
- Traefik / NGINX
- Prometheus / Grafana
- ELK / Loki
- Apache Bench / k6
- HPA (Horizontal Pod Autoscaler)

---

## 🔐 Sécurité & gouvernance

### Rôles utilisateurs

| Rôle   | Description |
|------|------------|
| TENANT | Peut rechercher et réserver un logement |
| OWNER  | Peut publier et gérer ses logements |
| ADMIN  | Prévu pour évolutions futures |

- Authentification JWT
- RBAC via middlewares
- Hash des mots de passe
- Validation stricte des entrées
- Accès contrôlé aux ressources

---

## 📦 Fonctionnalités principales

### 🔑 Authentification
- Inscription
- Connexion
- Génération de JWT
- Expiration et validation des tokens

---

### 🏠 Gestion des logements
- Création, modification, suppression
- Accès restreint au propriétaire
- Upload d’images (MinIO)
- Accès public à la consultation


➡️ *Postman – création / modification d’un logement*
![post-logement.PNG](https://www.dropbox.com/scl/fi/e0bf62zhxvdl75byrzlh4/post-logement.PNG?rlkey=b58wcuvvdrcbi64n11i1bmh4q&dl=0&raw=1)
---

### 📅 Gestion des réservations
- Workflow métier complet :
  - `PENDING`
  - `CONFIRMED`
  - `CANCELLED`
- Vérification des chevauchements de dates
- Règles différentes selon rôle (TENANT / OWNER)

![post-reservation.PNG](https://www.dropbox.com/scl/fi/h0uyzzhgchktbkro2btat/post-reservation.PNG?rlkey=cf0lkasz3excpoygwsct6dytw&dl=0&raw=1)
➡️ *Postman – workflow de réservation*

---

## 📖 Documentation API

L’API est entièrement documentée via **Swagger / OpenAPI**.

- Liste complète des endpoints
- Schémas des entités
- Authentification JWT intégrée
- Tests interactifs

![swagger.PNG](https://www.dropbox.com/scl/fi/j63j3tzwwjbzcelzpyc12/swagger.PNG?rlkey=wo91m5xp74dtauiu3afu4hsl9&dl=0&raw=1)
➡️ *Swagger UI – vue générale des endpoints*

---

## 🧪 Tests & qualité

- Tests unitaires et d’intégration
- Couverture élevée sur la logique métier
- Validation des routes sécurisées
- Tests des workflows critiques

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
➡️ *Rapport de couverture Jest*

---

## 🚀 CI/CD

Lovable dispose d’une **chaîne CI/CD complète** :

- Pipeline GitLab :
  - tests
  - build images Docker
  - push registry
  - déploiement Kubernetes
- GitLab Runner déployé sur le cluster
- Déploiement automatisé à chaque mise à jour

![gitlab-runner.PNG](https://www.dropbox.com/scl/fi/38nlvfrho93wo0qqsgta0/gitlab-runner.PNG?rlkey=utw4vs6mrxosgdvql11uqxo54&dl=0&raw=1)
![job.PNG](https://www.dropbox.com/scl/fi/mayhcoep3nesli8sirwts/job.PNG?rlkey=wugctbeie8ypucfvw04eq8ulg&dl=0&raw=1)

➡️ *GitLab CI – pipeline exécuté*

---

## ☸️ Kubernetes

Le cluster Kubernetes héberge :
- Backend API
- Base de données PostgreSQL
- Frontend
- MinIO
- Outils d’observabilité

- Services exposés via Ingress / Traefik
- Variables sensibles gérées via Secrets
- Configurations reproductibles

![Capture.PNG](https://www.dropbox.com/scl/fi/uacfgm5y9nsktxjvex0u8/Capture.PNG?rlkey=55n393jmc0uky2t7f88m3khdh&dl=0&raw=1)

![svc.PNG](https://www.dropbox.com/scl/fi/41gc3rhy3rfbk7s89hzzi/svc.PNG?rlkey=ykxu1iysll98zi6f8msdddfxy&dl=0&raw=1)
➡️ *kubectl get pods / services*

---

## 📦 Stockage objet (MinIO)

- Stockage S3 compatible
- Gestion des images des logements
- Bucket public / privé selon besoin
- Intégration directe avec l’API

![minio.PNG](https://www.dropbox.com/scl/fi/onjv3oz01qpty7d0js28a/minio.PNG?rlkey=czah19m363m9xbt8vyu7l46og&dl=0&raw=1)

![minio-2.PNG](https://www.dropbox.com/scl/fi/2swc5adlrv7rxuwlupjzq/minio-2.PNG?rlkey=c2h8luzwnquxoahiiae56zr65&dl=0&raw=1)


➡️ *Interface MinIO – bucket & objets*

---

## 📊 Observabilité

### Monitoring
- Prometheus collecte les métriques
- Grafana expose des dashboards :
  - CPU / RAM
  - Pods
  - Services
  - Requêtes HTTP

![grafana.PNG](https://www.dropbox.com/scl/fi/9wvogb109qtshzi0bu6nn/grafana.PNG?rlkey=xe3hkefgnzqhh9g7w1vlwy6t5&dl=0&raw=1)
![kubelets.PNG](https://www.dropbox.com/scl/fi/9u1oszn266ku7mo3zj831/kubelets.PNG?rlkey=s79fmgy6sm8aaaczud6rc6q2o&dl=0&raw=1)

![kl.PNG](https://www.dropbox.com/scl/fi/2ez95nnfry4x1cutln208/kl.PNG?rlkey=oxjw0jwaitw8b9jtw999be52u&dl=0&raw=1)
➡️ *Grafana – dashboard Kubernetes*

---

### Logs
- Centralisation des logs (ELK / Loki)
- Analyse des erreurs
- Aide au debugging en production
➡️ *Logs centralisés*

---

## ⚡ Tests de charge & scalabilité

- Tests réalisés avec Apache Bench / k6
- Simulation de charge API / frontend
- Analyse des temps de réponse
- Mise en place d’un **Horizontal Pod Autoscaler**

![test_charge.PNG](https://www.dropbox.com/scl/fi/p5x9los9efdaen7wp9tjx/test_charge.PNG?rlkey=6ob7oa9u8rk1bk7zxtkyfnlil&dl=0&raw=1)
➡️ *Résultats de tests de charge*

---
###  🖥️ Frontend Angular

Exemple :

![frontend.PNG](https://www.dropbox.com/scl/fi/q3osizsjnjy316b01z8hs/frontend.PNG?rlkey=t5an1e046uugy7ecxqm1hqw1o&dl=0&raw=1)


## 📐 Schéma d’architecture

```text
                 ┌──────────────┐
                 │   Utilisateur │
                 └───────┬──────┘
                         │
                    Ingress / Traefik
                         │
        ┌────────────────┴────────────────┐
        │                                 │
┌──────────────┐                  ┌──────────────┐
│  Frontend    │                  │   Backend API│
│ (Angular)    │                  │ (Node/Express│
└──────────────┘                  └───────┬──────┘
                                           │
                         ┌─────────────────┼─────────────────┐
                         │                 │                 │
                 ┌──────────────┐   ┌──────────────┐   ┌──────────────┐
                 │ PostgreSQL   │   │    MinIO      │   │ Prometheus   │
                 │ (DB)         │   │ (S3 Storage)  │   │ / Grafana    │
                 └──────────────┘   └──────────────┘   └──────────────┘


## ✅ Run en local (Developer Experience)

### Prérequis
- Node.js (LTS recommandé)
- Docker + Docker Compose
- PostgreSQL (si exécution sans Docker)
- Kubernetes (Minikube ou K3s) si exécution k8s
- kubectl + helm

---

## 🔥 Backend API (Node.js / Express / Prisma)

### 1) Variables d’environnement
Créer un fichier `.env` dans `/api` :

```env
DATABASE_URL="postgresql://<user>:<password>@localhost:5432/<db>"
JWT_SECRET="dev_secret"
PORT=3000
# (optionnel pour MinIO)
S3_ENDPOINT="http://localhost:9000"
S3_ACCESS_KEY="minioadmin"
S3_SECRET_KEY="minioadmin"
S3_BUCKET="lovable"
S3_REGION="us-east-1"


###  Installer / générer Prisma / migrer

npm install
npx prisma generate
npx prisma migrate dev

### Lancer l’API dans /api 

npm run dev
API : http://localhost:3000

Swagger : http://localhost:3000/api-docs


➡️ Swagger UI ouvert sur /api-docs

###  🖥️ Frontend Angular

Exemple :

environment.ts (dev) : apiBaseUrl = "http://localhost:3000"

environment.prod.ts : URL exposée par Kubernetes (Ingress/NodePort)


➡️ Page de login + appels API visibles dans Network

2) Installer / lancer

Depuis /frontend :

npm install
npm start
# ou
ng serve


 
🐳 Run avec Docker Compose (API + DB + outils)

Environnement local reproductible, idéal pour dev & démo. 

C2W-CBI1 _ ETNAir _ step01 _ IS…

Démarrer

À la racine :

docker compose up --build -d


Exemples de services :

API : http://localhost:3000

Swagger : http://localhost:3000/api-docs

PostgreSQL : localhost:5432

pgAdmin : http://localhost:5050 (si présent)

➡️ docker compose ps

☸️ Run avec Kubernetes (cluster)

Déploiement backend + DB, exposition réseau, et intégration progressive frontend + obs.

1) Déployer l’infra principale

Exemples (noms à adapter à ton repo) :

kubectl apply -f k8s/etnair-k8s.yaml

2) Initialiser la DB (Job + ConfigMap)
kubectl apply -f k8s/etnair-db-init.yaml
kubectl apply -f k8s/etnair-db-job.yaml

3) Tester l’API

Option A: Port-forward (local)

kubectl -n lovable port-forward svc/lovable-api 3000:3000


Option B: NodePort / Ingress (cluster)

Exemple NodePort API : http://<node-ip>:30080/health

📸 Capture à insérer ici
➡️ kubectl get pods -A + svc + ingress

🧩 DevOps & Observabilité (fichiers expliqués)

Cette section sert de “carte du trésor” : où est quoi, et à quoi ça sert.

📁 Kubernetes manifests (core)

k8s/etnair-k8s.yaml

Déploie API + PostgreSQL

Services associés (ClusterIP/NodePort)

k8s/etnair-db-init.yaml

ConfigMap SQL d’initialisation (types, tables, extensions)

k8s/etnair-db-job.yaml

Job qui exécute l’init DB au démarrage

Ces livrables sont alignés avec les exigences “API + DB sur K8s”.

🧪 CI/CD (GitLab)

.gitlab-ci.yml

Stages typiques : test, build, deploy

Runner auto-hébergé sur cluster via Helm

Déploiement via kubectl apply (ou Helm chart)

📸 Capture à insérer ici
➡️ Pipeline GitLab réussi + runner enregistré

Exigence “CI/CD + Runner + MinIO” 

C2W-CBI1 _ ETNAir _ step03 _ ISR

🪣 MinIO (stockage S3)

k8s/minio.yaml (ou Helm values)

Déploiement de MinIO

Bucket dédié aux images (ex: lovable)

Mode public/privé selon besoin

📸 Capture à insérer ici
➡️ MinIO UI: bucket + objets uploadés

MinIO est explicitement demandé/encouragé pour l’upload images.

📊 Monitoring: Prometheus / Grafana

monitoring/ (dossier recommandé)

installation Prometheus + Grafana (Helm chart souvent)

dashboards Kubernetes + API

Exemples de fichiers :

monitoring/kube-prometheus-stack.values.yaml

valeurs Helm pour stack Prometheus/Grafana

monitoring/grafana-dashboards/

dashboards JSON (K8s, Node exporter, HTTP, etc.)

➡️ Grafana dashboard K8s CPU/RAM + HTTP requests

Monitoring avancé et dashboards sont attendus. 

C2W-CBI1 _ ETNAir _ step04 _ IS…

🌐 Blackbox exporter (disponibilité / endpoints)

Pour vérifier la santé des endpoints exposés (API, frontend, MinIO) :

monitoring/blackbox/blackbox-deploy.yaml

monitoring/blackbox/blackbox-config.yaml

monitoring/blackbox/blackbox-targets.yaml

Concept :

Prometheus scrappe Blackbox

Blackbox probe des URLs

Dashboard Grafana montre up/down + latence

➡️ Grafana panel: blackbox probe success + latency

⚡ Tests de charge (ab / k6) + scalabilité

Objectif : mesurer, interpréter, puis autoscaler (HPA). 

C2W-CBI1 _ ETNAir _ step04 _ IS…

✅ Apache Bench (ab)

Exemple simple sur l’API health :

ab -n 5000 -c 50 http://<node-ip>:30080/health


Benchmarking 172.16.250.11 (be patient)
Completed 500 requests
Completed 1000 requests
Completed 1500 requests
Completed 2000 requests
Completed 2500 requests
Completed 3000 requests
Completed 3500 requests
Completed 4000 requests
Completed 4500 requests
Completed 5000 requests
Finished 5000 requests


Server Software:
Server Hostname:        172.16.250.11
Server Port:            30080

Document Path:          /health
Document Length:        11 bytes

Concurrency Level:      50
Time taken for tests:   8.724 seconds
Complete requests:      5000
Failed requests:        0
Total transferred:      4445000 bytes
HTML transferred:       55000 bytes
Requests per second:    573.12 [#/sec] (mean)
Time per request:       87.241 [ms] (mean)
Time per request:       1.745 [ms] (mean, across all concurrent requests)
Transfer rate:          497.57 [Kbytes/sec] received

Connection Times (ms)
              min  mean[+/-sd] median   max
Connect:        0    0   0.6      0      10
Processing:    17   86  21.6     77     179
Waiting:        4   86  21.9     77     179
Total:         17   87  21.6     77     179

Percentage of the requests served within a certain time (ms)
  50%     77
  66%     87
  75%     98
  80%    107
  90%    120
  95%    131
  98%    144
  99%    156
 100%    179 (longest request)

📸 Capture à insérer ici
➡️ Résultat terminal ab

✅ k6 (plus réaliste)

Exemple fichier loadtests/api-smoke.js :

ramp-up progressif

seuils (thresholds) sur latence et erreurs

export vers JSON/Influx si souhaité


➡️ Résultats k6 (checks, http_req_duration, http_req_failed)

📈 HPA (Horizontal Pod Autoscaler)

Objectif : augmenter automatiquement le nombre de pods selon CPU / métriques.

Exemple (CPU) :

kubectl autoscale deployment lovable-api -n lovable --cpu-percent=70 --min=2 --max=10



➡️ kubectl get hpa -n lovable (scaling en action)
