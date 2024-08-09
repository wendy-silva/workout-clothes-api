import express from 'express';
import Clothes from '../models/clothes.js';

const router = express.Router();

router.get('/products', async (req, res) => {
  try {
    const clothes = await Clothes.find();
    res.render('clothes/products.ejs', { clothes });
  } catch (error) {
    console.error('Error fetching clothes:', error);
    res.status(500).send('An error occurred while fetching products');
  }
});

router.get('/cart', async (req, res) => {
  console.log('hi')
  // TODO figure out how to get req.session.cart into here
  res.render('cart/cart.ejs', { cart: [] });
})

router.get('/:productId', async (req, res) => {
  try {
    const currentUser = await User.findById(req.session.user._id);
    const product = currentUser.products.id(req.params.productId);
    res.render('clothes/product.ejs', { product });
  } catch (error) {
    console.log(error);
    res.redirect('/clothes/products');
  }
});

router.post('/cart', async (req, res) => {
  const productId = req.body.productId;
  try {
    const product = await Clothes.findById(productId);
    
    if (!req.session.cart) {
      req.session.cart = [];
    }
    const existingProduct = req.session.cart.find(item => item._id.toString() === productId);
    if (existingProduct) {
      existingProduct.quantity += 1;
    } else {
      req.session.cart.push({ ...product.toObject(), quantity: 1 });
    }
    res.render('cart/cart.ejs', { cart: req.session.cart })
  } catch (error) {
    console.error('Error adding to cart:', error);
    res.status(500).send('An error occurred while adding to cart');
  }
});

export default router;
