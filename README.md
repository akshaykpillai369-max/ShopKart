# ShopKart

A full-stack e-commerce web app built with Django REST Framework and React. Handles end-to-end shopping workflows including catalog filtering, cart/checkout flows, Razorpay integration, Google OAuth, and basic order tracking.

**Live Demo:** [https://shopkart-lake.vercel.app/](https://shopkart-lake.vercel.app/)

---

## Overview

- **Authentication:** JWT-based auth via SimpleJWT and Google OAuth 2.0.
- **Verification:** Email verification flow on account registration.
- **Payments:** Razorpay payment integration(test mode).
- **Orders:** Order tracking with estimated delivery timelines.

---

## Tech Stack

- **Frontend:** React (Vite), React Router, Tailwind CSS
- **Backend:** Django, Django REST Framework
- **Database:** PostgreSQL

---

## Project Structure

```text
ShopKart/
├── core/                  # Django project root & apps
│   ├── manage.py
│   └── requirements.txt
├── frontend/
│   └── e-commerce/        # React app
└── README.md
```

---

## Local Development

### Prerequisites

- Python 3.10+
- Node.js 18+ and npm
- PostgreSQL (or SQLite)

---

### Backend Setup

1. **Clone the repository:**

   ```bash
   git clone https://github.com/akshaykpillai369-max/ShopKart.git
   cd ShopKart/core
   ```

2. **Create and activate a virtual environment:**

   ```bash
   # macOS / Linux
   python3 -m venv venv
   source venv/bin/activate

   # Windows
   python -m venv venv
   venv\Scripts\activate
   ```

3. **Install dependencies:**

   ```bash
   pip install -r requirements.txt
   ```

4. **Configure environment variables:**

   Create a `.env` file inside `core/`:

   ```ini
   DJANGO_SECRET_KEY=your_secret_key_here
   DEBUG=True
   DATABASE_URL=postgres://user:password@localhost:5432/shopkart_db

   # Auth & Email
   GOOGLE_CLIENT_ID=your_google_client_id
   EMAIL_HOST_USER=your_email@gmail.com
   EMAIL_HOST_PASSWORD=your_app_specific_password

   # Payments
   RAZORPAY_KEY_ID=your_rzp_test_key
   RAZORPAY_KEY_SECRET=your_rzp_test_secret
   ```

5. **Run migrations and start the server:**

   ```bash
   python manage.py migrate
   python manage.py runserver
   ```

   The backend API will be available at `http://127.0.0.1:8000/`.

---

### Frontend Setup

1. Open a separate terminal:

   ```bash
   cd ShopKart/frontend/e-commerce
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the dev server:

   ```bash
   npm run dev
   ```

   The frontend will run at `http://localhost:5173/`.

---

## Screenshots

| Home | Product Details |
| :---: | :---: |
| ![Homepage](screenshots/homepage.png) | ![Product Detail](screenshots/product-detail.png) |

| Checkout | Order Tracking |
| :---: | :---: |
| ![Checkout](screenshots/checkout.png) | ![Order Detail](screenshots/order-detail.png) |

---


