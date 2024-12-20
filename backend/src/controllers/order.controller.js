const Order = require('../models/Order');

exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate('items.product')
      .sort('-createdAt');
    
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      user: req.user._id
    }).populate('items.product');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.trackOrder = async (req, res) => {
  try {
    const order = await Order.findOne({
      paymentReference: req.params.reference,
      user: req.user._id
    }).populate('items.product');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Add any additional tracking logic here
    const trackingInfo = {
      order,
      status: order.status,
      timeline: [
        {
          status: 'Order Placed',
          date: order.createdAt
        },
        order.paidAt && {
          status: 'Payment Confirmed',
          date: order.paidAt
        }
      ].filter(Boolean)
    };

    res.json(trackingInfo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}; 