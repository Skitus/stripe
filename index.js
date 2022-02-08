const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')
const stripe = require('stripe')('sk_test_51KQpaVKtH21p71NuG2sUps1yhbeZgHoUsqRq2CxsYfbDsEq1M1Ggo2I34yoq8Uofl0U5Awr7rHF6whzMeMrS4WVN001DIS4oih');
require('dotenv').config();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}))

// parse application/json
app.use(bodyParser.json())

app.use(cors());

app.post('/pay', async (req, res) => {
    const {email} = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
        amount: 5000,
        currency: 'usd',
        // Verify your integration in this guide by including this parameter
        metadata: {integration_check: 'accept_a_payment'},
        receipt_email: email,
    });

    res.json({'client_secret': paymentIntent['client_secret']})
});

app.post('/sub', async (req, res) => {
    const {email, payment_method} = req.body;

    const customer = await stripe.customers.create({
        payment_method: payment_method,
        email: email,
        invoice_settings: {
            default_payment_method: payment_method,
        },
    });

    const subscription = await stripe.subscriptions.create({
        customer: customer.id,
        items: [{plan: 'price_1KQpeNKtH21p71NuTh8f3Vv0'}],
        expand: ['latest_invoice.payment_intent'],
        trial_period_days: 1,
    });

    res.json({'status': 'ok'});
});

app.get('/sub', async (req, res) => {
    const subscriptionRetrieve = await stripe.subscriptions.retrieve("sub_1KQtboKtH21p71NuIKJUTIFR");
    res.json({subscriptionRetrieve});
});

app.listen(5000, () => console.log(`Example app listening on port ${5000}!`))