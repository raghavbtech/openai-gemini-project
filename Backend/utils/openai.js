import 'dotenv/config';
import OpenAI from 'openai';



const openai=async(message)=>{
    const openAi=new OpenAI({
        apiKey:process.env.OPENAI_API_KEY
    });
    const completion=await openAi.chat.completions.create({
        messages:[{
            role:"user",
            content:message,
        }
    ],
        model:"gpt-4o-mini",
        store:true
    });

    return completion.choices[0].message.content;
}


export default openai;
