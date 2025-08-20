const mongoose = require('mongoose');

const TourSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  region: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  environmentalRating: {
    type: Number,
    min: 1,
    max: 10,
    required: true,
  },
  availableSlots: {
    type: Number,
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  images: [
    {
      type: String,
    },
  ],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('Tour', TourSchema);
