const sparePartSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  compatibility: [{
    make: String,
    model: String,
    year: Number
  }],
  images: [String],
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  stock: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ['in-stock', 'out-of-stock'], 
    default: 'in-stock' 
  }
}); 