import mongoose from "mongoose";
import bcrypt from "bcrypt";
import Thread from "./model.js";

const UserSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    threads:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"thread"
        }
    ]
});

UserSchema.pre("save",async function(next){
    if(!this.isModified("password"))return next();
    const salt=await bcrypt.genSalt(10);
    this.password=await bcrypt.hash(this.password,salt);
    next();    
})

UserSchema.methods.matchPassword=async function (enteredPassword){
    return await bcrypt.compare(enteredPassword,this.password);
}


const User=mongoose.model("User",UserSchema);

export default User;