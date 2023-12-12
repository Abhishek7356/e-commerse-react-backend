const router = require('express').Router();
const User = require('../models/user');
const CryptoJS = require('crypto-js');
const dotenv = require('dotenv');
var jwt = require('jsonwebtoken');
dotenv.config()

router.post('/register', async (req, res) => {
    const user = {
        username: req.body.username,
        password: CryptoJS.AES.encrypt(req.body.password, process.env.ENC_PASSWORD).toString(),
        email: req.body.email
    }
    const newUser = new User(user);
    try {
        newAddedUser = await newUser.save();
        res.status(201).json(newAddedUser)
    } catch (err) {
        res.status(500).json(err)
    }
})

router.post('/login', async (req, res) => {
    console.log(req.body)
    try {
        const loginUser = await User.findOne({ username: req.body.username });
        if (loginUser) {
            const hashedPassword = CryptoJS.AES.decrypt(loginUser.password, process.env.ENC_PASSWORD);
            userPassword = hashedPassword.toString(CryptoJS.enc.Utf8);
            console.log(userPassword);
            if (userPassword === req.body.password) {
                const accessToken = jwt.sign({
                    id: loginUser._id,
                    isAdmin: loginUser.isAdmin
                }, process.env.JWT_KEY, { expiresIn: "3d" });

                const { password, ...others } = loginUser._doc
                res.status(200).json({ ...others, accessToken })
            } else {
                res.status(500).json("Wrong Password!")
            }
        } else {
            res.status(500).json("No user found!. Please create an account")
        }
    } catch (err) {
        res.status(500).json(err)
    }
})

module.exports = router