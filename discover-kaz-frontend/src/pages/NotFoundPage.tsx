
import { Link } from 'react-router-dom';
import { MapPin } from 'lucide-react';

export function NotFoundPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="text-center max-w-md">
        <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-6" />
        <h1 className="text-5xl font-bold text-gray-900 mb-2">404</h1>
        <p className="text-xl text-gray-600 mb-2">Page Not Found</p>
        <p className="text-gray-500 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          to="/"
          className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}
