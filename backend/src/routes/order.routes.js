const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const {
  getOrders,
  getOrderById,
  trackOrder
} = require('../controllers/order.controller');

router.get('/', protect, getOrders);
router.get('/:id', protect, getOrderById);
router.get('/track/:reference', protect, trackOrder);

module.exports = router; 