import mongoose from 'mongoose';

const screenSchema = new mongoose.Schema(
  {
    theatre: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Theatre',
      required: true,
    },
    screenNumber: {
      type: String,
      required: true,
      default: 'Screen 1',
    },
    screenType: {
      type: String,
      enum: ['IMAX 4K', 'Dolby Cinema', '4DX', 'Standard 2D', 'Standard 3D'],
      default: 'IMAX 4K',
    },
    totalSeats: {
      type: Number,
      required: true,
      default: 70,
    },
    rows: {
      type: [String],
      default: ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
    },
    seatsPerRow: {
      type: Number,
      default: 10,
    },
    categories: [
      {
        name: { type: String, required: true }, // 'Silver', 'Gold', 'Platinum'
        rows: [String], // e.g. ['A', 'B']
        priceMultiplier: { type: Number, default: 1.0 },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Screen = mongoose.model('Screen', screenSchema);
export default Screen;
