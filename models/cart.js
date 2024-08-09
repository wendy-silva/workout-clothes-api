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
    price: {
        type: Number,
        required: true,
        min: 0
    },
    quantity: {
        type: Number,
        required: true,
        min: 0
    },
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
});

const Cart = mongoose.model('Cart', cartSchema);

export default Cart;
