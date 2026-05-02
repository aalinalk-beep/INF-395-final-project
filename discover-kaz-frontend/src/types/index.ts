export interface User {
  id: string;
  email: string;
  user_metadata?: {
    name?: string;
  };
}

export interface Destination {
  id: string;
  name: string;
  description: string;
  long_description?: string;
  image_url?: string;
  gallery_urls?: string[];
  location?: string;
  latitude?: number;
  longitude?: number;
  best_season?: string;
  highlights?: string[];
  transport_options?: string;
  created_at: string;
}

export interface Hotel {
  id: string;
  name: string;
  description?: string;
  image_url?: string;
  gallery_urls?: string[];
  location?: string;
  latitude?: number;
  longitude?: number;
  city?: string;
  amenities?: string[];
  rating: number;
  total_reviews: number;
  price_per_night: number;
  available_rooms: number;
  created_at: string;
  updated_at: string;
  tier?: 'Luxury' | 'Standard';
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  latitude?: number;
  longitude?: number;
  image_url?: string;
  created_at: string;
}

export interface Booking {
  id: string;
  user_id: string;
  hotel_id: string;
  check_in: string;
  check_out: string;
  guests: number;
  total_price: number;
  status: 'active' | 'cancelled';
  guest_email?: string;
  guest_name?: string;
  guest_phone?: string;
  created_at: string;
}

export interface Review {
  id: string;
  user_id: string;
  hotel_id: string;
  rating: number;
  title?: string;
  content: string;
  helpful_count: number;
  image_urls?: string[];
  created_at: string;
  updated_at: string;
  user_email?: string;
}
