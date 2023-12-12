const { verifyWebTokenAuth, verifyWebTokenAuthForAdmin } = require('./verifyToken');
const CryptoJS = require('crypto-js');
const router = require('express').Router();
const Orders = require('../models/order');

router.post('/', async (req, res) => {
    const newOrder = new Orders(req.body);
    try {
        const newAddedOrder = await newOrder.save();
        res.status(201).json(newAddedOrder)
    } catch (err) {
        res.status(500).json(err)
    }
})

router.put('/:id', verifyWebTokenAuthForAdmin, async (req, res) => {
    try {
        const updatedOrder = await Orders.findByIdAndUpdate(req.params.id, {
            $set: req.body
        }, { new: true })
        res.status(200).json(updatedOrder);
    } catch (err) {
        res.status(500).json(err)
    }
})

router.get('/find/:userId', verifyWebTokenAuth, async (req, res) => {
    try {
        const order = await Orders.find({ userId: req.params.userId })
        res.status(200).json(order);
    } catch (err) {
        res.status(500).json(err)
    }
})

router.get('/', verifyWebTokenAuthForAdmin, async (req, res) => {
    const query = req.query.new;
    try {
        const order = query ? await Orders.find().sort({ _id: -1 }).limit(5) : await Orders.find()
        res.status(200).json(order);
    } catch (err) {
        res.status(500).json(err)
    }
});


router.delete('/:id', verifyWebTokenAuthForAdmin, async (req, res) => {
    try {
        await Orders.findByIdAndDelete(req.params.id)
        res.status(200).json("Product deleted successfully");
    } catch (err) {
        res.status(500).json(err)
    }
})

// get monthly income

router.get('/income', verifyWebTokenAuthForAdmin, async (req, res) => {
    const date = new Date();
    const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
    const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1));
    try {
        const income = await Orders.aggregate([
            { $match: { createdAt: { $gte: previousMonth } } },
            {
                $project: {
                    month: { $month: "$createdAt" },
                    sales: "$amount"
                }
            },
            {
                $group: {
                    _id: "$month",
                    total: { $sum: "$sales" }
                }
            }
        ]);
        res.status(200).json(income)
    } catch (err) {
        res.status(500).json("err")
    }
})

module.exports = router