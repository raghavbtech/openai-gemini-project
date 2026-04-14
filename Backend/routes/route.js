import express from 'express';
import Thread from '../models/model.js';
import openai from '../utils/openai.js';
import passport from 'passport';
import gemini from '../utils/gemini.js';


const router=express.Router();

//test
router.post("/test",async(req,res)=>{
    try{
        const thread=new Thread({
            threadId:"abc2",
            title:"Testing2"
        })
        const response=await thread.save();
        res.send(response);
    }
    catch(err){
        console.log(err);
        res.status(500).json({error:"Failed to save in DB"});
    }
})



//get all threads(admin)
router.get("/threads",async(req,res)=>{
    try{
        const threads=await Thread.find({}).sort({updatedAt:-1}).populate("user","name email");
        res.json(threads);
    }
    catch(err){
        console.log(err);
        res.status(500).json({error:"Failed to fetch threads"});
    }
})



//get a single thread
router.get("/threads/:threadId",async(req,res)=>{
    try{

    
    const {threadId}=req.params;
    const thread=await Thread.findOne({threadId}).populate("user","name email");
    if(!thread){
        return res.status(400).json({error:"Unable to get thread"});
    }
    res.json(thread);
    }
    catch(err){
        console.log(err);
        res.status(500).json({error:"Failed to fetch thread"});
    }
})


//delete a single thread
router.delete("/threads/:threadId",async(req,res)=>{
    const {threadId}=req.params;
    try{
        const thread=await Thread.findOne({threadId});
        if(!thread){
            return res.status(400).json({error:"Unable to find the thread"});
        }
        await thread.deleteOne();
        res.status(200).json({success:"Thread Deleted Successfully"});

    }
    catch(err){
        res.status(500).json({error:"Failed to delete the thread"});
    }
})


//create a single thread and update a thread
router.post("/threads",async(req,res)=>{
    const {threadId,message,provider}=req.body;
    if(!threadId || !message || !provider){
        return res.status(400).json({error:"Missing required fields"});
    }

    try{
        let thread=await Thread.findOne({threadId});
        if(!thread){
            thread=new Thread({
                threadId,
                title:message,
                messages:[{role:"user",content:message}],
            })
        }
        else{
            thread.messages.push({role:"user",content:message});
        }
        const aiResponse=await (provider=="OpenAI"?openai(message):gemini(message));
        thread.messages.push({role:"assistant",content:aiResponse});
        thread.updatedAt=new Date();
        await thread.save();
        res.status(200).json({reply:aiResponse});
    }
    catch(err){
        console.log(err);
        res.status(500).json({error: err.message || "Failed to get AI response"});
    }

});

//get all threads for the logged in user
router.get("/mythreads",async(req,res)=>{
    try {
        const threads=await Thread.find({}).sort({updatedAt:-1});
        res.status(200).json(threads);
    } catch (error) {
        console.log(error);
        res.status(500).json({error:"Failed to fetch user threads"});
    }
})



export default router;