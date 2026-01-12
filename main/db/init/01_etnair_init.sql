
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =====================
-- ENUMS
-- =====================
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
    CREATE TYPE user_role AS ENUM ('TENANT', 'OWNER', 'ADMIN');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'booking_status') THEN
    CREATE TYPE booking_status AS ENUM ('PENDING', 'CONFIRMED', 'CANCELLED');
  END IF;
END$$;

-- =====================
-- USERS
-- =====================
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role user_role NOT NULL DEFAULT 'TENANT',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- =====================
-- PROPERTIES (avec image_url)
-- =====================
CREATE TABLE IF NOT EXISTS properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL,
  title VARCHAR(150) NOT NULL,
  description TEXT,
  price_per_night NUMERIC(10,2) NOT NULL CHECK (price_per_night >= 0),
  city VARCHAR(120) NOT NULL,
  address VARCHAR(255),
  max_guests INTEGER NOT NULL DEFAULT 1 CHECK (max_guests >= 1),
  image_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  CONSTRAINT fk_properties_owner
    FOREIGN KEY (owner_id)
    REFERENCES users(id)
    ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_properties_city ON properties(city);
CREATE INDEX IF NOT EXISTS idx_properties_owner_id ON properties(owner_id);

-- =====================
-- BOOKINGS
-- =====================
CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  property_id UUID NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  total_price NUMERIC(10,2) NOT NULL CHECK (total_price >= 0),
  status booking_status NOT NULL DEFAULT 'PENDING',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  CONSTRAINT fk_bookings_tenant
    FOREIGN KEY (tenant_id)
    REFERENCES users(id)
    ON DELETE RESTRICT,

  CONSTRAINT fk_bookings_property
    FOREIGN KEY (property_id)
    REFERENCES properties(id)
    ON DELETE CASCADE,

  CONSTRAINT chk_booking_dates
    CHECK (end_date > start_date)
);

CREATE INDEX IF NOT EXISTS idx_bookings_property_dates
  ON bookings(property_id, start_date, end_date);

CREATE INDEX IF NOT EXISTS idx_bookings_status
  ON bookings(status);

CREATE INDEX IF NOT EXISTS idx_bookings_tenant
  ON bookings(tenant_id);

-- =====================
-- PROPERTY AVAILABILITY
-- =====================
CREATE TABLE IF NOT EXISTS property_availability (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  is_available BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  CONSTRAINT fk_availability_property
    FOREIGN KEY (property_id)
    REFERENCES properties(id)
    ON DELETE CASCADE,

  CONSTRAINT chk_availability_dates
    CHECK (end_date > start_date)
);

CREATE INDEX IF NOT EXISTS idx_availability_property_dates
  ON property_availability(property_id, start_date, end_date);

-- =========================================================
-- PATCH SÉCURITÉ (DB déjà existante)
-- Ajout image_url si la colonne n'existe pas
-- =========================================================
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'properties'
      AND column_name = 'image_url'
  ) THEN
    ALTER TABLE properties ADD COLUMN image_url TEXT;
  END IF;
END$$;
