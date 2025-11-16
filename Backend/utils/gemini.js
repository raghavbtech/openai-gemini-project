import { GoogleGenerativeAI } from "@google/generative-ai";
import "dotenv/config";


const geminiapi=new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const gemini = async (message) => {
  try {
    const model = geminiapi.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent(message);
    console.log(result.response.candidates[0]['content'].parts[0].text);
    return result.response.candidates[0]['content'].parts[0].text;
  } catch (error) {
    console.error(error);
  }
};
// gemini();
export default gemini;