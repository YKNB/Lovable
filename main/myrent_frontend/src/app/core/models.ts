export type Role = 'TENANT' | 'OWNER' | 'ADMIN';

export interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: Role;
  created_at?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface Property {
  id: string;
  owner_id: string;
  title: string;
  description?: string | null;
  price_per_night: string;
  city: string;
  address?: string | null;
  max_guests?: number | null;
  image_url?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface PropertyCreateBody {
  title: string;
  description?: string | null;
  price_per_night: number;
  city: string;
  address?: string | null;
  max_guests?: number | null;
  image_url?: string | null;
}

export interface PropertyUpdateBody {
  title?: string;
  description?: string | null;
  price_per_night?: number;
  city?: string;
  address?: string | null;
  max_guests?: number | null;
  image_url?: string | null;
}

export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED';

export interface Booking {
  id: string;
  tenant_id: string;
  property_id: string;
  start_date: string;
  end_date: string;
  total_price: string;
  status: BookingStatus;
  created_at?: string;
  updated_at?: string;
}

export interface BookingCreateBody {
  property_id: string;
  start_date: string;
  end_date: string;
}

export interface BookingWithPropertyLite extends Booking {
  properties?: {
    id: string;
    title: string;
    city: string;
    price_per_night: string;
  };
}
