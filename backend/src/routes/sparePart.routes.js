const express = require('express');
const router = express.Router();

// Sample data (replace with database later)
const spareParts = [
  {
    id: '1',
    title: 'Brake Pad',
    price: 49.99,
    description: 'High-quality brake pads for optimal stopping power',
    images: ['/images/brake-pad.jpg'],
    stock: 50
  },
  {
    id: '2',
    title: 'Oil Filter',
    price: 15.99,
    description: 'Premium oil filter for engine protection',
    images: ['/images/oil-filter.jpg'],
    stock: 100
  }
];

router.get('/', (req, res) => {
  res.json(spareParts);
});

router.get('/:id', (req, res) => {
  const part = spareParts.find(p => p.id === req.params.id);
  if (!part) return res.status(404).json({ message: 'Spare part not found' });
  res.json(part);
});

module.exports = router; 