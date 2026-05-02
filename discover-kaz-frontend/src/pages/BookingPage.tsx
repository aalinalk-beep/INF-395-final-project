import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, DollarSign } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';
import type { Booking } from '../types/index';

interface BookingWithHotel extends Booking {
  hotel_name?: string;
}

export function BookingsPage() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<BookingWithHotel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      navigate('/login');
      return;
    }

    const fetchBookings = async () => {
      try {
        setLoading(true);
        const authToken = localStorage.getItem('auth_token');
        if (!authToken) {
          navigate('/login');
          return;
        }

        const response = await api.getBookings(authToken) as any;
        const bookingsData = response.results || [];
        
        // Fetch hotel details for each booking
        const bookingsWithHotels = await Promise.all(
          bookingsData.map(async (booking: any) => {
            try {
              const hotel = await api.getHotel(booking.hotel_id || booking.hotel) as any;
              return {
                ...booking,
                hotel_name: hotel.name || 'Hotel',
              };
            } catch (error) {
              return {
                ...booking,
                hotel_name: 'Hotel',
              };
            }
          })
        );

        setBookings(bookingsWithHotels);
      } catch (error) {
        console.error('Error fetching bookings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [user, authLoading, navigate]);

  const handleCancelBooking = async (bookingId: string) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;

    try {
      const authToken = localStorage.getItem('auth_token');
      if (!authToken) {
        navigate('/login');
        return;
      }

      await api.cancelBooking(bookingId, authToken);

      // Update booking status in state
      const updatedBookings = bookings.map((b) => 
        b.id === bookingId ? { ...b, status: 'cancelled' as const } : b
      );
      setBookings(updatedBookings);

      alert('Booking cancelled successfully');
    } catch (error) {
      console.error('Error cancelling booking:', error);
      alert('Failed to cancel booking. Please try again.');
    }
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      active: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    };

    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800'}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-gray-200 rounded-lg h-96 animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">My Bookings</h1>

        {bookings.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 text-lg mb-6">You haven't made any bookings yet</p>
            <button
              onClick={() => navigate('/hotels')}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Browse Hotels
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <div key={booking.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">{booking.hotel_name}</h3>
                      <p className="text-gray-600 text-sm">{booking.guest_email}</p>
                    </div>
                    {getStatusBadge(booking.status)}
                  </div>

                  <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div>
                      <p className="text-sm text-gray-600 flex items-center gap-1 mb-1">
                        <Calendar className="w-4 h-4" />
                        Check-in
                      </p>
                      <p className="font-semibold text-gray-900">
                        {new Date(booking.check_in).toLocaleDateString()}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-600 flex items-center gap-1 mb-1">
                        <Calendar className="w-4 h-4" />
                        Check-out
                      </p>
                      <p className="font-semibold text-gray-900">
                        {new Date(booking.check_out).toLocaleDateString()}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-600 mb-1">Guests</p>
                      <p className="font-semibold text-gray-900">{booking.guests}</p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-600 flex items-center gap-1 mb-1">
                        <DollarSign className="w-4 h-4" />
                        Total
                      </p>
                      <p className="font-semibold text-gray-900">${booking.total_price}</p>
                    </div>
                  </div>

                  {booking.status !== 'cancelled' && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => navigate(`/hotels/${booking.hotel_id}`)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                      >
                        View Hotel
                      </button>
                      <button
                        onClick={() => handleCancelBooking(booking.id)}
                        className="px-4 py-2 border border-red-600 text-red-600 rounded-lg hover:bg-red-50 transition"
                      >
                        Cancel Booking
                      </button>
                    </div>
                  )}

                  {booking.status === 'cancelled' && (
                    <p className="text-red-600 text-sm">This booking has been cancelled</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
