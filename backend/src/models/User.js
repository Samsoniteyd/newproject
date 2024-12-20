const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  fullName: { type: String, required: true },
  role: { type: String, enum: ['user', 'seller', 'admin'], default: 'user' },
  location: {
    address: String,
    city: String,
    state: String,
    country: String,
  },
  createdAt: { type: Date, default: Date.now }
}); 