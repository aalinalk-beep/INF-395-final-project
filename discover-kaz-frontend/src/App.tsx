import { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { HotelsPage } from './pages/HotelsPage';
import { HotelDetailsPage } from './pages/HomeDetailsPage';
import { DestinationsPage } from './pages/DestinationPage';
import { DestinationDetailsPage } from './pages/DestinationDetailsPage';
import { BookingsPage } from './pages/BookingPage';
import { NotFoundPage } from './pages/NotFoundPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-1">
            <Suspense fallback={<div className="min-h-screen bg-gray-50" />}>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/hotels" element={<HotelsPage />} />
                <Route path="/hotels/:id" element={<HotelDetailsPage />} />
                <Route path="/destinations" element={<DestinationsPage />} />
                <Route path="/destinations/:id" element={<DestinationDetailsPage />} />
                <Route path="/bookings" element={<BookingsPage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </Suspense>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
