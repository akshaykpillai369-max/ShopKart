# ShopKart

ShopKart is a full-stack e-commerce application built with React and Django REST Framework. It includes product browsing, search, cart management, authentication, payments, and order tracking.

## Features

- Browse products by category
- Search and price-based filtering
- Product details and reviews
- Cart and Buy Now
- User registration and email verification
- JWT authentication with Google login
- Razorpay payments
- Order tracking with delivery status
- Expected delivery dates
- Product pagination
- API caching
- Dark mode
- Responsive UI

## Tech Stack

**Frontend**
- React
- React Router
- Tailwind CSS
- Axios

**Backend**
- Django
- Django REST Framework
- Simple JWT

**Database**
- SQLite

**Other**
- Razorpay
- Google OAuth

## Project Structure

```text
ShopKart/
├── core/                  # Django backend
├── frontend/
│   └── e-commerce/       # React frontend
└── .gitignore
```

## Getting Started

### Prerequisites

Make sure you have:

- Python
- pip
- Node.js
- npm
- Git

### Clone the Repository

```bash
git clone <your-repository-url>
cd ShopKart
```

### Backend

```bash
cd core
pip install -r requirements.txt
```

Create a `.env` file inside `core/`:

```env
DJANGO_SECRET_KEY=your_django_secret_key(usually available in settings.py )
GOOGLE_CLIENT_ID=your_google_client_id
EMAIL_HOST_USER=your_email
EMAIL_HOST_PASSWORD=your_email_app_password
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

Run migrations:

```bash
python manage.py migrate
```

Start the backend:

```bash
python manage.py runserver
```

### Frontend

Open a new terminal:

```bash
cd frontend/e-commerce
npm install
npm run dev
```

The application will be available at:

```text
http://localhost:5173/
```

## Environment Variables

The backend requires credentials for:

- Django
- Google OAuth
- Email verification
- Razorpay

Keep your `.env` file private and never commit it to Git.

## Live Demo

Coming soon.

