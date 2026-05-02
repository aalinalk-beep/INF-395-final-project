import { Link } from 'react-router-dom';
import { MapPin, Calendar } from 'lucide-react';
import type { Destination } from '../types/index';
import { getImageUrl } from '../utils/media';

interface DestinationCardProps {
  destination: Destination;
}

export function DestinationCard({ destination }: DestinationCardProps) {
  return (
    <Link to={`/destinations/${destination.id}`}>
      <div className="bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden group">
        <div className="aspect-video bg-gray-200 overflow-hidden relative">
          <img
            src={destination.image_url ? getImageUrl(destination.image_url) : 'https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg?auto=compress&cs=tinysrgb&w=500'}
            alt={destination.name}
            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
          />
          <div className="absolute inset-0 group-hover:bg-opacity-10 transition" />
        </div>

        <div className="p-4">
          <h3 className="font-semibold text-lg text-gray-900 mb-2">
            {destination.name}
          </h3>

          <div className="flex items-center gap-2 mb-3 text-sm text-gray-600">
            <MapPin className="w-4 h-4" />
            <span>{destination.location}</span>
          </div>

          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {destination.description}
          </p>

          {destination.best_season && (
            <div className="flex items-center gap-2 text-sm text-blue-600 mb-4">
              <Calendar className="w-4 h-4" />
              <span>Best season: {destination.best_season}</span>
            </div>
          )}

          {destination.highlights && destination.highlights.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {destination.highlights.slice(0, 3).map((highlight: string, idx: number) => (
                <span
                  key={idx}
                  className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded"
                >
                  {highlight}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
