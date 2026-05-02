const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

interface RequestOptions extends RequestInit {
  token?: string;
}

interface UserResponse {
  id: string;
  email: string;
  name?: string;
}

interface AuthResponse {
  access: string;
  refresh: string;
  user: UserResponse;
}

class ApiService {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<T> {
    const { token, ...fetchOptions } = options;

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (fetchOptions.headers) {
      Object.assign(headers, fetchOptions.headers);
    }

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...fetchOptions,
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({
        message: response.statusText,
      }));
      console.error('❌ API Error:', response.status, errorData);
      const error: any = new Error(errorData.message || 'Request failed');
      error.response = {
        status: response.status,
        data: errorData,
      };
      throw error;
    }

    return response.json();
  }

  // Auth endpoints
  async signUp(email: string, password: string, name: string) {
    return this.request('/auth/register/', {
      method: 'POST',
      body: JSON.stringify({ email, password, name }),
    });
  }

  async signIn(email: string, password: string) {
    return this.request<AuthResponse>(
      '/auth/login/',
      {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      }
    );
  }

  async signOut(token: string) {
    return this.request('/auth/logout/', {
      method: 'POST',
      token,
    });
  }

  async getCurrentUser(token: string) {
    return this.request<UserResponse>('/auth/user/', {
      method: 'GET',
      token,
    });
  }

  // Hotels endpoints
  async getHotels() {
    return this.request('/hotels/');
  }

  async getHotel(id: string) {
    return this.request(`/hotels/${id}/`);
  }

  // Destinations endpoints
  async getDestinations() {
    return this.request('/destinations/');
  }

  async getDestination(id: string) {
    return this.request(`/destinations/${id}/`);
  }

  // Events endpoints
  async getEvents() {
    return this.request('/events/');
  }

  // Bookings endpoints
  async getBookings(token: string) {
    return this.request('/bookings/', {
      method: 'GET',
      token,
    });
  }

  async createBooking(bookingData: any, token: string) {
    return this.request('/bookings/', {
      method: 'POST',
      body: JSON.stringify(bookingData),
      token,
    });
  }

  async updateBooking(id: string, data: any, token: string) {
    return this.request(`/bookings/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify(data),
      token,
    });
  }

  async cancelBooking(id: string, token: string) {
    return this.request(`/bookings/${id}/cancel/`, {
      method: 'POST',
      token,
    });
  }

  // Reviews endpoints
  async getReviews(hotelId: string) {
    return this.request(`/hotels/${hotelId}/reviews/`);
  }

  async createReview(reviewData: any, token: string) {
    return this.request('/reviews/', {
      method: 'POST',
      body: JSON.stringify(reviewData),
      token,
    });
  }
}

export const api = new ApiService(API_BASE_URL);
