const router = require('express').Router();
const stripe = require('stripe')(process.env.STRIPE_KEY);
// console.log(process.env.STRIPE_KEY)

router.post("/payment", async (req, res) => {
    // console.log("inside stripe route")
    // console.log(req.body.products);

    const lineItems = req.body.products.map((item) => ({
        price_data: {
            currency: "inr",
            product_data: {
                name: item.product
            },
            unit_amount: item.price * 100
        },
        quantity: 1
    }))
    try {

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: lineItems,
            mode: 'payment',
            success_url: `https://shoppy-mern-abhishek.netlify.app/success/${req.body.products[0].userId}`,
            cancel_url: 'https://shoppy-mern-abhishek.netlify.app/cancel',
        });
        res.json({ id: session.id })
    } catch (err) {
        res.status(500).json(err)
        console.log(err)
    }
})

module.exports = router;