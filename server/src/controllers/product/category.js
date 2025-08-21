import Category from '../../models/category.js';

export const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    return res.send({ message: "Categories fetched successfully", categories });
  } catch (error) {
    return res.status(500).send({ message: "Internal server error" }, error);
  }
};
