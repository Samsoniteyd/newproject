const PaystackService = require('../utils/paystack');
const Order = require('../models/Order');

exports.initializePayment = async (req, res) => {
  try {
    const { amount, email, reference } = req.body;

    const paymentData = {
      email,
      amount,
      reference,
      callback_url: `${process.env.FRONTEND_URL}/payment/verify`,
      metadata: {
        userId: req.user._id,
        cartItems: req.body.cartItems
      }
    };

    const response = await PaystackService.initializeTransaction(paymentData);

    res.json(response.data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.verifyPayment = async (req, res) => {
  try {
    const { reference } = req.params;
    
    const response = await PaystackService.verifyTransaction(reference);
    
    if (response.data.status === 'success') {
      // Create order
      const { metadata } = response.data;
      await Order.create({
        user: metadata.userId,
        items: metadata.cartItems,
        total: response.data.amount / 100,
        paymentReference: reference,
        status: 'paid'
      });
    }

    res.json(response.data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.webhookHandler = async (req, res) => {
  try {
    const hash = crypto.createHmac('sha512', process.env.PAYSTACK_SECRET_KEY)
      .update(JSON.stringify(req.body))
      .digest('hex');

    if (hash !== req.headers['x-paystack-signature']) {
      return res.status(400).json({ message: 'Invalid signature' });
    }

    const event = req.body;

    // Handle different event types
    switch (event.event) {
      case 'charge.success':
        await Order.findOneAndUpdate(
          { paymentReference: event.data.reference },
          { status: 'paid', paidAt: new Date() }
        );
        break;
      
      case 'charge.failed':
        await Order.findOneAndUpdate(
          { paymentReference: event.data.reference },
          { status: 'failed' }
        );
        break;
    }

    res.sendStatus(200);
  } catch (error) {
    console.error('Webhook error:', error);
    res.sendStatus(500);
  }
}; 