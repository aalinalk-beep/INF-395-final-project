# Discover Kazakhstan

Discover Kazakhstan is a full-stack tourism web application for exploring destinations, hotels, and events in Kazakhstan. Users can view tourism information, use an interactive map, register/login, create bookings, and leave hotel reviews.

---

## Problem Definition

Tourism information in Kazakhstan is often spread across different websites and platforms. Users may struggle to find reliable information about destinations, hotels, events, and booking options in one place.

Discover Kazakhstan solves this problem by providing a centralized tourism platform with structured data and a simple user interface.

---

## Project Objective

The main objective of this project is to create a tourism platform where users can:

- explore destinations in Kazakhstan;
- view hotels and hotel details;
- check events on an interactive map;
- register and log in;
- create and manage bookings;
- write hotel reviews.

---

## Technology Stack

### Frontend

- React
- TypeScript
- Vite
- TailwindCSS
- React Router
- Axios
- Leaflet / React Leaflet
- OpenStreetMap

### Backend

- Python
- Django 5.2.8
- Django REST Framework
- Simple JWT
- SQLite
- Django CORS Headers

---

## Main Features

- Destination listing and details
- Hotel listing and details
- Event map with Leaflet and OpenStreetMap
- User registration and login
- JWT authentication
- Hotel booking
- Booking cancellation
- Hotel reviews
- Django admin panel
- Seed data for demo content

---

## Project Structure

```text
discover-kazakhstan/
├── README.md
├── setup.py
├── discover-kaz-backend/
│   ├── manage.py
│   ├── requirements.txt
│   ├── discover_kaz_backend/
│   ├── users/
│   ├── hotels/
│   ├── destinations/
│   ├── events/
│   ├── bookings/
│   └── media/
└── discover-kaz-frontend/
    ├── package.json
    ├── vite.config.ts
    ├── index.html
    └── src/
        ├── components/
        ├── pages/
        ├── contexts/
        ├── utils/
        ├── App.tsx
        └── main.tsx
        
## Installation Requirements

Before running the project, install:

- Python 3.11 or 3.12 recommended
- Node.js 18+
- npm
- Git

Check versions:

```bash
python3 --version
node --version
npm --version
git --version

---

## Backend Setup

Open terminal in the project folder:

cd discover-kaz-backend

Create and activate virtual environment:

python3 -m venv .venv
source .venv/bin/activate

Install dependencies:

python -m pip install --upgrade pip
pip install -r requirements.txt

Run migrations:

python manage.py migrate

Seed database:

python manage.py seed_data

Run backend server:

python manage.py runserver

Backend runs at:

http://localhost:8000

Django Admin:

http://localhost:8000/admin

API:

http://localhost:8000/api