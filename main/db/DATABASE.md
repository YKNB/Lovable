# ETNAir 

Structure de la **base de données PostgreSQL** du projet **ETNAir**.

L’objectif de cette base est de gérer :
- les **utilisateurs** (locataires et propriétaires),
- les **logements** (annonces),
- les **réservations**,
- et les **périodes de disponibilité** (bonus).

---

## 1. Les tables principales

### 1.1 `users` – Utilisateurs
Cette table contient **tous les comptes** de la plateforme.

Un utilisateur peut être :
- **TENANT** : locataire (réserve des logements)
- **OWNER** : propriétaire (publie des annonces)
- **ADMIN** : administrateur (prévu pour plus tard)

**Champs importants :**
- `id` : identifiant unique (UUID)
- `first_name`, `last_name` : nom et prénom
- `email` : email unique (un seul compte par email)
- `password_hash` : mot de passe sécurisé (hashé)
- `role` : rôle de l’utilisateur
- `created_at`, `updated_at` : dates de création et de modification

---

### 1.2 `properties` – Logements / Annonces
Cette table représente les **logements mis en location** par les propriétaires.

**Champs importants :**
- `id` : identifiant du logement
- `owner_id` : propriétaire du logement (lien vers `users`)
- `title` : titre de l’annonce
- `description` : description du logement
- `price_per_night` : prix par nuit
- `city`, `address` : localisation
- `max_guests` : nombre maximum de personnes
- `created_at`, `updated_at`

**Règles importantes :**
- Un propriétaire peut avoir **plusieurs logements**
- Un logement appartient à **un seul propriétaire**
- Le prix ne peut pas être négatif
- Le nombre de personnes doit être au moins 1

---

### 1.3 `bookings` – Réservations
Cette table contient les **réservations effectuées par les locataires**.

**Champs importants :**
- `id` : identifiant de la réservation
- `tenant_id` : locataire qui réserve (lien vers `users`)
- `property_id` : logement réservé (lien vers `properties`)
- `start_date`, `end_date` : dates du séjour
- `total_price` : prix total du séjour
- `status` : état de la réservation (`PENDING`, `CONFIRMED`, `CANCELLED`)
- `created_at`, `updated_at`

**Règles importantes :**
- Un locataire peut faire **plusieurs réservations**
- Une réservation concerne **un seul logement**
- La date de fin doit être **après** la date de début
- Le prix total ne peut pas être négatif

---

### 1.4 `property_availability` – Disponibilités (Bonus)
Cette table permet de gérer les **périodes de disponibilité** d’un logement.

**Champs importants :**
- `id` : identifiant
- `property_id` : logement concerné
- `start_date`, `end_date` : période
- `is_available` : logement disponible ou non
- `created_at`

**Bonus** qui permet de savoir facilement si un logement est disponible sur une période donnée.

---

## 2. Relations entre les tables

- Un **utilisateur (OWNER)** peut avoir **plusieurs logements**
- Un **utilisateur (TENANT)** peut faire **plusieurs réservations**
- Un **logement** peut avoir **plusieurs réservations**
- Un **logement** peut avoir **plusieurs périodes de disponibilité**

Ces relations sont assurées grâce aux **clés étrangères (FOREIGN KEY)**.



## 3. Fonctionnement
1. Un **propriétaire** crée un compte et ajoute un logement.
2. Un **locataire** consulte les logements disponibles.
3. Le locataire fait une **réservation**.
4. La réservation est stockée dans la table `bookings`.
5. Les disponibilités du logement peuvent être mises à jour.

## 4. Fichiers liés à la base de données

- `etnair_schema.sql` : création complète de la base (tables, contraintes, triggers)
- `etnair_dump.sql` : dump PostgreSQL généré avec `pg_dump`
- `dbdiagram.io.pdf` : diagramme relationnel


## Commandes utiles 

- `Créer la base de données` : createdb etnair
- `Exécuter le script etnair_schema.sql` : psql -U postgres -d etnair -f etnair_schema.sql
- `Générer le dump PostgreSQL` : pg_dump -U postgres -d etnair > etnair_dump.sql