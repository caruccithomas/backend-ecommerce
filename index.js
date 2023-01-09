const mongoose = require('mongoose');
const path = require('path');

const express = require('express');
const app = express();

const dotenv = require('dotenv');
dotenv.config();

const userRoute = require('./routes/user');
const authenticationRoute = require('./routes/authentication');
const productRoute = require('./routes/product');
const cartRoute = require('./routes/cart');
const orderRoute = require('./routes/order');
const stripeRoute = require('./routes/stripe');

const cors = require('cors');

mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log('Database Connection was Succesfull =', (mongoose.connection.readyState)))
    .catch((e) => console.dir(e))
;

const corsOptions = {
    // origin:'http://localhost:3000',
    origin:'https://bronx-ecommerce.onrender.com', 
    credentials: true,
    optionSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/e-commerce_api/authentication', authenticationRoute);
app.use('/e-commerce_api/users', userRoute);
app.use('/e-commerce_api/products', productRoute);
app.use('/e-commerce_api/carts', cartRoute);
app.use('/e-commerce_api/orders', orderRoute);
app.use('/e-commerce_api/checkout', stripeRoute);

// Tests:

// app.get('/api/test', () => {
//     console.log('Tests are Good');
// })

// DEVELOP STAGE [ON] => process.env.NODE_ENV = 'production'
// process.env.NODE_ENV = '';

// if (process.env.NODE_ENV === 'production'){
//    app.use(express.static(path.resolve(__dirname, "./client/build")));
//    app.use(express.static(path.resolve(__dirname, "./admin/build")));
    
//    app.get('/admin', (req, res) => {
//        res.sendFile(path.resolve(__dirname, './admin/build', 'index.html'));
//    });
    
//    app.get('*', (req, res) => {
//        res.sendFile(path.resolve(__dirname, './client/build', 'index.html'));
//    });
// };

app.listen(process.env.PORT || 5000, () => {
    console.log(`Server is running on port ${process.env.PORT || 5000}`);
});