import mongoose from "mongoose";

export const connectDB=async (uri) => {
    try {
        await mongoose.connect(uri);
        console.log("Mongodb datavase connection sucees!")
    } catch (error) {
        console.log("Database connect error",error)
    }
  
}
