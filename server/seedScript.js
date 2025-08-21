import "dotenv/config"
import mongoose from "mongoose";
import {Category,Product}from "./src/models/index.js"
import {categories,products} from "./seedData.js"


async function seedDatabase() { 
    try {
        await mongoose.connect(process.env.MONGO_URI);
        await Category.deleteMany({});
        await Product.deleteMany({});
        const categoryDocs=await Category.insertMany(categories);
        // const productDocs=await Product.insertMany(products);
        const categoryMap=categoryDocs.reduce((map, category) => {
            map[category.name]=category._id;
            return map;
        }, {});

        const productWithCatIds = products.map((product) =>( {
            ...product,
            category: categoryMap[product.category],
        }));

        await Product.insertMany(productWithCatIds);
        console.log("Database seeded successfully");

    } catch (error) {
            console.log("error in fetching seed data",error)
    }
    finally {
            mongoose.connection.close();
    }

}

seedDatabase();