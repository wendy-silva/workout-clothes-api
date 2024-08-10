import express from "express";
import Clothes from "../models/clothes.js";

const router = express.Router();

router.get("/products", async (req, res) => {
  try {
    const clothes = await Clothes.find();
    res.render("clothes/products.ejs", { clothes });
  } catch (error) {
    console.error("Error fetching clothes:", error);
    res.send("An error occurred while fetching products");
  }
});

router.get('/products/men', async (req, res) => {
  try {
    const menClothes = await Clothes.find({ category: 'Mens' });
    res.render('clothes/men.ejs', { clothes: menClothes });
  } catch (error) {
    console.error('Error fetching mens clothes:', error);
    res.send('An error occurred while fetching mens products');
  }
});

router.get('/products/women', async (req, res) => {
  try {
    const womenClothes = await Clothes.find({ category: 'Womens' });
    res.render('clothes/women.ejs', { clothes: womenClothes });
  } catch (error) {
    console.error('Error fetching womens clothes:', error);
    res.send('An error occurred while fetching womens products');
  }
});

router.get("/cart", async (req, res) => {
  const cart = req.session.cart || [];

  res.render("cart/cart.ejs", { cart });
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
    const product = await Clothes.findById(productId);

    if (!req.session.cart) {
      req.session.cart = [];
    }
    const existingProduct = req.session.cart.find(
      (item) => item._id.toString() === productId
    );
    if (existingProduct) {
      existingProduct.quantity += 1;
    } else {
      req.session.cart.push({ ...product.toObject(), quantity: 1 });
    }
    res.render("cart/cart.ejs", { cart: req.session.cart });
  } catch (error) {
    console.error("Error adding to cart:", error);
    res.send("An error occurred while adding to cart");
  }
});

router.put("/cart/updateCartItem", async (req, res) => {
  const { productId, quantity } = req.body;
  const newQuantity = parseInt(quantity, 10);

  if (newQuantity <= 0) {
    req.session.message = "Quantity must be at least 1";
    return res.redirect("/clothes/cart");
  }

  if (newQuantity > 50) {
    return res.send("Quantity exceeds inventory");
  }

  const cart = req.session.cart || [];
  const item = cart.find((item) => item._id.toString() === productId);

  if (item) {
    item.quantity = newQuantity;
    req.session.cart = cart;
    res.redirect("/clothes/cart");
  } else {
    res.send("Item not found in cart");
  }
});

router.delete("/cart/deleteCartItem", (req, res) => {
  const { productId } = req.body;

  const cart = req.session.cart || [];
  req.session.cart = cart.filter((item) => item._id.toString() !== productId);

  res.redirect("/clothes/cart");
});

export default router;
