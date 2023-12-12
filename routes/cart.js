const { verifyWebTokenAuth, verifyWebTokenAuthForAdmin } = require('./verifyToken');
const CryptoJS = require('crypto-js');
const router = require('express').Router();
const Cart = require('../models/cart');

router.post('/', async (req, res) => {

    try {
        const existingCart = await Cart.findOne({ productId: req.body.productId });
        if (existingCart) {
            res.status(501).json("Product allready exist in your cart")
        } else {
            const newCart = new Cart(req.body);
            const newAddedCart = await newCart.save();
            res.status(200).json(newAddedCart)
        }
    } catch (err) {
        res.status(500).json(err)
    }
})

router.put('/:id', verifyWebTokenAuth, async (req, res) => {
    try {
        const updatedCart = await Cart.findByIdAndUpdate(req.params.id, {
            $set: req.body
        }, { new: true })
        res.status(200).json(updatedCart);
    } catch (err) {
        res.status(500).json(err)
    }
})

router.get('/find/:userId', async (req, res) => {
    try {
        const cart = await Cart.find({ userId: req.params.userId })
        res.status(200).json(cart);
    } catch (err) {
        res.status(500).json(err)
    }
})

router.get('/', verifyWebTokenAuthForAdmin, async (req, res) => {
    try {
        const cart = await Cart.find()
        res.status(200).json(cart);
    } catch (err) {
        res.status(500).json(err)
    }
});

router.delete('/:id', verifyWebTokenAuth, async (req, res) => {
    try {
        await Cart.findByIdAndDelete(req.params.id)
        res.status(200).json("Product deleted successfully");
    } catch (err) {
        res.status(500).json(err)
    }
})

router.delete('/delete/:id', verifyWebTokenAuth, async (req, res) => {
    console.log("inside all delete")
    console.log(req.params.id)
    try {
        await Cart.deleteMany({ userId: req.params.id })
        res.status(200).json("all cart products deleted successfully");
    } catch (err) {
        res.status(500).json(err)
    }
})


module.exports = router