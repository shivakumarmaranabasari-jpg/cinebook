import mongoose from 'mongoose';

const movieSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Movie title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Movie description is required'],
    },
    genre: {
      type: [String],
      required: true,
      default: ['Action', 'Drama'],
    },
    language: {
      type: String,
      required: true,
      default: 'English',
    },
    durationMinutes: {
      type: Number,
      required: true,
      default: 150,
    },
    releaseDate: {
      type: String,
      default: '2024-11-01',
    },
    rating: {
      type: Number,
      default: 8.5,
      min: 0,
      max: 10,
    },
    posterUrl: {
      type: String,
      required: true,
    },
    bannerUrl: {
      type: String,
    },
    trailerUrl: {
      type: String,
      default: 'https://www.youtube.com/watch?v=Way9Dexny3w',
    },
    certificate: {
      type: String,
      default: 'UA',
    },
    price: {
      type: Number,
      required: true,
      default: 250,
    },
    director: {
      type: String,
      default: 'Christopher Nolan',
    },
    cast: {
      type: [String],
      default: [],
    },
    isNowShowing: {
      type: Boolean,
      default: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Movie = mongoose.model('Movie', movieSchema);
export default Movie;
