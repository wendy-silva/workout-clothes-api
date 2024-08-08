import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 0
    }
});

const Cart = mongoose.model('Cart', cartSchema);

export default Cart;