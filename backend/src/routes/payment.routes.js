const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const {
  initializePayment,
  verifyPayment,
  webhookHandler
} = require('../controllers/payment.controller');

router.post('/initialize', protect, initializePayment);
router.get('/verify/:reference', protect, verifyPayment);
router.post('/webhook', webhookHandler);

module.exports = router; 