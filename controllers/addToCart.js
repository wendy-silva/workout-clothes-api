import User from '../models/user.js';
import Clothes from '../models/clothes.js';

async function addToCart(userId, productId) {
    try {
        // Find the user and the product
        const user = await User.findById(userId);
        const product = await Clothes.findById(productId);

        if (!user || !product) {
            throw new Error('User or Product not found');
        }

        // Find if the product is already in the user's cart
        let cartItem = user.cart.find(item => item._id.toString() === product._id.toString());

        if (cartItem) {
            // Product is already in the cart, update the quantity
            cartItem.quantity += 1;
        } else {
            // Add new product to the cart
            user.cart.push({
                _id: product._id,
                name: product.name,
                description: product.description,
                price: product.price,
                quantity: 1
            });
        }

        // Save the user with the updated cart
        await user.save();
        console.log('Product added to user\'s cart');
    } catch (error) {
        console.error('Error adding to cart:', error);
    }
}

export default addToCart;
