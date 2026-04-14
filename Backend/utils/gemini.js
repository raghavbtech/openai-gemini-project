import { GoogleGenerativeAI } from "@google/generative-ai";
import "dotenv/config";


const geminiapi=new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const gemini = async (message) => {
  const model = geminiapi.getGenerativeModel({ model: "gemini-2.5-flash" });
  const result = await model.generateContent(message);
  return result.response.candidates[0]['content'].parts[0].text;
};
// gemini();
export default gemini;