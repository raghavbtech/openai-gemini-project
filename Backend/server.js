import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import mongoose from 'mongoose';
import chatRoutes from "./routes/route.js";
import authRoutes from "./routes/authRoutes.js";
import passportconfig from "./config/passport.js"
import passport from 'passport';


const app=express();


app.use(express.json());
app.use(cors({
    origin: process.env.CLIENT_URL || 'https://openai-gemini-project1.onrender.com',
    credentials: true,
}));


app.use(passport.initialize());
passportconfig(passport);

app.use("/api/auth",authRoutes);
app.use("/api",passport.authenticate('jwt',{session:false}),chatRoutes);


const connectDB=async()=>{
    if(mongoose.connection.readyState>=1) return;
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected With Database!");
    } catch (error) {
        console.log("Failed to connect with Db",error);
    }
};

app.use(async(req,res,next)=>{
    await connectDB();
    next();
});

export default app;




