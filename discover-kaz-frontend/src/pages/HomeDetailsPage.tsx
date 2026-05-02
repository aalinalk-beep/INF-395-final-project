import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, MapPin, ChevronLeft, ChevronRight, MessageSquare } from 'lucide-react';
import { ReviewCard } from '../components/ReviewCard';
import { ReviewForm } from '../components/ReviewForm';
import { api } from '../services/api';
import { getImageUrl } from '../utils/media';
import type { Hotel, Review } from '../types/index';
import { useAuth } from '../contexts/AuthContext';

export function HotelDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState('1');
  const [bookingError, setBookingError] = useState('');
  const [showReviewForm, setShowReviewForm] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchHotelDetails = async () => {
      try {
        setLoading(true);
        const [hotelData, reviewsData] = await Promise.all([
          api.getHotel(id),
          api.getReviews(id),
        ]) as [any, any];
        
        setHotel(hotelData || null);
        setReviews(reviewsData.results || []);
      } catch (error) {
        console.error('Error fetching hotel details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHotelDetails();
  }, [id]);

  const handleBooking = async () => {
    if (!user || !token) {
      navigate('/login');
      return;
    }

    if (!checkIn || !checkOut) {
      setBookingError('Please select check-in and check-out dates');
      return;
    }

    if (!hotel) return;

    const nights = Math.ceil(
      (new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24)
    );

    if (nights <= 0) {
      setBookingError('Check-out date must be after check-in date');
      return;
    }

    const totalPrice = nights * Number(hotel.price_per_night);

    try {
      const bookingData = {
        hotel_id: hotel.id,
        check_in: checkIn,
        check_out: checkOut,
        guests: parseInt(guests),
        total_price: totalPrice,
        guest_email: user.email,
        guest_name: (user as any).name || user.email,
      };

      await api.createBooking(bookingData, token!);

      // Show success message and redirect
      alert(`Booking confirmed! Total: $${totalPrice} for ${nights} night(s)`);
      navigate('/bookings');
    } catch (error) {
      console.error('Error creating booking:', error);
      setBookingError('Failed to create booking. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-gray-200 rounded-lg h-96 animate-pulse mb-6" />
          <div className="bg-gray-200 rounded-lg h-32 animate-pulse" />
        </div>
      </div>
    );
  }

  if (!hotel) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-2xl font-bold text-gray-900">Hotel not found</h1>
        </div>
      </div>
    );
  }

  const images = Array.from(
    new Set([hotel.image_url, ...(hotel.gallery_urls || [])])
  ).filter((url): url is string => Boolean(url)).map(getImageUrl);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-white hover:text-blue-700 mb-6"
        >
          <ChevronLeft className="w-5 h-5" />
          Back
        </button>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-6">
              {images.length > 0 ? (
                <div className="relative">
                  <img
                    src={images[currentImageIndex]}
                    alt={hotel.name}
                    className="w-full h-96 object-cover"
                  />
                  {images.length > 1 && (
                  <>
                    <button
                      onClick={() => setCurrentImageIndex((i) => (i - 1 + images.length) % images.length)}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg hover:bg-white transition"
                    >
                      <ChevronLeft className="w-5 h-5 text-white" />
                    </button>
                    <button
                      onClick={() => setCurrentImageIndex((i) => (i + 1) % images.length)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg hover:bg-white transition"
                    >
                      <ChevronRight className="w-5 h-5 text-white" />
                    </button>
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                      {images.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => setCurrentImageIndex(idx)}
                          className={`w-1 h-1 rounded-full transition-all duration-300 ${
                            idx === currentImageIndex 
                              ? 'bg-white scale-125' 
                              : 'bg-white/50 hover:bg-white/75'
                          }`}
                          aria-label={`Go to image ${idx + 1}`}
                        />
                      ))}
                    </div>
                  </>
                )}
                </div>
              ) : (
                <div className="w-full h-96 bg-gray-200" />
              )}
            </div>

            <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">{hotel.name}</h1>

              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(hotel.rating)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-lg font-semibold text-gray-900">{hotel.rating.toFixed(1)}</span>
                <span className="text-gray-600">({hotel.total_reviews} reviews)</span>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-gray-400 mt-1" />
                  <div>
                    <p className="font-medium text-gray-900">{hotel.location}</p>
                    <p className="text-gray-600">{hotel.city}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">About</h3>
                <p className="text-gray-600 mb-4">{hotel.description}</p>
              </div>

              {hotel.amenities && hotel.amenities.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Amenities</h3>
                  <div className="grid sm:grid-cols-2 gap-2">
                    {hotel.amenities.map((amenity, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-gray-700">
                        <div className="w-2 h-2 bg-blue-600 rounded-full" />
                        {amenity}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Guest Reviews</h2>
                <button
                  onClick={() => setShowReviewForm(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  <MessageSquare className="w-4 h-4" />
                  Write Review
                </button>
              </div>
              {reviews.length === 0 ? (
                <p className="text-gray-600">No reviews yet. Be the first to review!</p>
              ) : (
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <ReviewCard key={review.id} review={review} />
                  ))}
                </div>
              )}
            </div>
          </div>

          {showReviewForm && (
            <ReviewForm
              hotelId={hotel.id}
              onSubmit={(newReview) => {
                setReviews([newReview, ...reviews]);
              }}
              onClose={() => setShowReviewForm(false)}
            />
          )}

          <div>
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-24">
              <div className="mb-6">
                <p className="text-gray-600 text-sm mb-2">Price per night</p>
                <p className="text-4xl font-bold text-gray-900">${hotel.price_per_night}</p>
              </div>

              {bookingError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded text-sm">
                  {bookingError}
                </div>
              )}

              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Check-in
                  </label>
                  <input
                    type="date"
                    value={checkIn}
                    onChange={(e) => {
                      setCheckIn(e.target.value);
                      setBookingError('');
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 cursor-pointer"
                    style={{ colorScheme: 'light' }}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Check-out
                  </label>
                  <input
                    type="date"
                    value={checkOut}
                    onChange={(e) => {
                      setCheckOut(e.target.value);
                      setBookingError('');
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 cursor-pointer"
                    style={{ colorScheme: 'light' }}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Guests
                  </label>
                  <select
                    value={guests}
                    onChange={(e) => setGuests(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900"
                  >
                    {Array.from({ length: 6 }).map((_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1} {i === 0 ? 'Guest' : 'Guests'}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                onClick={handleBooking}
                className="w-full px-4 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
              >
                {user ? 'Book Now' : 'Sign In to Book'}
              </button>

              <p className="text-center text-gray-600 text-sm mt-4">
                Available rooms: {hotel.available_rooms}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}