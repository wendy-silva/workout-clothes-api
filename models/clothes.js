import mongoose from "mongoose";

const clothesSchema = new mongoose.Schema({
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

const Clothes = mongoose.model('Clothes', clothesSchema);

export default Clothes;