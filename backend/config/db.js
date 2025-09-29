import mongoose from "mongoose";

  const connectDB = async() =>{
    try {
       await mongoose.connect(process.env.MONGODB_URI);
       console.log("DB Connected");
       
    } catch (error) {
        console.log("Failed to connected DB");
        process.exit(1);
    }
}

export default connectDB;