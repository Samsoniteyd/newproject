const vehicleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: { 
    type: String, 
    enum: ['new', 'foreign-used', 'locally-used'], 
    required: true 
  },
  type: { type: String, required: true }, // e.g., SUV, Sedan, etc.
  make: { type: String, required: true },
  model: { type: String, required: true },
  year: { type: Number, required: true },
  images: [String],
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  location: {
    address: String,
    city: String,
    state: String,
    country: String,
  },
  status: { 
    type: String, 
    enum: ['available', 'sold'], 
    default: 'available' 
  },
  createdAt: { type: Date, default: Date.now }
}); 