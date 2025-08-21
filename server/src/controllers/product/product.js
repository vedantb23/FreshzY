import {Product} from "../../models/products.js"

export const    getProductsByCategory=async (req,res) => {
    const   {categoryId} = req.params;
    try {
        const products = await Product.find({ category: categoryId }).select("-category").exec();
        
        return res.send({ message: "Products fetched successfully", products });
    } catch (error) {
        return res.status(500).send({ message: "Internal server error" }, error);
    }
}