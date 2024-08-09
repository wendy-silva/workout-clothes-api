import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        minLength: 5,
        maxLength: 20
    },
    password: {
        type: String,
        required: true,
    },
    favorites: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Favorite' // Reference to the Favorite model
    }],
    cart: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cart' // Reference to the Cart model
    }]
});

const User = mongoose.model("User", userSchema);

export default User;
