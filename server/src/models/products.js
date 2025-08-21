import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    image: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
    discountedPrice: { type: Number },
    quantity: { type: String, required: true, default: "0" }
});

export const Product = mongoose.model("Product", productSchema);
