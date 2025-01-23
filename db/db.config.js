import mongoose from "mongoose";
import dotenv from 'dotenv';

dotenv.config()

let url = process.env.MONGO_URI;

const dbConnect = () => {
    mongoose.connect(url)
    .then(()=> console.log("Connected to MongoDB"))
    .catch((err)=> console.log("MongoDB connection failed" + err));
}

export default dbConnect;