const { verifyWebTokenAuth, verifyWebTokenAuthForAdmin } = require('./verifyToken');
const CryptoJS = require('crypto-js');
const router = require('express').Router();
const Product = require('../models/product');

router.post('/', verifyWebTokenAuthForAdmin, async (req, res) => {
    const newProduct = new Product(req.body);
    try {
        const newAddedProduct = await newProduct.save();
        res.status(201).json(newAddedProduct)
    } catch (err) {
        res.status(500).json(err)
    }
})

router.put('/:id', verifyWebTokenAuthForAdmin, async (req, res) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, {
            $set: req.body
        }, { new: true })
        res.status(200).json(updatedProduct);
    } catch (err) {
        res.status(500).json(err)
    }
})

router.get('/find/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)
        res.status(200).json(product);
    } catch (err) {
        res.status(500).json(err)
    }
})

router.get('/', async (req, res) => {
    const newQuery = req.query.new;
    const categoryQuery = req.query.category;
    let product;
    try {
        if (newQuery) {
            product = await Product.find().sort({ createdAt: -1 }).limit(1);
        } else if (categoryQuery) {
            product = await Product.find({
                category: {
                    $in: [categoryQuery]
                }
            })
        } else {
            product = await Product.find().sort({ createdAt: -1 });
        }
        res.status(200).json(product);
    } catch (err) {
        res.status(500).json(err)
    }
});

router.delete('/delete/:id', verifyWebTokenAuthForAdmin, async (req, res) => {
    console.log("inside done")
    console.log(req.params.id)
    try {
        const deletedProduct = await Product.findByIdAndDelete(req.params.id)
        res.status(200).json("Product deleted successfully");
    } catch (err) {
        res.status(500).json(err)
    }
})


module.exports = router