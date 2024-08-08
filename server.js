import dotenv from 'dotenv'
import express from 'express';
import mongoose from 'mongoose';
import methodOverride from 'method-override';
import morgan from 'morgan';
import session from 'express-session';
import redis from 'redis';
import bodyParser from 'body-parser'


import authController from './controllers/auth.js';
import Clothes from './models/clothes.js';

dotenv.config();

const app = express();


// Set the port from environment variable or default to 3000
const port = process.env.PORT || "3000";

mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on("connected", () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});



// Middleware to parse URL-encoded data from forms
app.use(express.urlencoded({ extended: false }));
// Middleware for using HTTP verbs such as PUT or DELETE
app.use(methodOverride("_method"));
// Morgan for logging HTTP requests
app.use(morgan('dev'));
// Add Session middleware
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
}))

app.set('view engine', 'jade');

// Routes
app.get('/', async (req, res) => {
  res.render('index.ejs', {
    user: req.session.user
  })
})

app.get('/products', async (req, res) => {
    res.render('clothes/products.ejs')
  
})

app.get('/cart', async (req, res) => {
  res.render('cart/cart.ejs');
})

app.get('/favorites', async (req, res) => {
  res.render('cart/favorites.ejs')
})

app.use('/auth', authController)

const client = redis.createClient();
client.on('connect', () => {
  console.log('Connected to Redis');
});

app.listen(port, () => {
  console.log(`The express app is ready on port ${port}!`);
});