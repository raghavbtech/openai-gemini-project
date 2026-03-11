import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import mongoose from 'mongoose';
import OpenAI from "openai";
import chatRoutes from "./routes/route.js";
import authRoutes from "./routes/authRoutes.js";
import passportconfig from "./config/passport.js"
import passport from 'passport';


const openAi=new OpenAI();
const app=express();
const PORT=8080;


app.use(express.json());
app.use(cors({
    origin: process.env.CLIENT_URL || 'https://openai-gemini-project1.onrender.com',
    credentials: true,
}));


app.use(passport.initialize());
passportconfig(passport);

app.use("/api/auth",authRoutes);
app.use("/api",passport.authenticate('jwt',{session:false}),chatRoutes);


app.listen(PORT,()=>{
    console.log(`server running on ${PORT}`);
    connectDB();
})

const connectDB=async()=>{
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected With Database!");
    } catch (error) {
        console.log("Failed to connect with Db",error);
        
    }
};




