import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { HotelCard } from '../components/HotelCard';
import { api } from '../services/api';
import { getImageUrl } from '../utils/media';
import type { Destination, Hotel } from '../types/index';

export function DestinationDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [destination, setDestination] = useState<Destination | null>(null);
  const [nearbyHotels, setNearbyHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (!id) return;

    const fetchDestinationDetails = async () => {
      try {
        setLoading(true);
        const [destinationData, hotelsData] = await Promise.all([
          api.getDestination(id),
          api.getHotels(),
        ]) as [any, any];

        setDestination(destinationData || null);
        setNearbyHotels((hotelsData.results || []).slice(0, 6));
      } catch (error) {
        console.error('Error fetching destination details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDestinationDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-5xl mx-auto px-4">
          <div className="bg-gray-200 rounded-lg h-96 animate-pulse mb-6" />
          <div className="bg-gray-200 rounded-lg h-32 animate-pulse" />
        </div>
      </div>
    );
  }

  if (!destination) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h1 className="text-2xl font-bold text-gray-900">Destination not found</h1>
        </div>
      </div>
    );
  }


  const images = Array.from(
    new Set([destination.image_url, ...(destination.gallery_urls || [])])
  ).filter((url): url is string => Boolean(url)).map(getImageUrl);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-white hover:text-blue-700 mb-6"
        >
          <ChevronLeft className="w-5 h-5" />
          Back
        </button>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
          {images.length > 0 ? (
            <div className="relative h-96">
              <img
                src={images[currentImageIndex]}
                alt={destination.name}
                className="w-full h-full object-cover"
              />
              {images.length > 1 && (
                <>
                  <button
                    onClick={() => setCurrentImageIndex((i) => (i - 1 + images.length) % images.length)}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg hover:bg-white transition"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={() => setCurrentImageIndex((i) => (i + 1) % images.length)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg hover:bg-white transition"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                    {images.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentImageIndex(idx)}
                        className={`w-1 h-1 rounded-full transition-all duration-300  ${idx === currentImageIndex
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

        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{destination.name}</h1>

          <div className="flex items-center gap-6 mb-6 flex-wrap">
            <div className="flex items-center gap-2 text-gray-600">
              <MapPin className="w-5 h-5" />
              <span>{destination.location}</span>
            </div>
            {destination.best_season && (
              <div className="flex items-center gap-2 text-gray-600">
                <Calendar className="w-5 h-5" />
                <span>Best season: {destination.best_season}</span>
              </div>
            )}
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">About</h2>
            <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
              {destination.long_description || destination.description}
            </p>
          </div>

          {destination.transport_options && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">How to get there</h2>
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                <p className="text-gray-700 leading-relaxed">
                  {destination.transport_options}
                </p>
              </div>
            </div>
          )}

          {destination.highlights && destination.highlights.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Highlights</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {destination.highlights.map((highlight: string, idx: number) => (
                  <div key={idx} className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 shrink-0" />
                    <span className="text-gray-700">{highlight}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {nearbyHotels.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Hotels Near This Destination</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {nearbyHotels.map((hotel) => (
                <HotelCard key={hotel.id} hotel={hotel} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div >
  );
}
