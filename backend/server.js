import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { OpenAI } from "openai";

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// API Route to Generate Interview Questions
app.post("/generate-question", async (req, res) => {
  try {
    const { jobRole, difficulty, questionType } = req.body;

    const prompt = `You are a professional interviewer. Generate a ${difficulty} difficulty ${questionType} interview question for a ${jobRole}.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4", // or "gpt-3.5-turbo"
      messages: [{ role: "system", content: prompt }],
      max_tokens: 100,
    });

    res.json({ question: response.choices[0].message.content });
  } catch (error) {
    console.error("Error generating question:", error);
    res.status(500).json({ error: "Failed to generate question" });
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
