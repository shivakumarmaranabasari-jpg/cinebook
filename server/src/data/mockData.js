export const mockUsers = [
  {
    _id: "660000000000000000000001",
    name: "CineBook Administrator",
    email: "admin@cinebook.com",
    password: "$2a$10$wE9sS4QW0vYhZ15N5f8sOuZpX2mHGbR6yQ0dY.GfvJ9e54K8pQ0eK", // Admin@123
    phone: "+91 98888 77777",
    role: "admin",
    createdAt: new Date("2026-01-01")
  },
  {
    _id: "660000000000000000000002",
    name: "John Doe",
    email: "john@example.com",
    password: "$2a$10$wE9sS4QW0vYhZ15N5f8sOuZpX2mHGbR6yQ0dY.GfvJ9e54K8pQ0eK", // User@123
    phone: "+91 98765 43210",
    role: "user",
    createdAt: new Date("2026-01-15")
  }
];

export const mockTheatres = [
  {
    _id: "661000000000000000000001",
    name: "PVR INOX Forum Mall",
    city: "Bengaluru",
    address: "Hosur Road, Koramangala, Bengaluru, Karnataka 560095",
    facilities: ["IMAX 4K Laser", "Dolby Atmos", "Luxury Recliners", "Food Court", "Valet Parking"],
    totalScreens: 8,
    image: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=800&q=80",
    isActive: true
  },
  {
    _id: "661000000000000000000002",
    name: "Cinepolis Orion Mall",
    city: "Bengaluru",
    address: "Dr Rajkumar Rd, Rajajinagar, Bengaluru, Karnataka 560055",
    facilities: ["4DX Motion", "VIP Onyx Lounge", "Dolby Atmos", "Wheelchair Accessible"],
    totalScreens: 11,
    image: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=80",
    isActive: true
  },
  {
    _id: "661000000000000000000003",
    name: "PVR Superplex Phoenix Palladium",
    city: "Mumbai",
    address: "Lower Parel, Mumbai, Maharashtra 400013",
    facilities: ["IMAX with Laser", "Director's Cut", "Gourmet Dining", "Dolby Surround 7.1"],
    totalScreens: 9,
    image: "https://images.unsplash.com/photo-1595769816263-9b910be24d5f?auto=format&fit=crop&w=800&q=80",
    isActive: true
  },
  {
    _id: "661000000000000000000004",
    name: "INOX Megaplex Pacific Mall",
    city: "Delhi",
    address: "Tagore Garden, New Delhi, Delhi 110027",
    facilities: ["Insignia Luxe", "Dolby Atmos", "Laser Projection", "Reserved Parking"],
    totalScreens: 6,
    image: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=800&q=80",
    isActive: true
  }
];

export const mockScreens = [
  {
    _id: "662000000000000000000001",
    theatre: "661000000000000000000001",
    screenNumber: "Screen 1 (IMAX Laser)",
    screenType: "IMAX 4K",
    totalSeats: 70,
    rows: ["A", "B", "C", "D", "E", "F", "G"],
    seatsPerRow: 10,
    categories: [
      { name: "Silver", rows: ["A", "B"], priceMultiplier: 1.0 },
      { name: "Gold", rows: ["C", "D", "E"], priceMultiplier: 1.55 },
      { name: "Platinum", rows: ["F", "G"], priceMultiplier: 2.33 }
    ]
  },
  {
    _id: "662000000000000000000002",
    theatre: "661000000000000000000002",
    screenNumber: "Screen 4 (4DX Prime)",
    screenType: "4DX",
    totalSeats: 70,
    rows: ["A", "B", "C", "D", "E", "F", "G"],
    seatsPerRow: 10,
    categories: [
      { name: "Silver", rows: ["A", "B"], priceMultiplier: 1.0 },
      { name: "Gold", rows: ["C", "D", "E"], priceMultiplier: 1.55 },
      { name: "Platinum", rows: ["F", "G"], priceMultiplier: 2.33 }
    ]
  }
];

export const mockMovies = [
  {
    _id: "663000000000000000000001",
    title: "Dune: Part Two",
    description: "Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family. Facing a choice between the love of his life and the fate of the known universe, he endeavors to prevent a terrible future only he can foresee.",
    genre: ["Sci-Fi", "Adventure", "Action"],
    language: "English",
    durationMinutes: 166,
    releaseDate: "2024-03-01",
    rating: 8.6,
    posterUrl: "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=600&q=80",
    bannerUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1400&q=80",
    trailerUrl: "https://www.youtube.com/watch?v=Way9Dexny3w",
    certificate: "UA",
    price: 320,
    director: "Denis Villeneuve",
    cast: ["Timothée Chalamet", "Zendaya", "Rebecca Ferguson", "Austin Butler"],
    isNowShowing: true,
    isFeatured: true
  },
  {
    _id: "663000000000000000000002",
    title: "Oppenheimer",
    description: "The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb during World War II, exploring both the triumph of physics and the terrifying burden of history.",
    genre: ["Biography", "Drama", "History"],
    language: "English",
    durationMinutes: 180,
    releaseDate: "2023-07-21",
    rating: 8.9,
    posterUrl: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&w=600&q=80",
    bannerUrl: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1400&q=80",
    trailerUrl: "https://www.youtube.com/watch?v=uYPbbksJxIg",
    certificate: "A",
    price: 350,
    director: "Christopher Nolan",
    cast: ["Cillian Murphy", "Emily Blunt", "Matt Damon", "Robert Downey Jr."],
    isNowShowing: true,
    isFeatured: true
  },
  {
    _id: "663000000000000000000003",
    title: "Interstellar",
    description: "When Earth becomes uninhabitable in the future, a farmer and ex-NASA pilot, Joseph Cooper, is tasked to pilot a spacecraft along with a team of researchers through a mysterious wormhole near Saturn.",
    genre: ["Adventure", "Drama", "Sci-Fi"],
    language: "English",
    durationMinutes: 169,
    releaseDate: "2014-11-07",
    rating: 8.7,
    posterUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80",
    bannerUrl: "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=1400&q=80",
    trailerUrl: "https://www.youtube.com/watch?v=zSWdZVtXT7E",
    certificate: "UA",
    price: 300,
    director: "Christopher Nolan",
    cast: ["Matthew McConaughey", "Anne Hathaway", "Jessica Chastain", "Michael Caine"],
    isNowShowing: true,
    isFeatured: true
  },
  {
    _id: "663000000000000000000004",
    title: "Spider-Man: Across the Spider-Verse",
    description: "Miles Morales catapults across the Multiverse, where he encounters a team of Spider-People charged with protecting its very existence. When heroes clash on handling a new threat, Miles must redefine heroism.",
    genre: ["Animation", "Action", "Adventure"],
    language: "English",
    durationMinutes: 140,
    releaseDate: "2023-06-02",
    rating: 8.7,
    posterUrl: "https://images.unsplash.com/photo-1635805737707-575885ab0820?auto=format&fit=crop&w=600&q=80",
    bannerUrl: "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1400&q=80",
    trailerUrl: "https://www.youtube.com/watch?v=cqGjhVJWtEg",
    certificate: "U",
    price: 280,
    director: "Joaquim Dos Santos",
    cast: ["Shameik Moore", "Hailee Steinfeld", "Brian Tyree Henry", "Oscar Isaac"],
    isNowShowing: true,
    isFeatured: false
  },
  {
    _id: "663000000000000000000005",
    title: "Gladiator II",
    description: "Years after witnessing the death of Maximus at the hands of his uncle, Lucius must enter the Colosseum after the powerful emperors of Rome conquer his home. With vengeance in his heart, he battles for the glory of Rome.",
    genre: ["Action", "Adventure", "Drama"],
    language: "English",
    durationMinutes: 148,
    releaseDate: "2024-11-22",
    rating: 8.2,
    posterUrl: "https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=600&q=80",
    bannerUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1400&q=80",
    trailerUrl: "https://www.youtube.com/watch?v=4rgYUipGJNo",
    certificate: "A",
    price: 320,
    director: "Ridley Scott",
    cast: ["Paul Mescal", "Pedro Pascal", "Denzel Washington", "Connie Nielsen"],
    isNowShowing: true,
    isFeatured: false
  },
  {
    _id: "663000000000000000000006",
    title: "Kalki 2898 AD",
    description: "A modern avatar of the Hindu god Vishnu, believed to have descended to the earth to protect the world from evil forces in a dystopian futuristic city called Kasi.",
    genre: ["Action", "Sci-Fi", "Mythology"],
    language: "Telugu / Hindi",
    durationMinutes: 181,
    releaseDate: "2024-06-27",
    rating: 8.1,
    posterUrl: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80",
    bannerUrl: "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1400&q=80",
    trailerUrl: "https://www.youtube.com/watch?v=kQDd1AhGIHk",
    certificate: "UA",
    price: 350,
    director: "Nag Ashwin",
    cast: ["Prabhas", "Amitabh Bachchan", "Deepika Padukone", "Kamal Haasan"],
    isNowShowing: true,
    isFeatured: true
  },
  {
    _id: "663000000000000000000007",
    title: "The Dark Knight",
    description: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
    genre: ["Action", "Crime", "Drama"],
    language: "English",
    durationMinutes: 152,
    releaseDate: "2008-07-18",
    rating: 9.0,
    posterUrl: "https://images.unsplash.com/photo-1509281373149-e957c6296406?auto=format&fit=crop&w=600&q=80",
    bannerUrl: "https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?auto=format&fit=crop&w=1400&q=80",
    trailerUrl: "https://www.youtube.com/watch?v=EXeTwQWrcwY",
    certificate: "UA",
    price: 300,
    director: "Christopher Nolan",
    cast: ["Christian Bale", "Heath Ledger", "Aaron Eckhart", "Michael Caine"],
    isNowShowing: false,
    isFeatured: false
  },
  {
    _id: "663000000000000000000008",
    title: "Avatar: Fire and Ash",
    description: "Jake Sully and Neytiri encounter a new, aggressive volcanic clan known as the Ash People on Pandora, testing the unity and resilience of the Na'vi people.",
    genre: ["Sci-Fi", "Action", "Adventure"],
    language: "English",
    durationMinutes: 175,
    releaseDate: "2025-12-19",
    rating: 8.8,
    posterUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80",
    bannerUrl: "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=1400&q=80",
    trailerUrl: "https://www.youtube.com/watch?v=d9MyW72ELq0",
    certificate: "UA",
    price: 380,
    director: "James Cameron",
    cast: ["Sam Worthington", "Zoe Saldana", "Sigourney Weaver"],
    isNowShowing: false,
    isFeatured: false
  }
];

// Generate dates for today, tomorrow, and next 3 days
const getFormattedDate = (offsetDays = 0) => {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().split('T')[0];
};

export const todayDate = getFormattedDate(0);
export const tomorrowDate = getFormattedDate(1);
export const dayAfterDate = getFormattedDate(2);

export const mockShows = [
  // Dune: Part Two shows
  {
    _id: "664000000000000000000001",
    movie: "663000000000000000000001",
    theatre: "661000000000000000000001",
    screen: "662000000000000000000001",
    screenName: "Audi 1 (IMAX 4K Laser)",
    showDate: todayDate,
    showTime: "10:30 AM",
    ticketPrice: { silver: 200, gold: 320, platinum: 480 },
    bookedSeats: ["C4", "C5", "D6", "F4", "F5"],
    totalSeats: 70,
    status: "scheduled"
  },
  {
    _id: "664000000000000000000002",
    movie: "663000000000000000000001",
    theatre: "661000000000000000000001",
    screen: "662000000000000000000001",
    screenName: "Audi 1 (IMAX 4K Laser)",
    showDate: todayDate,
    showTime: "02:15 PM",
    ticketPrice: { silver: 200, gold: 320, platinum: 480 },
    bookedSeats: ["A1", "A2", "B3", "E5", "G7"],
    totalSeats: 70,
    status: "scheduled"
  },
  {
    _id: "664000000000000000000003",
    movie: "663000000000000000000001",
    theatre: "661000000000000000000001",
    screen: "662000000000000000000001",
    screenName: "Audi 1 (IMAX 4K Laser)",
    showDate: todayDate,
    showTime: "06:00 PM",
    ticketPrice: { silver: 220, gold: 350, platinum: 520 },
    bookedSeats: ["C6", "C7", "D4", "D5", "E6", "F3", "F4"],
    totalSeats: 70,
    status: "scheduled"
  },
  {
    _id: "664000000000000000000004",
    movie: "663000000000000000000001",
    theatre: "661000000000000000000002",
    screen: "662000000000000000000002",
    screenName: "Audi 4 (4DX Prime)",
    showDate: todayDate,
    showTime: "07:30 PM",
    ticketPrice: { silver: 250, gold: 380, platinum: 550 },
    bookedSeats: ["D1", "D2", "E3", "E4"],
    totalSeats: 70,
    status: "scheduled"
  },
  {
    _id: "664000000000000000000005",
    movie: "663000000000000000000001",
    theatre: "661000000000000000000001",
    screen: "662000000000000000000001",
    screenName: "Audi 1 (IMAX 4K Laser)",
    showDate: tomorrowDate,
    showTime: "11:00 AM",
    ticketPrice: { silver: 200, gold: 320, platinum: 480 },
    bookedSeats: ["B1", "B2"],
    totalSeats: 70,
    status: "scheduled"
  },

  // Oppenheimer shows
  {
    _id: "664000000000000000000006",
    movie: "663000000000000000000002",
    theatre: "661000000000000000000001",
    screen: "662000000000000000000001",
    screenName: "Audi 1 (IMAX 70mm)",
    showDate: todayDate,
    showTime: "01:00 PM",
    ticketPrice: { silver: 220, gold: 350, platinum: 500 },
    bookedSeats: ["D3", "D4", "E7", "F8"],
    totalSeats: 70,
    status: "scheduled"
  },
  {
    _id: "664000000000000000000007",
    movie: "663000000000000000000002",
    theatre: "661000000000000000000002",
    screen: "662000000000000000000002",
    screenName: "Audi 2 (Dolby Atmos)",
    showDate: todayDate,
    showTime: "05:30 PM",
    ticketPrice: { silver: 190, gold: 300, platinum: 450 },
    bookedSeats: ["C1", "C2", "C3"],
    totalSeats: 70,
    status: "scheduled"
  },

  // Interstellar shows
  {
    _id: "664000000000000000000008",
    movie: "663000000000000000000003",
    theatre: "661000000000000000000001",
    screen: "662000000000000000000001",
    screenName: "Audi 1 (IMAX 4K Laser)",
    showDate: todayDate,
    showTime: "09:30 PM",
    ticketPrice: { silver: 220, gold: 340, platinum: 490 },
    bookedSeats: ["F5", "F6", "G5", "G6"],
    totalSeats: 70,
    status: "scheduled"
  },
  {
    _id: "664000000000000000000009",
    movie: "663000000000000000000003",
    theatre: "661000000000000000000003",
    screen: "662000000000000000000001",
    screenName: "Director's Cut Audi 1",
    showDate: tomorrowDate,
    showTime: "06:15 PM",
    ticketPrice: { silver: 250, gold: 380, platinum: 550 },
    bookedSeats: [],
    totalSeats: 70,
    status: "scheduled"
  },

  // Spider-Man shows
  {
    _id: "664000000000000000000010",
    movie: "663000000000000000000004",
    theatre: "661000000000000000000002",
    screen: "662000000000000000000002",
    screenName: "Audi 3 (Dolby Atmos)",
    showDate: todayDate,
    showTime: "03:45 PM",
    ticketPrice: { silver: 180, gold: 280, platinum: 420 },
    bookedSeats: ["C8", "C9"],
    totalSeats: 70,
    status: "scheduled"
  },

  // Gladiator II shows
  {
    _id: "664000000000000000000011",
    movie: "663000000000000000000005",
    theatre: "661000000000000000000001",
    screen: "662000000000000000000001",
    screenName: "Audi 2 (Laser 4K)",
    showDate: todayDate,
    showTime: "08:15 PM",
    ticketPrice: { silver: 200, gold: 320, platinum: 460 },
    bookedSeats: ["D5", "D6"],
    totalSeats: 70,
    status: "scheduled"
  },

  // Kalki 2898 AD shows
  {
    _id: "664000000000000000000012",
    movie: "663000000000000000000006",
    theatre: "661000000000000000000002",
    screen: "662000000000000000000002",
    screenName: "Audi 1 (IMAX 3D)",
    showDate: todayDate,
    showTime: "04:30 PM",
    ticketPrice: { silver: 210, gold: 330, platinum: 480 },
    bookedSeats: ["E1", "E2", "F1", "F2"],
    totalSeats: 70,
    status: "scheduled"
  }
];

export const mockBookings = [
  {
    _id: "665000000000000000000001",
    bookingId: "CB-2026-892341",
    user: "660000000000000000000002",
    show: "664000000000000000000001",
    movie: "663000000000000000000001",
    theatre: "661000000000000000000001",
    screenName: "Audi 1 (IMAX 4K Laser)",
    showDate: todayDate,
    showTime: "10:30 AM",
    selectedSeats: [
      { seatNumber: "C4", row: "C", number: 4, category: "Gold", price: 320 },
      { seatNumber: "C5", row: "C", number: 5, category: "Gold", price: 320 }
    ],
    numberOfTickets: 2,
    subtotal: 640,
    convenienceFee: 30,
    totalAmount: 670,
    bookingStatus: "confirmed",
    paymentStatus: "paid",
    paymentMethod: "UPI (Google Pay)",
    bookingDate: new Date()
  },
  {
    _id: "665000000000000000000002",
    bookingId: "CB-2026-781920",
    user: "660000000000000000000002",
    show: "664000000000000000000008",
    movie: "663000000000000000000003",
    theatre: "661000000000000000000001",
    screenName: "Audi 1 (IMAX 4K Laser)",
    showDate: todayDate,
    showTime: "09:30 PM",
    selectedSeats: [
      { seatNumber: "F5", row: "F", number: 5, category: "Platinum", price: 490 },
      { seatNumber: "F6", row: "F", number: 6, category: "Platinum", price: 490 }
    ],
    numberOfTickets: 2,
    subtotal: 980,
    convenienceFee: 30,
    totalAmount: 1010,
    bookingStatus: "confirmed",
    paymentStatus: "paid",
    paymentMethod: "Credit Card (HDFC)",
    bookingDate: new Date(Date.now() - 86400000)
  }
];
