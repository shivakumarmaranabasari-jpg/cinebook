import mongoose from 'mongoose';

const showSchema = new mongoose.Schema(
  {
    movie: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Movie',
      required: true,
    },
    theatre: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Theatre',
      required: true,
    },
    screen: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Screen',
      required: true,
    },
    screenName: {
      type: String,
      default: 'Audi 1 (IMAX 4K)',
    },
    showDate: {
      type: String, // 'YYYY-MM-DD' e.g. '2026-10-03'
      required: [true, 'Show date is required'],
    },
    showTime: {
      type: String, // e.g. '10:00 AM', '01:30 PM', '05:00 PM', '08:30 PM'
      required: [true, 'Show time is required'],
    },
    ticketPrice: {
      silver: { type: Number, default: 180 },
      gold: { type: Number, default: 280 },
      platinum: { type: Number, default: 420 },
    },
    bookedSeats: {
      type: [String],
      default: [],
    },
    totalSeats: {
      type: Number,
      default: 70,
    },
    status: {
      type: String,
      enum: ['scheduled', 'running', 'completed', 'cancelled'],
      default: 'scheduled',
    },
  },
  {
    timestamps: true,
  }
);

const Show = mongoose.model('Show', showSchema);
export default Show;
