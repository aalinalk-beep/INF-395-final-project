
import { Link } from 'react-router-dom';
import { Mountain, Mail, Phone, MapPin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Mountain className="w-6 h-6 text-blue-400" />
              <span className="font-bold text-lg">Discover Kazakhstan</span>
            </div>
            <p className="text-gray-400 text-sm">
              Your gateway to exploring the stunning landscapes and hospitality of Kazakhstan.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/hotels" className="text-gray-400 hover:text-white transition">
                  Find Hotels
                </Link>
              </li>
              <li>
                <Link to="/destinations" className="text-gray-400 hover:text-white transition">
                  Top Destinations
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-gray-400 hover:text-white transition">
                  Login
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Contact</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <a href="mailto:info@discoverkz.com" className="text-gray-400 hover:text-white transition">
                  info@discoverkz.com
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span className="text-gray-400">+7 (123) 456-7890</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span className="text-gray-400">Almaty, Kazakhstan</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 text-sm text-gray-400">
          <p>&copy; 2025 Discover Kazakhstan.</p>
        </div>
      </div>
    </footer>
  );
}
