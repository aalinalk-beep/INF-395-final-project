import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, Calendar, Users } from 'lucide-react';
import { HotelCard } from '../components/HotelCard';
import { DestinationCard } from '../components/DestinationCard';
import { EventsMap } from '../components/EventsMap';
import { api } from '../services/api';
import type { Hotel, Destination } from '../types/index';

export function HomePage() {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState('1');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [hotelsResponse, destinationsResponse] = await Promise.all([
          api.getHotels(),
          api.getDestinations(),
        ]) as [any, any];

        // API returns paginated results
        setHotels(hotelsResponse.results || []);
        setDestinations(destinationsResponse.results || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSearch = () => {
    if (checkIn && checkOut) {
      const params = new URLSearchParams({
        checkIn,
        checkOut,
        guests,
      });
      window.location.href = `/hotels?${params.toString()}`;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div
        className="relative bg-cover bg-center h-[700px] flex items-center justify-center"
        style={{
          backgroundImage: "url('/diskazakhstan.png')",
          backgroundAttachment: 'fixed',
        }}
      >
        <div className="absolute inset-0" />
        <div className="relative z-10 text-center text-white max-w-2xl mx-auto px-4">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">Discover Kazakhstan</h1>
          <p className="text-lg md:text-xl mb-8">
            Explore stunning landscapes, vibrant cities, and warm hospitality
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-lg p-6 -mt-20 relative z-20 mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Find Your Perfect Stay</h2>

          <div className="grid md:grid-cols-4 gap-4 mb-6">
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <MapPin className="w-4 h-4 mr-2 text-blue-600" />
                Location
              </label>
              <input
                type="text"
                placeholder="City or hotel name"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-400"
              />
            </div>

            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4 mr-2 text-blue-600" />
                Check-in
              </label>
              <input
                type="date"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 cursor-pointer scheme-light"
                style={{ colorScheme: 'light' }}
              />
            </div>

            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4 mr-2 text-blue-600" />
                Check-out
              </label>
              <input
                type="date"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                min={checkIn || new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 cursor-pointer scheme-light"
                style={{ colorScheme: 'light' }}
              />
            </div>

            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <Users className="w-4 h-4 mr-2 text-blue-600" />
                Guests
              </label>
              <select
                value={guests}
                onChange={(e) => setGuests(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
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
            onClick={handleSearch}
            className="w-full px-8 py-3 bg-linear-to-r from-blue-600 to-blue-800 text-white rounded-lg hover:from-blue-700 hover:to-blue-900 transition flex items-center justify-center gap-2"
          >
            <Search className="w-5 h-5" />
            Search Hotels
          </button>
        </div>

        <section className="bg-white rounded-lg shadow-md p-8 mb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Top Destinations</h2>
            <Link to="/destinations" className="text-blue-600 hover:text-blue-700 font-semibold">
              View All →
            </Link>
          </div>

          {loading ? (
            <div className="grid md:grid-cols-5 gap-6">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="bg-gray-200 rounded-lg h-64 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-5 gap-6">
              {destinations.map((destination) => (
                <DestinationCard key={destination.id} destination={destination} />
              ))}
            </div>
          )}
        </section>

        <section className="bg-white rounded-lg shadow-md p-8 mb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Featured Hotels</h2>
            <Link to="/hotels" className="text-blue-600 hover:text-blue-700 font-semibold">
              View All →
            </Link>
          </div>

          {loading ? (
            <div className="grid md:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-gray-200 rounded-lg h-80 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-6">
              {hotels.map((hotel) => (
                <HotelCard key={hotel.id} hotel={hotel} />
              ))}
            </div>
          )}
        </section>

        <section className="mb-16">
          <EventsMap />
        </section>

        <section className="bg-linear-to-r from-blue-600 to-blue-800 rounded-lg p-12 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">Why Choose Us?</h2>
          <div className="grid md:grid-cols-3 gap-8 mt-8">
            <div>
              <div className="text-4xl font-bold mb-2">500+</div>
              <p>Premium Hotels & Accommodations</p>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">10K+</div>
              <p>Verified Guest Reviews</p>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">24/7</div>
              <p>Customer Support</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
