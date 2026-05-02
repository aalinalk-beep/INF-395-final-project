import { Star, ThumbsUp } from 'lucide-react';
import type { Review } from '../types/index';

interface ReviewCardProps {
  review: Review;
}

export function ReviewCard({ review }: ReviewCardProps) {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? 'fill-yellow-400 text-yellow-400' : 'fill-gray-300 text-gray-300'
        }`}
      />
    ));
  };

  return (
    <div className="bg-white rounded-lg p-4 border border-gray-200">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <span className="font-semibold text-blue-600">
              {review.user_email?.[0]?.toUpperCase() || 'U'}
            </span>
          </div>
          <div>
            <p className="font-medium text-gray-900">
              {review.user_email?.split('@')[0] || 'Anonymous'}
            </p>
            <p className="text-xs text-gray-500">
              {new Date(review.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1 mb-2">
        {renderStars(review.rating)}
      </div>

      {review.title && (
        <h4 className="font-semibold text-gray-900 mb-2">{review.title}</h4>
      )}

      <p className="text-gray-700 text-sm mb-3">{review.content}</p>

      {review.image_urls && review.image_urls.length > 0 && (
        <div className="flex gap-2 mb-3">
          {review.image_urls.slice(0, 3).map((url, idx) => (
            <img
              key={idx}
              src={url}
              alt={`Review image ${idx + 1}`}
              className="w-16 h-16 object-cover rounded"
            />
          ))}
        </div>
      )}

      <div className="flex items-center gap-2">
        <button className="flex items-center gap-1 text-sm text-white hover:text-blue-600 transition">
          <ThumbsUp className="w-4 h-4" />
          <span>Helpful ({review.helpful_count})</span>
        </button>
      </div>
    </div>
  );
}
