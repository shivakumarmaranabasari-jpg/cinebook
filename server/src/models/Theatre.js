import mongoose from 'mongoose';

const theatreSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Theatre name is required'],
      trim: true,
    },
    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true,
      default: 'Bengaluru',
    },
    address: {
      type: String,
      required: [true, 'Address is required'],
    },
    facilities: {
      type: [String],
      default: ['IMAX 4K', 'Dolby Atmos', 'Recliner Lounges', 'Parking', 'Food Court'],
    },
    totalScreens: {
      type: Number,
      default: 4,
    },
    image: {
      type: String,
      default: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=800&q=80',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Theatre = mongoose.model('Theatre', theatreSchema);
export default Theatre;
