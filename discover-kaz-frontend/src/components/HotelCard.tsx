import { Link } from 'react-router-dom';
import { Star, MapPin } from 'lucide-react';
import type { Hotel } from '../types/index';
import { getImageUrl } from '../utils/media';

interface HotelCardProps {
  hotel: Hotel;
}

export function HotelCard({ hotel }: HotelCardProps) {
  return (
    <Link to={`/hotels/${hotel.id}`}>
      <div className="bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden">
        <div className="aspect-video bg-gray-200 overflow-hidden relative">
          <img
            src={hotel.image_url ? getImageUrl(hotel.image_url) : 'https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg?auto=compress&cs=tinysrgb&w=500'}
            alt={hotel.name}
            className="w-full h-full object-cover hover:scale-105 transition duration-300"
          />
          {hotel.tier && (
            <div className={`absolute top-2 right-2 px-2 py-1 rounded text-xs font-bold text-white uppercase tracking-wider ${hotel.tier === 'Luxury' ? 'bg-amber-500' : 'bg-blue-500'
              }`}>
              {hotel.tier}
            </div>
          )}
        </div>

        <div className="p-4">
          <h3 className="font-semibold text-lg text-gray-900 mb-2 line-clamp-1">
            {hotel.name}
          </h3>

          <div className="flex items-center gap-2 mb-3 text-sm text-gray-600">
            <MapPin className="w-4 h-4" />
            <span>{hotel.city || hotel.location}</span>
          </div>

          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {hotel.description}
          </p>

          <div className="flex items-center gap-2 mb-4">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="font-semibold text-gray-900">{hotel.rating.toFixed(1)}</span>
            </div>
            <span className="text-sm text-gray-600">({hotel.total_reviews} reviews)</span>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <span className="text-2xl font-bold text-gray-900">${hotel.price_per_night}</span>
              <span className="text-gray-600 text-sm">/night</span>
            </div>
            <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
              Book Now
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
