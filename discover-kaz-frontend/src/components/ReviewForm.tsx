import React, { useState } from 'react';
import { Star, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext.tsx';
import { api } from '../services/api';

interface ReviewFormProps {
  hotelId: string;
  onSubmit: (review: any) => void;
  onClose: () => void;
}

export function ReviewForm({ hotelId, onSubmit, onClose }: ReviewFormProps) {
  const { user } = useAuth();
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!user) {
      setError('Please sign in to submit a review');
      return;
    }

    if (!content.trim()) {
      setError('Please write a review');
      return;
    }

    setLoading(true);

    try {
      const authToken = localStorage.getItem('auth_token');
      if (!authToken) {
        setError('Please sign in to submit a review');
        setLoading(false);
        return;
      }

      const reviewData = {
        hotel: hotelId,
        rating,
        title: title || '',
        content,
      };

      const newReview = await api.createReview(reviewData, authToken);
      onSubmit(newReview);
      onClose();
    } catch (error: any) {
      console.error('❌ Error submitting review:', error);
      console.error('❌ Error response:', error.response?.data);
      console.error('❌ Error status:', error.response?.status);
      const errorMsg = error.response?.data?.message || 
                       JSON.stringify(error.response?.data) || 
                       'Failed to submit review. Please try again.';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Write a Review</h2>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-400"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rating
            </label>
            <div className="flex gap-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <button
                  key={i + 1}
                  type="button"
                  onClick={() => setRating(i + 1)}
                  className="focus:outline-none"
                >
                  <Star
                    className={`w-8 h-8 transition ${
                      i < rating
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300 cursor-pointer'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title (Optional)
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Summarize your experience"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-400"
              maxLength={100}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Review
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Share your experience..."
              rows={6}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-gray-900 placeholder-gray-400"
              maxLength={1000}
            />
            <p className="text-sm text-gray-500 mt-1">
              {content.length}/1000 characters
            </p>
          </div>

          <div className="flex gap-4 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 text-white rounded-lg hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
            >
              {loading ? 'Submitting...' : 'Submit Review'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
