from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from hotels.models import Hotel
from destinations.models import Destination
from events.models import Event
from decimal import Decimal
from django.utils import timezone
import datetime

User = get_user_model()


class Command(BaseCommand):
    help = 'Seeds the database with initial data from mock data'

    def handle(self, *args, **kwargs):
        self.stdout.write('Starting data seeding...')

        # Clear existing data
        self.stdout.write('Clearing existing data...')
        Hotel.objects.all().delete()
        Destination.objects.all().delete()
        Event.objects.all().delete()
        self.stdout.write(self.style.SUCCESS('Existing data cleared'))

        # Create Destinations
        self.stdout.write('Creating destinations...')
        destinations_data = [
            {
                'name': 'Charyn Canyon',
                'description': 'A breathtaking canyon often compared to the Grand Canyon, featuring stunning rock formations and the famous Valley of Castles.',
                'long_description': 'Charyn Canyon is one of Kazakhstan\'s most spectacular natural wonders, located about 200km east of Almaty. The canyon stretches for 154km along the Charyn River and reaches depths of 150-300 meters. The most famous section is the Valley of Castles, where wind and water have carved the red sedimentary rock into fantastic shapes resembling medieval fortifications.',
                'image_url': 'images/charyn1.png',
                'gallery_urls': ['images/charyn1.png', 'images/charyn2.png'],
                'location': 'Almaty Region',
                'latitude': 43.3536,
                'longitude': 79.0992,
                'best_season': 'Spring and Autumn',
                'highlights': ['Valley of Castles', 'Red Canyon', 'Hiking trails', 'Photography'],
                'transport_options': 'By car: 3-4 hours drive from Almaty. Guided tours available. Public transport is limited.',
            },
            {
                'name': 'Big Almaty Lake',
                'description': 'A stunning turquoise mountain lake surrounded by majestic peaks, located just 28km from Almaty city center.',
                'long_description': 'Big Almaty Lake is a natural alpine reservoir located in the Trans-Ili Alatau mountains. The lake sits at an altitude of 2,511 meters above sea level and is known for its incredible turquoise color that changes with the seasons. The lake is surrounded by three main peaks: Soviet Peak (4,317m), Ozerny Peak (4,110m), and Tourist Peak (3,954m).',
                'image_url': 'images/bigallake1.png',
                'gallery_urls': ['images/bigallake1.png', 'images/bigallake2.png'],
                'location': 'Almaty',
                'latitude': 43.0553,
                'longitude': 76.9900,
                'best_season': 'Summer',
                'highlights': ['Turquoise waters', 'Mountain peaks', 'Day trip from Almaty', 'Photography'],
                'transport_options': 'By car/taxi: 45-60 mins from city center. Hiking: 4-5 hours from the bus stop.',
            },
            {
                'name': 'Medeu Skating Rink',
                'description': 'The world\'s highest outdoor ice skating rink, located in the picturesque mountain valley near Almaty.',
                'long_description': 'Medeu is an outdoor speed skating and bandy rink located in the mountain valley 15km from Almaty at an altitude of 1,691 meters. It is the highest skating rink in the world and is famous for its excellent ice quality. The rink is surrounded by beautiful mountain scenery and is a popular destination for both athletes and tourists.',
                'image_url': 'images/medeu1.png',
                'gallery_urls': ['images/medeu1.png', 'images/medeu2.png'],
                'location': 'Almaty',
                'latitude': 43.1628,
                'longitude': 77.0647,
                'best_season': 'Winter',
                'highlights': ['Ice skating', 'Mountain views', 'Winter sports', 'Hiking dam stairs'],
                'transport_options': 'Bus #12 from Dostyk Ave runs every 30 mins. Taxi/Car: 20-30 mins from center.',
            },
            {
                'name': 'Altyn-Emel National Park',
                'description': 'A vast national park featuring the famous Singing Dunes, ancient petroglyphs, and unique desert landscapes.',
                'long_description': 'Altyn-Emel National Park covers 4,600 square kilometers of diverse terrain including deserts, mountains, and river valleys. The park is most famous for its Singing Dunes - a 150-meter high sand dune that produces a humming sound when the sand moves. The park also contains the Aktau and Katutau mountains with their stunning colored rock formations.',
                'image_url': 'images/altynemel1.png',
                'gallery_urls': ['images/altynemel1.png', 'images/altynemel2.png'],
                'location': 'Almaty Region',
                'latitude': 43.7503,
                'longitude': 78.6297,
                'best_season': 'Spring and Autumn',
                'highlights': ['Singing Dunes', 'Aktau Mountains', 'Petroglyphs', 'Wildlife watching'],
                'transport_options': '4WD vehicle recommended. Guided tours from Almaty (4-5 hours drive).',
            },
            {
                'name': 'Kolsai Lakes',
                'description': 'A system of three crystal-clear mountain lakes known as the "Pearls of the Northern Tien Shan".',
                'long_description': 'The Kolsai Lakes are a cascade of three alpine lakes located in the northern Tien Shan mountains. The lower lake sits at 1,818 meters, the middle at 2,252 meters, and the upper at 2,850 meters above sea level. The lakes are renowned for their pristine emerald waters, surrounded by dense spruce forests and dramatic mountain peaks.',
                'image_url': 'images/kolsai1.png',
                'gallery_urls': ['images/kolsai1.png', 'images/kolsai2.png'],
                'location': 'Almaty Region',
                'latitude': 42.9667,
                'longitude': 78.3333,
                'best_season': 'Summer',
                'highlights': ['Three alpine lakes', 'Hiking trails', 'Horseback riding', 'Camping'],
                'transport_options': 'By car: 5-6 hours from Almaty. Organized tours available.',
            },
        ]

        for dest_data in destinations_data:
            Destination.objects.create(**dest_data)
        self.stdout.write(self.style.SUCCESS(f'Created {len(destinations_data)} destinations'))

        # Create Hotels
        self.stdout.write('Creating hotels...')
        hotels_data = [
            {
                'name': 'The Ritz-Carlton Almaty',
                'description': 'Luxury 5-star hotel in the heart of Almaty featuring elegant rooms, world-class dining, and stunning mountain views.',
                'image_url': 'images/theritz1.png',
                'gallery_urls': ['images/theritz1.png', 'images/theritz2.png', 'images/theritz3.png'],
                'location': '8 Esentai Park, Almaty 050040',
                'latitude': 43.2220,
                'longitude': 76.9420,
                'city': 'Almaty',
                'amenities': ['Free WiFi', 'Swimming Pool', 'Spa', 'Fine Dining', 'Fitness Center', 'Business Center', 'Room Service', 'Concierge'],
                'rating': 4.8,
                'total_reviews': 342,
                'price_per_night': Decimal('280.00'),
                'available_rooms': 15,
                'tier': 'Luxury',
            },
            {
                'name': 'InterContinental Almaty',
                'description': 'Sophisticated hotel offering panoramic mountain views, excellent amenities, and prime location in the business district.',
                'image_url': 'images/inter1.png',
                'gallery_urls': ['images/inter1.png', 'images/inter2.png'],
                'location': '181 Zheltoksan Street, Almaty 050013',
                'latitude': 43.2566,
                'longitude': 76.9286,
                'city': 'Almaty',
                'amenities': ['Free WiFi', 'Pool', 'Spa', 'Restaurant', 'Bar', 'Fitness Center', 'Meeting Rooms', 'Airport Shuttle'],
                'rating': 4.7,
                'total_reviews': 285,
                'price_per_night': Decimal('220.00'),
                'available_rooms': 22,
                'tier': 'Luxury',
            },
            {
                'name': 'Rixos Almaty Hotel',
                'description': 'All-inclusive luxury resort with Turkish hospitality, featuring multiple restaurants, spa facilities, and entertainment.',
                'image_url': 'images/rixos1.png',
                'gallery_urls': ['images/rixos1.png', 'images/rixos2.png'],
                'location': '287 Seifullin Avenue, Almaty 050000',
                'latitude': 43.2350,
                'longitude': 76.9450,
                'city': 'Almaty',
                'amenities': ['All-Inclusive', 'Free WiFi', 'Indoor Pool', 'Spa', 'Multiple Restaurants', 'Kids Club', 'Casino', 'Entertainment'],
                'rating': 4.6,
                'total_reviews': 198,
                'price_per_night': Decimal('195.00'),
                'available_rooms': 18,
                'tier': 'Luxury',
            },
            {
                'name': 'Hotel Dostyk',
                'description': 'Classic hotel with modern amenities, centrally located with easy access to main attractions and business centers.',
                'image_url': 'images/dostyk1.png',
                'gallery_urls': ['images/dostyk1.png', 'images/dostyk2.png'],
                'location': '36 Kurmangazy Street, Almaty 050000',
                'latitude': 43.2505,
                'longitude': 76.9265,
                'city': 'Almaty',
                'amenities': ['Free WiFi', 'Restaurant', 'Bar', 'Fitness Center', 'Business Center', 'Room Service', 'Laundry'],
                'rating': 4.3,
                'total_reviews': 156,
                'price_per_night': Decimal('120.00'),
                'available_rooms': 28,
                'tier': 'Standard',
            },
            {
                'name': 'Kazakhstan Hotel',
                'description': 'Historic landmark hotel offering comfortable accommodation with traditional Kazakh hospitality and central location.',
                'image_url': 'images/kazakhstan1.png',
                'gallery_urls': ['images/kazakhstan1.png', 'images/kazakhstan2.png'],
                'location': '52/1 Dostyk Avenue, Almaty 050010',
                'latitude': 43.2380,
                'longitude': 76.9540,
                'city': 'Almaty',
                'amenities': ['Free WiFi', 'Restaurant', 'Bar', 'Conference Rooms', 'Parking', 'City Views'],
                'rating': 4.1,
                'total_reviews': 289,
                'price_per_night': Decimal('85.00'),
                'available_rooms': 35,
                'tier': 'Standard',
            },
            {
                'name': 'Shymbulak Resort Hotel',
                'description': 'Mountain resort hotel at the famous Shymbulak ski resort, perfect for winter sports and summer mountain activities.',
                'image_url': 'images/shymbulak1.png',
                'gallery_urls': ['images/shymbulak1.png', 'images/shymbulak2.png'],
                'location': 'Shymbulak Ski Resort, Medeu District, Almaty Region',
                'latitude': 43.1350,
                'longitude': 77.0780,
                'city': 'Almaty',
                'amenities': ['Ski-in/Ski-out', 'Free WiFi', 'Restaurant', 'Bar', 'Ski Storage', 'Equipment Rental', 'Mountain Views', 'Hiking'],
                'rating': 4.5,
                'total_reviews': 167,
                'price_per_night': Decimal('165.00'),
                'available_rooms': 12,
                'tier': 'Standard',
            },
        ]

        for hotel_data in hotels_data:
            Hotel.objects.create(**hotel_data)
        self.stdout.write(self.style.SUCCESS(f'Created {len(hotels_data)} hotels'))

        # Create Events
        self.stdout.write('Creating events...')
        events_data = [
            {
                'title': 'Almaty Marathon 2025',
                'description': 'The largest running event in Central Asia, attracting thousands of runners from around the world.',
                'date': timezone.now() + datetime.timedelta(days=30),
                'location': 'Republic Square, Almaty',
                'latitude': 43.2389,
                'longitude': 76.9455,
                'image_url': 'images/marathon.png',
            },
            {
                'title': 'Spirit of Tengri',
                'description': 'International festival of contemporary ethnic music, featuring artists from all over the world.',
                'date': timezone.now() + datetime.timedelta(days=45),
                'location': 'Abay Square, Almaty',
                'latitude': 43.2435,
                'longitude': 76.9570,
                'image_url': 'images/spirit.png',
            },
            {
                'title': 'Apple Fest',
                'description': 'Annual city festival celebrating Almaty\'s heritage as the home of apples.',
                'date': timezone.now() + datetime.timedelta(days=60),
                'location': 'Park of 28 Panfilov Guardsmen',
                'latitude': 43.2593,
                'longitude': 76.9526,
                'image_url': 'images/applefest.png',
            },
        ]

        for event_data in events_data:
            Event.objects.create(**event_data)
        self.stdout.write(self.style.SUCCESS(f'Created {len(events_data)} events'))

        self.stdout.write(self.style.SUCCESS('Data seeding completed successfully!'))
        self.stdout.write(f'Total: {len(destinations_data)} destinations, {len(hotels_data)} hotels, {len(events_data)} events')
