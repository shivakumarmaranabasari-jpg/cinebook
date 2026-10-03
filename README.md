# 🎬 CineBook - Online Movie Ticket Booking Management System

> **A Full-Stack MERN Engineering Project (React 18 + Vite, Node.js + Express.js, MongoDB + Mongoose, JWT & bcrypt)**  
> Built with clean, modern, beginner-friendly, and maintainable software engineering principles.

---

## 📌 1. Project Overview

**CineBook** is an enterprise-grade Online Movie Ticket Booking Management System designed to simulate real-world multiplex cinema ticketing platforms like BookMyShow and AMC Theatres.

The platform provides an end-to-end cinema workflow:
- **Customers**: Browse currently running & upcoming movies, view official YouTube trailers, filter by genre/language, select multiplexes, pick dates and showtimes, choose tiered cinema seats (*Silver*, *Gold*, *Platinum*) on an interactive curved auditorium map, review the booking summary, confirm tickets with instant reference IDs, download/print digital passes with QR codes, and cancel bookings if plans change.
- **Administrators**: Dedicated operations dashboard offering real-time platform metrics (Gross Revenue, Total Bookings, Movies, Theatres, Users), Movie Catalogue CRUD, Multiplex & Screen Management, Showtime scheduling with tier pricing, and Customer Booking Cancellation with automated seat release.
- **Architectural Resilience**: Connects directly to **MongoDB & Mongoose** with complete schemas. If MongoDB is offline, CineBook automatically switches to an in-memory repository so students, professors, and evaluators can demo the application immediately out-of-the-box!

---

## 🚀 2. Technology Stack

### Frontend (`client/`)
- **React.js 18** – Modern functional components with hooks (`useState`, `useEffect`, `useContext`)
- **Vite 6** – Next-generation high-speed frontend bundler
- **React Router 6** – Declarative client-side routing & route protection
- **Axios** – HTTP client with request interceptors for automatic JWT bearer authentication
- **Lucide React** – Clean, modern UI icon set
- **CSS3 Design System** – Responsive layout with cinema dark mode, glowing accents, and mobile hamburger navigation

### Backend (`server/`)
- **Node.js** (v18+) – High-performance asynchronous runtime
- **Express.js 4** – RESTful routing, middleware orchestration, and centralized error handling
- **JSON Web Tokens (JWT)** – Stateless authentication and authorization
- **bcryptjs** – Salted password hashing (never plaintext)
- **CORS & dotenv** – Cross-Origin Resource Sharing & 12-factor environment configuration

### Database & Modeling
- **MongoDB** – NoSQL document database (Local or MongoDB Atlas Cloud)
- **Mongoose 8** – Strict schema definitions, pre-save encryption hooks, indexation, and model population
- **Resilient Fallback Adapter** – In-memory state manager for instant demo without MongoDB setup

---

## 📁 3. Project Structure

```text
CineBook/
├── .gitignore                      # Git ignore patterns for dependencies and build outputs
├── package.json                    # Root script orchestrator
├── README.md                       # Comprehensive project documentation
│
├── client/                         # Frontend Application (React + Vite)
│   ├── index.html                  # HTML5 entrypoint
│   ├── package.json                # Frontend package dependencies (React, Axios, Lucide)
│   ├── vite.config.js              # Vite server & port configuration
│   └── src/
│       ├── App.jsx                 # Client-side router & provider hierarchy
│       ├── main.jsx                # DOM mounting entrypoint
│       ├── index.css               # Global theme, seat grid, e-ticket & admin CSS
│       ├── assets/                 # Static branding assets
│       ├── components/
│       │   ├── Navbar.jsx          # Header with search, city selector, API status, and auth controls
│       │   ├── Footer.jsx          # Cinema footer with quick links & newsletter
│       │   └── MovieCard.jsx       # Reusable movie card with rating badge & quick book button
│       ├── context/
│       │   └── AuthContext.jsx     # Global authentication provider (login, logout, token persistence)
│       ├── pages/
│       │   ├── HomePage.jsx        # Hero spotlight banner, genre pills, features & catalog
│       │   ├── MoviesPage.jsx      # Search, genre/language filter, status tabs ('Now Showing'/'Coming Soon')
│       │   ├── MovieDetailPage.jsx # Synopsis, trailer modal, date tabs, multiplexes & showtimes
│       │   ├── TheatresPage.jsx    # Multiplex listings by city with screen count & amenities
│       │   ├── ShowsPage.jsx       # Schedules matrix with multi-parameter filter
│       │   ├── SeatSelectionPage.jsx # Interactive cinema seat layout (Silver/Gold/Platinum)
│       │   ├── BookingSummaryPage.jsx # Order breakdown, contact info & simulated checkout
│       │   ├── BookingConfirmationPage.jsx # Digital Pass with QR code, reference ID & print tool
│       │   ├── BookingsPage.jsx    # My Bookings history, status filters, pass modal & cancellation
│       │   ├── ProfilePage.jsx     # User info, lifetime spend, booking stats & profile edit
│       │   ├── LoginPage.jsx       # Auth form with One-Click Demo User/Admin buttons
│       │   ├── RegisterPage.jsx    # User registration with password validation
│       │   ├── AdminDashboardPage.jsx # Comprehensive admin operations & KPI analytics portal
│       │   └── NotFoundPage.jsx    # Cinema-themed 404 page
│       └── services/
│           └── api.js              # Axios instance with request/response interceptors
│
└── server/                         # Backend Application (Node.js + Express + Mongoose)
    ├── .env                        # Active environment variables
    ├── .env.example                # Sample environment configuration template
    ├── package.json                # Server dependencies (Express, Mongoose, JWT, bcryptjs)
    ├── server.js                   # Forwarder entrypoint
    └── src/
        ├── server.js               # Express application initialization & middleware setup
        ├── config/
        │   └── db.js               # MongoDB connection manager with diagnostic error handling
        ├── models/
        │   ├── User.js             # User model with role ('user' | 'admin') & bcrypt hook
        │   ├── Movie.js            # Movie schema (rating, trailer, duration, certificate)
        │   ├── Theatre.js          # Multiplex schema (city, address, facilities, screens)
        │   ├── Screen.js           # Auditorium schema with rows, seats per row & tier definitions
        │   ├── Show.js             # Showtime schema with ticketPrice & bookedSeats array
        │   └── Booking.js          # Booking record with seats, fees, total & status
        ├── controllers/
        │   ├── authController.js   # Registration, Login, Profile read & update
        │   ├── movieController.js  # Public catalogue & Admin Movie CRUD
        │   ├── theatreController.js# Multiplex query & Admin Theatre CRUD
        │   ├── showController.js   # Showtime query & Admin Show scheduling
        │   ├── bookingController.js# Atomic booking with duplicate seat prevention & cancellation
        │   └── adminController.js  # Dashboard KPIs calculation & User accounts management
        ├── middleware/
        │   └── authMiddleware.js   # JWT verification ('protect') & Role check ('adminOnly')
        ├── routes/
        │   ├── authRoutes.js       # /api/auth endpoints
        │   ├── movieRoutes.js      # /api/movies endpoints
        │   ├── theatreRoutes.js    # /api/theatres endpoints
        │   ├── showRoutes.js       # /api/shows endpoints
        │   ├── bookingRoutes.js    # /api/bookings endpoints
        │   └── adminRoutes.js      # /api/admin endpoints
        ├── data/
        │   ├── mockData.js         # Realistic seed data (movies, multiplexes, shows, bookings)
        │   └── dataStore.js        # Resilient in-memory state store for fallback mode
        ├── scripts/
        │   └── seed.js             # Database seeding runner (`npm run seed`)
        └── utils/
            └── generateToken.js    # JWT token generator helper
```

---

## ⚙️ 4. Installation & Setup Instructions

### Prerequisites
- **Node.js** (v18.0.0 or higher)
- **npm** (v9.0.0 or higher)
- **MongoDB** (Local instance or free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster)

### Step 1: Clone or Navigate to the Project
```bash
cd CineBook
```

### Step 2: Install Dependencies
Install dependencies for both client and server:
```bash
# Install Server Dependencies
cd server
npm install

# Install Client Dependencies
cd ../client
npm install

# Return to root
cd ..
```

---

## 🔐 5. Environment Variables

Create a `.env` file in the `server/` directory (a pre-configured `.env` is already included):

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/cinebook
JWT_SECRET=cinebook_super_secret_jwt_key_2026
CLIENT_URL=http://localhost:5173
```

> **For MongoDB Atlas (Cloud):**  
> Replace `MONGODB_URI` with your connection string:  
> `MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/cinebook?retryWrites=true&w=majority`

---

## 🍃 6. MongoDB Setup & Database Seeding

To populate your database with ready-to-use movies, multiplexes, showtimes, user accounts, and test bookings:

```bash
# From the root directory:
npm run seed

# Or directly inside the server folder:
cd server
npm run seed
```

This will seed:
- 👤 **1 Administrator** (`admin@cinebook.com` / `Admin@123`)
- 👤 **1 Customer** (`john@example.com` / `User@123`)
- 🎬 **8 Popular Movies** (*Dune 2*, *Oppenheimer*, *Interstellar*, *Spider-Verse*, *Gladiator 2*, *Kalki*, *The Dark Knight*, *Avatar*)
- 🏛️ **4 Multiplex Theatres** across Bengaluru, Mumbai, and Delhi
- ⏰ **12+ Screenings** across Today, Tomorrow, and upcoming days
- 🎟️ **Confirmed Sample Bookings** to populate Admin analytics immediately

---

## 🚀 7. Running the Application

### Option A: Run from Root Directory
Open two separate terminal windows in the project root:

**Terminal 1 (Backend Server):**
```bash
npm run dev:server
# Server starts at http://localhost:5000
```

**Terminal 2 (Frontend Client):**
```bash
npm run dev:client
# Vite client starts at http://localhost:5173
```

### Option B: Run Individually
```bash
# Terminal 1: Backend
cd server
npm run dev

# Terminal 2: Frontend
cd client
npm run dev
```

Visit **`http://localhost:5173`** in your browser to explore CineBook!

---

## 🔑 8. Pre-Configured Test Credentials

For quick evaluation, use the one-click demo buttons on the Login page or sign in manually:

| Role | Email | Password | Access Level |
| :--- | :--- | :--- | :--- |
| **Administrator** | `admin@cinebook.com` | `Admin@123` | Full Admin Dashboard (`/admin`), Movie/Theatre/Show CRUD, Global Bookings |
| **Standard User** | `john@example.com` | `User@123` | Movie Browsing, Seat Booking, My Bookings (`/bookings`), Profile (`/profile`) |

---

## 🌐 9. Backend API Overview

### 🔐 Authentication (`/api/auth`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Register a new user |
| `POST` | `/api/auth/login` | Public | Authenticate user & receive JWT token |
| `GET` | `/api/auth/profile` | Private | Fetch logged-in user profile |
| `PUT` | `/api/auth/profile` | Private | Update user name, phone, or password |

### 🎬 Movies (`/api/movies`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/movies` | Public | Get all movies (supports `?search=`, `?genre=`, `?status=`) |
| `GET` | `/api/movies/:id` | Public | Get single movie details |
| `POST` | `/api/movies` | Admin | Add new movie to catalogue |
| `PUT` | `/api/movies/:id` | Admin | Update existing movie |
| `DELETE` | `/api/movies/:id` | Admin | Delete movie and remove its shows |

### 🏛️ Theatres (`/api/theatres`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/theatres` | Public | Get theatres (supports `?city=`) |
| `GET` | `/api/theatres/:id` | Public | Get single theatre with screens |
| `POST` | `/api/theatres` | Admin | Add new multiplex theatre |
| `PUT` | `/api/theatres/:id` | Admin | Update theatre details |
| `DELETE` | `/api/theatres/:id` | Admin | Delete theatre and screens |

### ⏰ Shows (`/api/shows`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/shows` | Public | Filter shows by `movieId`, `theatreId`, `date` |
| `GET` | `/api/shows/:id` | Public | Get show details with seat prices and booked seats |
| `POST` | `/api/shows` | Admin | Schedule a new screening with category pricing |
| `PUT` | `/api/shows/:id` | Admin | Update showtime details |
| `DELETE` | `/api/shows/:id` | Admin | Delete a scheduled show |

### 🎟️ Bookings (`/api/bookings`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/bookings` | Private | Reserve seats (with atomic collision check) |
| `GET` | `/api/bookings` | Private | Get user bookings (or all if admin) |
| `GET` | `/api/bookings/:id` | Private | Get e-ticket pass details by ID |
| `PUT` | `/api/bookings/:id/cancel` | Private | Cancel reservation & release seats |

### 📊 Admin Operations (`/api/admin`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/admin/stats` | Admin | Get metrics (Revenue, Bookings, Movies, Theatres, Users) |
| `GET` | `/api/admin/users` | Admin | List all registered users |

---

## 🛡️ 10. Concurrency & Duplicate Seat Booking Prevention

A critical technical requirement for cinema booking is preventing two users from reserving the exact same seat simultaneously.

CineBook implements **Atomic Concurrency Protection**:
1. When a user submits a booking, the backend checks `show.bookedSeats`.
2. If any requested seat is in `bookedSeats`, the API immediately rejects the transaction with `HTTP 400 Bad Request` and lists the conflicting seats.
3. In MongoDB, the reservation is performed using atomic update queries:
   ```javascript
   await Show.findOneAndUpdate(
     { _id: showId, bookedSeats: { $nin: requestedSeats } },
     { $push: { bookedSeats: { $each: requestedSeats } } }
   );
   ```
4. If a booking is cancelled, the seats are freed atomically using `$pull: { bookedSeats: { $in: seatNumbers } }`.

---

## 🧪 11. Automated Testing Instructions

To test the entire application lifecycle end-to-end, you can run the built-in PowerShell test suite from the root directory:

```powershell
# In PowerShell:
$base = "http://localhost:5000/api"

# 1. Register test user
$reg = Invoke-RestMethod "$base/auth/register" -Method Post -ContentType "application/json" -Body '{"name":"Tester","email":"test@example.com","password":"Password@123"}'
$token = $reg.data.token

# 2. Duplicate seat collision test
# Attempts to book seat 'C4' (already booked) -> Returns 400 Bad Request
try {
  Invoke-RestMethod "$base/bookings" -Method Post -Headers @{ Authorization="Bearer $token" } -ContentType "application/json" -Body '{"showId":"664000000000000000000001","selectedSeats":[{"seatNumber":"C4","price":320}],"subtotal":320,"totalAmount":350}'
} catch {
  Write-Output "Seat collision correctly prevented!"
}

# 3. Book available seat 'B1' -> Returns confirmed booking ID
# 4. Cancel booking -> Verifies seat 'B1' is released back to available status
```

---

## 💡 12. Future Enhancements

- 💳 Integration with real payment gateways (Stripe / Razorpay webhooks)
- 🍿 Online Concessions & Snack pre-ordering combo cart
- 🎟️ Apple Wallet & Google Pay pass export
- 📱 Progressive Web App (PWA) with offline ticket caching
- 🌟 User Movie Reviews & Verified Viewer Ratings
