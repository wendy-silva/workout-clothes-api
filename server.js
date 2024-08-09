import dotenv from 'dotenv'
import express from 'express';
import mongoose from 'mongoose';
import methodOverride from 'method-override';
import morgan from 'morgan';
import session from 'express-session';
import redis from 'redis';
import bodyParser from 'body-parser'


import authController from './controllers/auth.js';
import clothesController from './controllers/clothesController.js';

dotenv.config();

const app = express();


// Set the port from environment variable or default to 3000
const port = process.env.PORT || "3000";

mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on("connected", () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

const products = [
  { id: 1, name: 'Sports Bra', description: 'Light weight seamless material, great for running, cycling, and exercise', price: 25.00, quantity: 50, image: '/Assets/product1.png' },
  { id: 2, name: 'Tank Top', description: 'Comfortable and loose designed for freedom of movement', price: 28.00, quantity: 50, image: '/Assets/product2.png' },
  { id: 3, name: 'Long Sleeve', description: 'Comfortable and seamless', price: 30.00, quantity: 50, image: '/Assets/product3.png' }
  ,
]

const client = redis.createClient();
client.on('connect', () => {
  console.log('Connected to Redis');
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
app.use('/auth', authController)
app.use('/clothes', clothesController)

app.set('view engine', 'jade');
app.set('views', './views');

// Routes
app.get('/', async (req, res) => {
  res.render('index.ejs', {
    user: req.session.user,
    favorites: req.session.favorites || [],
    cart: req.session.cart || []
  })
})

app.get('/cart', async (req, res) => {
  res.render('cart/cart.ejs', { cart: req.session.cart || [] });
})

app.get('/favorites', async (req, res) => {
  res.render('cart/favorites.ejs', { favorites: req.session.favorites || [] })
})

app.listen(port, () => {
  console.log(`The express app is ready on port ${port}!`);
});