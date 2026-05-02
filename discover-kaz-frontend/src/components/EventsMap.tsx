import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { MapPin, Calendar, Clock } from 'lucide-react';
import L from 'leaflet';
import { api } from '../services/api';
import type { Event } from '../types/index';
import 'leaflet/dist/leaflet.css';

// Fix default marker icon issue with Leaflet in React
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Create custom red marker for events
const createEventIcon = (number: number) => {
    return L.divIcon({
        className: 'custom-marker',
        html: `
      <div style="position: relative;">
        <svg width="32" height="42" viewBox="0 0 32 42" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M16 0C7.163 0 0 7.163 0 16c0 11 16 26 16 26s16-15 16-26c0-8.837-7.163-16-16-16z" fill="#EF4444"/>
          <circle cx="16" cy="16" r="8" fill="white"/>
          <text x="16" y="21" text-anchor="middle" font-size="12" font-weight="bold" fill="#EF4444">${number}</text>
        </svg>
      </div>
    `,
        iconSize: [32, 42],
        iconAnchor: [16, 42],
        popupAnchor: [0, -42],
    });
};

export function EventsMap() {
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await api.getEvents() as any;
                setEvents(response.results || []);
            } catch (error) {
                console.error('Error fetching events:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, []);

    if (loading) {
        return <div className="h-96 bg-gray-100 rounded-lg animate-pulse" />;
    }

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('ru-RU', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    const getDaysUntil = (dateString: string) => {
        const eventDate = new Date(dateString);
        const today = new Date();
        const diffTime = eventDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    // Center map on Almaty
    const almatyCenter: [number, number] = [43.2380, 76.9450];

    return (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
                <h2 className="text-3xl font-bold mb-2">Upcoming Events in Almaty</h2>
                <p className="text-blue-100">Discover concerts, festivals, and cultural events on the map</p>
            </div>

            <div className="p-6">
                {/* Real Map with Leaflet */}
                <div className="h-[400px] rounded-lg overflow-hidden mb-6 border-2 border-blue-100 relative z-0">
                    <MapContainer
                        center={almatyCenter}
                        zoom={12}
                        style={{ height: '100%', width: '100%' }}
                        scrollWheelZoom={true}
                    >
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />

                        {events.map((event, index) => {
                            // Use event coordinates or default to Almaty center with slight offset
                            const position: [number, number] = event.latitude && event.longitude
                                ? [event.latitude, event.longitude]
                                : [43.2380 + (index * 0.01), 76.9450 + (index * 0.01)];

                            const daysUntil = getDaysUntil(event.date);

                            return (
                                <Marker
                                    key={event.id}
                                    position={position}
                                    icon={createEventIcon(index + 1)}
                                    eventHandlers={{
                                        click: () => setSelectedEvent(selectedEvent?.id === event.id ? null : event),
                                    }}
                                >
                                    <Popup>
                                        <div className="p-2 min-w-[200px]">
                                            <h3 className="font-bold text-lg mb-2">{event.title}</h3>
                                            <div className="space-y-1 text-sm">
                                                <div className="flex items-center gap-2 text-gray-600">
                                                    <Calendar className="w-4 h-4" />
                                                    <span>{formatDate(event.date)}</span>
                                                </div>
                                                {daysUntil > 0 && (
                                                    <div className="flex items-center gap-2 text-blue-600 font-semibold">
                                                        <Clock className="w-4 h-4" />
                                                        <span>через {daysUntil} {daysUntil === 1 ? 'день' : daysUntil < 5 ? 'дня' : 'дней'}</span>
                                                    </div>
                                                )}
                                                <div className="flex items-center gap-2 text-gray-600">
                                                    <MapPin className="w-4 h-4" />
                                                    <span>{event.location}</span>
                                                </div>
                                                <p className="mt-2 text-gray-700">{event.description}</p>
                                            </div>
                                        </div>
                                    </Popup>
                                </Marker>
                            );
                        })}
                    </MapContainer>
                </div>

                {/* Events List */}
                <div className="grid md:grid-cols-3 gap-4">
                    {events.map((event, index) => {
                        const daysUntil = getDaysUntil(event.date);

                        return (
                            <div
                                key={event.id}
                                onClick={() => setSelectedEvent(selectedEvent?.id === event.id ? null : event)}
                                className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-300 ${selectedEvent?.id === event.id
                                        ? 'border-blue-500 bg-blue-50 shadow-lg scale-105'
                                        : 'border-gray-200 hover:border-blue-300 hover:shadow-md'
                                    }`}
                            >
                                <div className="flex items-start gap-3 mb-3">
                                    <div className="flex-shrink-0 w-10 h-10 bg-red-500 rounded-full flex items-center justify-center text-white font-bold">
                                        {index + 1}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-bold text-gray-900 mb-1 line-clamp-2">{event.title}</h3>
                                        <div className="flex items-center gap-1 text-sm text-gray-600 mb-1">
                                            <Calendar className="w-4 h-4" />
                                            <span>{formatDate(event.date)}</span>
                                        </div>
                                        {daysUntil > 0 && (
                                            <div className="flex items-center gap-1 text-sm text-blue-600 font-semibold">
                                                <Clock className="w-4 h-4" />
                                                <span>через {daysUntil} {daysUntil === 1 ? 'день' : daysUntil < 5 ? 'дня' : 'дней'}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <p className="text-sm text-gray-600 line-clamp-2 mb-2">{event.description}</p>

                                <div className="flex items-center gap-1 text-sm text-gray-500">
                                    <MapPin className="w-4 h-4" />
                                    <span className="truncate">{event.location}</span>
                                </div>

                                {selectedEvent?.id === event.id && (
                                    <div className="mt-3 pt-3 border-t border-blue-200">
                                        <p className="text-sm text-gray-700">{event.description}</p>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {events.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                        <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                        <p>No upcoming events at the moment</p>
                    </div>
                )}
            </div>
        </div>
    );
}
