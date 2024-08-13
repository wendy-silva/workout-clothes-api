import express from "express";
import bcrypt, { hash } from "bcrypt";

import User from "../models/user.js";
import Cart from "../models/cart.js";

const authRouter = express.Router();

authRouter.get("/sign-up", async (req, res) => {
  res.render("auth/sign-up.ejs");
});

authRouter.get("/sign-in", async (req, res) => {
  res.render("auth/sign-in.ejs");
});

authRouter.get("/sign-out", async (req, res) => {
  req.session.destroy();
  res.redirect("/");
});

authRouter.post("/sign-up", async (req, res) => {
  try {
    // Check if the user exists
    const existingUser = await User.findOne({ username: req.body.username });

    if (existingUser) {
      return res.status(400).send("User already exists");
    }

    // Check if the password matches confirm password
    if (req.body.password !== req.body.confirmPassword) {
      return res.status(400).send("Password does not match Confirm Password");
    }

    // Hash the provided password using bcrypt, salt 10 times
    const hashedPassword = bcrypt.hashSync(req.body.password, 10);

    // Create a new User
    const newUser = await User.create({
      username: req.body.username,
      password: hashedPassword,
    });

    // Create a cart for the new user
    const userCart = await Cart.create({
      userId: newUser._id,
      products: [],
    });

    // Update the user with the reference to the cart
    newUser.cart = userCart._id;
    await newUser.save();

    // Redirect the user to the sign-in page
    res.redirect("/auth/sign-in");

  } catch (error) {
    console.error("Error creating a user:", error);
    res.status(500).send("Error creating a user.");
  }
});


authRouter.post("/sign-in", async (req, res) => {
  try {
    // Check if the user exists
    const user = await User.findOne({ username: req.body.username });

    if (!user) {
      res.send(
        "User either does not exist, or you have provided the wrong credentials"
      );
    }

    // Compare provided raw password, with the hashed password in the DB
    const validPassword = bcrypt.compareSync(req.body.password, user.password);

    if (!validPassword) {
      res.send("Error, the password was wrong!");
    }

    // There is a user AND they had the correct password. Time to make a session!
    // Avoid storing the password, even in hashed format, in the session
    // If there is other data you want to save to `req.session.user`, do so here!
    req.session.user = {
      username: user.username,
      userId: user._id,
      userCart: user.cart
    };

    console.log('req.session.user: ', req.session.user)
    console.log('req.session.user.userId: ', req.session.user.userId)

    res.redirect("/clothes/products");
  } catch (error) {
    console.error("Was not able to sign in", error);
  }
});

export default authRouter;
