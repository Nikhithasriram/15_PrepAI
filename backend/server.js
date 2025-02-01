import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { exec } from "child_process";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// API Route to Generate Interview Questions
app.post("/generate-questions", async (req, res) => {
  try {
    const { jobRole, difficulty, questionType } = req.body;
    const prompt = `You are a professional interviewer. Generate a ${difficulty} difficulty ${questionType} interview question for a ${jobRole}.`;

    // Call Python script with the prompt as argument
    exec(`python generate_question.py "${prompt}"`, (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        res.status(500).json({ error: "Failed to generate question" });
        return;
      }

      // Parse Python script output
      const response = JSON.parse(stdout);
      res.json({ question: response.generated_text });
    });
  } catch (error) {
    console.error("Error generating question:", error);
    res.status(500).json({ error: "Failed to generate question" });
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
