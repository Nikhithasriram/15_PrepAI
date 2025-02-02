import express from "express"
import axios from "axios"
import dotenv from "dotenv"
dotenv.config()
import cors from "cors";
const router = express.Router();


// Configuration for different difficulty levels and time limits
const DIFFICULTY_PARAMS = {
    easy: { maxLength: 100, temperature: 0.7 },
    medium: { maxLength: 150, temperature: 0.8 },
    hard: { maxLength: 200, temperature: 0.9 }
};

const TIME_QUESTION_COUNT = {
    '30': 3,
    '45': 5,
    '60': 7
};

// Topic-specific prompts and concepts
const TOPIC_TEMPLATES = {
    Java: {
        easy: {
            concepts: ['variables', 'data types', 'loops', 'basic OOP'],
            prompt: 'Generate a basic Java programming interview question about'
        },
        medium: {
            concepts: ['inheritance', 'polymorphism', 'exception handling', 'collections'],
            prompt: 'Create an intermediate level Java programming interview question about'
        },
        hard: {
            concepts: ['multithreading', 'memory management', 'design patterns', 'advanced Java APIs'],
            prompt: 'Form an advanced Java programming interview question focusing on'
        }
    }
    // Add more topics as needed
};

class QuestionGenerator {
    constructor() {
        this.client = axios.create({
            baseURL: 'https://api-inference.huggingface.co/models/gpt2',
            headers: { 'Authorization': `Bearer ${process.env.HUGGING_FACE_API_KEY}` }
        });
    }

    async generatePrompt(topic, level) {
        const topicTemplate = TOPIC_TEMPLATES[topic]?.[level];
        if (!topicTemplate) {
            throw new Error('Invalid topic or level');
        }

        const concept = topicTemplate.concepts[Math.floor(Math.random() * topicTemplate.concepts.length)];
        return `${topicTemplate.prompt} ${concept}.`;
    }

    async generateQuestion(prompt, level) {
        try {
            const params = DIFFICULTY_PARAMS[level];
            const response = await this.client.post('', {
                inputs: prompt,
                parameters: {
                    max_length: params.maxLength,
                    temperature: params.temperature,
                    num_return_sequences: 1,
                    do_sample: true,
                    no_repeat_ngram_size: 2,
                    top_k: 50,
                    top_p: 0.95
                }
            });

            return this.formatQuestion(response.data[0].generated_text);
        } catch (error) {
            console.error('Error generating question:', error);
            throw new Error('Failed to generate question');
        }
    }

    formatQuestion(rawText) {
        // Extract the question from the generated text
        const lines = rawText.split('\n');
        let question = '';
        
        // Look for a line containing a question mark
        for (const line of lines) {
            if (line.includes('?')) {
                question = line.trim();
                break;
            }
        }

        // If no question mark found, take the first line and add a question mark
        if (!question) {
            question = `${lines[0].trim()}?`;
        }

        // Ensure the question starts with a capital letter
        return question.charAt(0).toUpperCase() + question.slice(1);
    }

    async generateQuestionSet(topic, level, timeLimit) {
        const questionCount = TIME_QUESTION_COUNT[timeLimit];
        const questions = new Set();

        while (questions.size < questionCount) {
            const prompt = await this.generatePrompt(topic, level);
            const question = await this.generateQuestion(prompt, level);
            questions.add(question);
        }

        return Array.from(questions);
    }
}

// Express route handler
const questionGenerator = new QuestionGenerator();

router.post('/generate-questions', async (req, res) => {
    try {
        const { topic, level, timeLimit } = req.body;

        if (!topic || !level || !timeLimit) {
            return res.status(400).json({ error: 'Missing required parameters' });
        }

        if (!TOPIC_TEMPLATES[topic]) {
            return res.status(400).json({ error: 'Invalid topic' });
        }

        if (!DIFFICULTY_PARAMS[level]) {
            return res.status(400).json({ error: 'Invalid difficulty level' });
        }

        if (!TIME_QUESTION_COUNT[timeLimit]) {
            return res.status(400).json({ error: 'Invalid time limit' });
        }

        const questions = await questionGenerator.generateQuestionSet(topic, level, timeLimit);
        res.json({ questions });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Failed to generate questions' });
    }
});

module.exports = router;