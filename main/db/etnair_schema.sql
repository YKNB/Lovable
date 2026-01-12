-- ETNAir - PostgreSQL schema 
-- Source initial: dbdiagram.io export 

BEGIN;

-- UUID generation
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Enums (idempotent-ish)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
    CREATE TYPE user_role AS ENUM ('TENANT', 'OWNER', 'ADMIN');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'booking_status') THEN
    CREATE TYPE booking_status AS ENUM ('PENDING', 'CONFIRMED', 'CANCELLED');
  END IF;
END$$;

-- updated_at trigger function
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Tables
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name varchar(100) NOT NULL,
  last_name varchar(100) NOT NULL,
  email varchar(255) NOT NULL UNIQUE,
  password_hash varchar(255) NOT NULL,
  role user_role NOT NULL DEFAULT 'TENANT',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS properties (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL,
  title varchar(150) NOT NULL,
  description text,
  price_per_night numeric(10,2) NOT NULL,
  city varchar(120) NOT NULL,
  address varchar(255),
  max_guests int NOT NULL DEFAULT 1,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),

  CONSTRAINT properties_price_non_negative CHECK (price_per_night >= 0),
  CONSTRAINT properties_max_guests_positive CHECK (max_guests >= 1)
);

CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL,
  property_id uuid NOT NULL,
  start_date date NOT NULL,
  end_date date NOT NULL,
  total_price numeric(10,2) NOT NULL,
  status booking_status NOT NULL DEFAULT 'PENDING',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),

  CONSTRAINT bookings_valid_dates CHECK (end_date > start_date),
  CONSTRAINT bookings_total_price_non_negative CHECK (total_price >= 0)
);

CREATE TABLE IF NOT EXISTS property_availability (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id uuid NOT NULL,
  start_date date NOT NULL,
  end_date date NOT NULL,
  is_available boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),

  CONSTRAINT availability_valid_dates CHECK (end_date > start_date)
);

-- Foreign keys (with sensible delete behavior)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'properties_owner_id_fkey'
  ) THEN
    ALTER TABLE properties
      ADD CONSTRAINT properties_owner_id_fkey
      FOREIGN KEY (owner_id) REFERENCES users(id)
      ON DELETE RESTRICT;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'bookings_tenant_id_fkey'
  ) THEN
    ALTER TABLE bookings
      ADD CONSTRAINT bookings_tenant_id_fkey
      FOREIGN KEY (tenant_id) REFERENCES users(id)
      ON DELETE RESTRICT;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'bookings_property_id_fkey'
  ) THEN
    ALTER TABLE bookings
      ADD CONSTRAINT bookings_property_id_fkey
      FOREIGN KEY (property_id) REFERENCES properties(id)
      ON DELETE CASCADE;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'availability_property_id_fkey'
  ) THEN
    ALTER TABLE property_availability
      ADD CONSTRAINT availability_property_id_fkey
      FOREIGN KEY (property_id) REFERENCES properties(id)
      ON DELETE CASCADE;
  END IF;
END$$;

-- Indexes (named, clean)
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

CREATE INDEX IF NOT EXISTS idx_properties_owner_id ON properties(owner_id);
CREATE INDEX IF NOT EXISTS idx_properties_city ON properties(city);

CREATE INDEX IF NOT EXISTS idx_bookings_tenant_id ON bookings(tenant_id);
CREATE INDEX IF NOT EXISTS idx_bookings_property_id ON bookings(property_id);
CREATE INDEX IF NOT EXISTS idx_bookings_property_dates ON bookings(property_id, start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);

CREATE INDEX IF NOT EXISTS idx_availability_property_id ON property_availability(property_id);
CREATE INDEX IF NOT EXISTS idx_availability_property_dates ON property_availability(property_id, start_date, end_date);

-- Triggers for updated_at
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_users_updated_at') THEN
    CREATE TRIGGER trg_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_properties_updated_at') THEN
    CREATE TRIGGER trg_properties_updated_at
    BEFORE UPDATE ON properties
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_bookings_updated_at') THEN
    CREATE TRIGGER trg_bookings_updated_at
    BEFORE UPDATE ON bookings
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();
  END IF;
END$$;

COMMIT;
