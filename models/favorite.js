import mongoose from "mongoose";

const favoriteSchema = new mongoose.Schema({
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

const Favorite = mongoose.model('Favorite', favoriteSchema);

export default Favorite;