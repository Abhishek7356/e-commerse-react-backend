
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const authRoute = require('./routes/auth')
const userRoute = require('./routes/user')
const productRoute = require('./routes/product')
const cartRoute = require('./routes/cart')
const ordersRoute = require('./routes/order')
const stripeRoute = require('./routes/stripe')
const cors = require('cors')

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors())
app.use('/auth/user', authRoute);
app.use('/auth/user', userRoute);
app.use('/api/product', productRoute);
app.use('/api/cart', cartRoute);
app.use('/api/order', ordersRoute);
app.use('/api/checkout', stripeRoute);

mongoose.connect(
    process.env.MONGO_URL
)
    .then(() => {
        console.log('mongodb connected')
    })
    .catch((err) => {
        console.log(err)
    })


app.listen(process.env.PORT || 5000, () => {
    console.log('Server Started')
})