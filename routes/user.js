const { verifyWebTokenAuth, verifyWebTokenAuthForAdmin } = require('./verifyToken');
const CryptoJS = require('crypto-js');
const router = require('express').Router();
const User = require('../models/user')


router.put('/:id', verifyWebTokenAuth, async (req, res) => {
    if (req.body.password) {
        req.body.password = CryptoJS.AES.encrypt(req.body.password, process.env.ENC_PASSWORD).toString();
    }
    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.id, {
            $set: req.body
        }, { new: true })
        res.status(200).json(updatedUser);
    } catch (err) {
        res.status(500).json(err)
    }
})

router.get('/find/:id', verifyWebTokenAuthForAdmin, async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
        const { password, ...others } = user._doc
        res.status(200).json(others);
    } catch (err) {
        res.status(500).json(err)
    }
})

router.get('/', verifyWebTokenAuthForAdmin, async (req, res) => {
    const query = req.query.new;
    try {
        const user = query ? await User.find().sort({ _id: -1 }).limit(5) : await User.find();
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json(err)
    }
});

router.delete('/:id', verifyWebTokenAuth, async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id)
        res.status(200).json("User deleted successfully");
    } catch (err) {
        res.status(500).json(err)
    }
})

router.get('/stat', verifyWebTokenAuthForAdmin, async (req, res) => {
    let date = new Date();
    let lastYear = new Date(date.setFullYear(date.getFullYear() - 1));
    console.log(lastYear);
    try {
        const data = await User.aggregate([
            {
                $match: { createdAt: { $gte: lastYear } }
            },
            {
                $project: { month: { $month: "$createdAt" } }
            },
            {
                $group: { _id: "$month", total: { $sum: 1 } }
            }
        ])
        res.status(200).json(data)
    } catch (err) {
        res.status(500).json(err)
    }
})


module.exports = router