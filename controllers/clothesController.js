import express from 'express';
import Clothes from '../models/clothes.js';
import User from '../models/user.js'; // Make sure User model is imported
import addToCart from '../controllers/addToCart.js'; // Ensure addToCart function is correctly implemented

const router = express.Router();

// Route to get all products
router.get('/products', async (req, res) => {
    try {
        const clothes = await Clothes.find();
        res.render('clothes/products.ejs', { clothes });
    } catch (error) {
        console.error('Error fetching clothes:', error);
        res.status(500).send('An error occurred while fetching products');
    }
});

// Route to get a specific product by ID
router.get('/:productId', async (req, res) => {
    try {
        const product = await Clothes.findById(req.params.productId);
        if (!product) {
            return res.status(404).send('Product not found');
        }
        res.render('clothes/product.ejs', { product });
    } catch (error) {
        console.error('Error fetching product:', error);
        res.redirect('/clothes/products');
    }
});

// Route for adding a product to the cart
router.post('/cart', async (req, res) => {
  console.log('POST /cart request received');
  console.log('Request body:', req.body);

  const { userId, productId } = req.body; 

  if (!userId || !productId) {
      return res.status(400).send('User ID and Product ID are required');
  }

  try {
      await addToCart(userId, productId);
      res.redirect('/cart');
  } catch (error) {
      console.error('Error handling cart route:', error);
      res.status(500).send('An error occurred while adding to the cart');
  }
});

export default router;
