const express = require('express');
const router = express.Router();

// Sample data (replace with database later)
const cars = [
  {
    id: '1',
    make: 'Toyota',
    model: 'Camry',
    year: 2023,
    price: 25000,
    description: 'Reliable sedan with great fuel economy',
    images: ['/images/camry.jpg']
  },
  {
    id: '2',
    make: 'Honda',
    model: 'Civic',
    year: 2023,
    price: 23000,
    description: 'Compact sedan with modern features',
    images: ['/images/civic.jpg']
  }
];

router.get('/', (req, res) => {
  res.json(cars);
});

router.get('/:id', (req, res) => {
  const car = cars.find(c => c.id === req.params.id);
  if (!car) return res.status(404).json({ message: 'Car not found' });
  res.json(car);
});

module.exports = router; 