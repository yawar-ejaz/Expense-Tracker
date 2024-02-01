const Razorpay = require('razorpay');

const purchasePremium = async (req, res, next) => {
    try {
        const instance = new Razorpay({
            key_id: process.env.RAZOR_PAY_KEY,
            key_secret: process.env.RAZOR_PAY_SECRET
        });

        instance.orders.create({ amount: 5000, currency: 'INR' }, (err, order) => {
            if (err) {
                return res.status(400).json({
                    success: false,
                    message: "Failed to create order!"
                });
            }
           
            res.status(201).json(order);
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error!"
        });
    }
}

module.exports = { purchasePremium };