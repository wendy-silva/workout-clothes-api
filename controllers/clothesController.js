import express from "express";
import Clothes from "../models/clothes.js";
import Cart from "../models/cart.js";
import User from "../models/user.js";

const router = express.Router();

router.get("/products", async (req, res) => {
  try {
    const clothes = await Clothes.find();

    clothes.forEach((product) => {
      console.log("imgURL:", product.imgURL);
    });
    res.render("clothes/products.ejs", { clothes });
  } catch (error) {
    console.error("Error fetching clothes:", error);
    res.send("An error occurred while fetching products");
  }
});

router.get("/products/men", async (req, res) => {
  try {
    const menClothes = await Clothes.find({ category: "Mens" });
    res.render("clothes/men.ejs", { clothes: menClothes });
  } catch (error) {
    console.error("Error fetching mens clothes:", error);
    res.send("An error occurred while fetching mens products");
  }
});

router.get("/products/women", async (req, res) => {
  try {
    const womenClothes = await Clothes.find({ category: "Womens" });
    res.render("clothes/women.ejs", { clothes: womenClothes });
  } catch (error) {
    console.error("Error fetching womens clothes:", error);
    res.send("An error occurred while fetching womens products");
  }
});

router.get("/cart", async (req, res) => {
  try {
    const userId = req.session.user._id;
    const cart = await Cart.findOne({ userId }).populate("products.productId");

    if (!cart) {
      return res.render("cart/cart.ejs", { cart: [] });
    }

    res.render("cart/cart.ejs", { cart: cart.products });
  } catch (error) {
    console.error("Error fetching cart:", error);
    res.send("An error occurred while fetching the cart");
  }
});

router.get("/:productId", async (req, res) => {
  try {
    const currentUser = await User.findById(req.session.user._id);
    const product = currentUser.products.id(req.params.productId);
    res.render("clothes/product.ejs", { product });
  } catch (error) {
    console.log(error);
    res.redirect("/clothes/products");
  }
});

router.post("/cart", async (req, res) => {
  const productId = req.body.productId;

  try {
    // Find the product by ID
    const product = await Clothes.findById(productId);
    if (!product) {
      return res.status(404).send('Product not found');
    }

    // Ensure the user is logged in and retrieve the user ID from the session
    if (!req.session.user || !req.session.user.userId) {
      return res.status(401).send('User is not logged in');
    }

    const currentUserId = req.session.user.userId;

    // Find the current user's cart by user ID
    let userCart = await Cart.findOne({ userId: currentUserId });
    if (!userCart) {
      return res.status(404).send('Cart not found');
    }

    // Check if the product already exists in the cart
    const existingProductIndex = userCart.products.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (existingProductIndex !== -1) {
      // If the product exists, increment its quantity
      userCart.products[existingProductIndex].quantity += 1;
    } else {
      // If the product doesn't exist, add it to the cart with a quantity of 1
      userCart.products.push({ productId: product._id, quantity: 1 });
    }

    // Save the updated cart back to the database
    await userCart.save();

    // Populate the cart products with their details before rendering
    await userCart.populate('products.productId');

    // Render the cart view with the populated cart items
    res.render("cart/cart.ejs", { cart: userCart.products.map(p => ({
        ...p.productId.toObject(),
        quantity: p.quantity
    })) });

  } catch (error) {
    console.error("Error adding to cart:", error);
    res.status(500).send("An error occurred while adding to cart");
  }
});




router.put("/cart/updateCartItem", async (req, res) => {
  const { productId, quantity } = req.body;
  const newQuantity = parseInt(quantity, 10);

  console.log('Product ID:', productId);
  console.log('New Quantity:', newQuantity);

  // Validate quantity
  if (newQuantity <= 0) {
    req.session.message = "Quantity must be at least 1";
    return res.redirect("/clothes/cart");
  }

  if (newQuantity > 50) {
    return res.send("Quantity exceeds inventory limit");
  }

  try {
    const userId = req.session.user.userId;

    console.log('req.session.user: ', req.session.user)

    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.send("Cart not found");
    }

    console.log("User's Cart:", cart);

    // Find the item to update
    const itemIndex = cart.products.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (itemIndex !== -1) {
      // Update quantity in the user's cart
      cart.products[itemIndex].quantity = newQuantity;
      await cart.save();

      console.log('Database Cart Item Updated:', cart.products[itemIndex]);

      res.redirect("/clothes/cart");
    } else {
      console.error("Item not found in cart:", productId);
      res.send("Item not found in cart");
    }
  } catch (error) {
    console.error('Error updating cart item in database:', error);
    res.send("An error occurred while updating the cart item");
  }
});

router.delete("/cart/deleteCartItem", (req, res) => {
  const { productId } = req.body;

  const cart = req.session.cart || [];
  req.session.cart = cart.filter((item) => item._id.toString() !== productId);

  res.redirect("/clothes/cart");
});

export default router;
