import express from 'express';
import jwt from "jsonwebtoken";
import User from '../models/user.js';



const router=express.Router();


router.post("/register",async(req,res)=>{
    try{
        const {name,email,password}=req.body;
        if(!name || !email || !password){
            return res.status(400).json({error:"All fields are required"});
        }

        const exisitingUser=await User.findOne({email});
        if(exisitingUser){
            return res.status(400).json({error:"User already exists"});
        }
        const user=new User({email,name,password});
        await user.save();
        res.status(200).json({success:"User registered successfully"});
    }
    catch(err){
        console.log(err);
        res.status(500).json({error:"server error during registration"});
    }
})



router.post("/login",async(req,res)=>{
    try{
        const {email,password}=req.body;
        const user=await User.findOne({email});
        if(!user){
            return res.status(400).json({error:"Invalid credentials"});
        }
        const isMatch=await user.matchPassword(password);
        if(!isMatch){
            return res.status(400).json({error:"Invalid credentials"});
        }

        const token=jwt.sign(
            {id:user._id},
            process.env.JWT_SECRET || "mysecretkey",
            {expiresIn:"7d"}
            
        );
        res.status(200).json({
            message:"Login Successfull",
            token,
            user:{id:user._id,name:user.name,email:user.email}
        })
    }
    catch(err){
        console.log(err);
        res.status(500).json({error:"server error during login"});
    }
});

export default router;