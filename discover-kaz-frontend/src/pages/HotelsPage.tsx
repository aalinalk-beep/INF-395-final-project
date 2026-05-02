import { useState, useEffect } from 'react';
import { Star, MapPin, DollarSign, Filter } from 'lucide-react';
import { HotelCard } from '../components/HotelCard';
import { api } from '../services/api';
import type { Hotel } from '../types/index';

export function HotelsPage() {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [filteredHotels, setFilteredHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(500);
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState('rating');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        setLoading(true);
        const response = await api.getHotels() as any;
        const hotelsData = response.results || [];
        setHotels(hotelsData);
        setFilteredHotels(hotelsData);
      } catch (error) {
        console.error('Error fetching hotels:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHotels();
  }, []);

  useEffect(() => {
    let result = [...hotels];

    // Price filter
    result = result.filter((h) => h.price_per_night >= minPrice && h.price_per_night <= maxPrice);
    
    // Rating filter
    if (minRating > 0) {
      result = result.filter((h) => h.rating >= minRating);
    }

    // Sorting
    if (sortBy === 'price-low') {
      result.sort((a, b) => a.price_per_night - b.price_per_night);
    } else if (sortBy === 'price-high') {
      result.sort((a, b) => b.price_per_night - a.price_per_night);
    } else if (sortBy === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    }

    setFilteredHotels(result);
  }, [hotels, minPrice, maxPrice, minRating, sortBy]);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Find Hotels in Kazakhstan</h1>

        <div className="grid lg:grid-cols-4 gap-8">
          <div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden w-full mb-4 px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center justify-center gap-2"
            >
              <Filter className="w-4 h-4" />
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </button>

            <div className={`bg-white rounded-lg shadow-md p-6 ${showFilters ? 'block' : 'hidden lg:block'}`}>
              <h3 className="font-semibold text-gray-900 mb-4">Filters</h3>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sort By
                  </label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900"
                  >
                    <option value="rating">Highest Rating</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 items-center gap-2">
                    <DollarSign className="w-4 h-4" />
                    Price Range
                  </label>
                  <div className="space-y-2">
                    <input
                      type="range"
                      min="0"
                      max="500"
                      value={minPrice}
                      onChange={(e) => setMinPrice(Number(e.target.value))}
                      className="w-full"
                    />
                    <input
                      type="range"
                      min="0"
                      max="500"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(Number(e.target.value))}
                      className="w-full"
                    />
                    <div className="text-sm text-gray-600">
                      ${minPrice} - ${maxPrice}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 items-center gap-2">
                    <Star className="w-4 h-4" />
                    Minimum Rating
                  </label>
                  <select
                    value={minRating}
                    onChange={(e) => setMinRating(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900"
                  >
                    <option value="0">All Ratings</option>
                    <option value="3">3+ Stars</option>
                    <option value="4">4+ Stars</option>
                    <option value="4.5">4.5+ Stars</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-3">
            {loading ? (
              <div className="space-y-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="bg-gray-200 rounded-lg h-48 animate-pulse" />
                ))}
              </div>
            ) : filteredHotels.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 text-lg">No hotels found matching your criteria</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {filteredHotels.map((hotel) => (
                  <HotelCard key={hotel.id} hotel={hotel} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
