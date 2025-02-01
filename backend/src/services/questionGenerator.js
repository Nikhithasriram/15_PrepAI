// src/services/QuestionGenerator.js
import { LlamaModel,LlamaContext,LlamaChatSession } from "node-llama-cpp";
import DocumentStore from "./document_store.js"
class QuestionGenerator {
    constructor() {
        // Initialize Llama model
        this.model = new LlamaModel({
            modelPath: process.env.LLAMA_MODEL_PATH,
            contextSize: 2048,
            temperature: 0.7
        });
        this.context = new LlamaContext({ model: this.model });
        this.documentStore = new DocumentStore();
    }

    async initialize() {
        await this.documentStore.initialize();
        // Load your interview questions dataset
        const trainingData = require('../data/interview_questions.json');
        await this.documentStore.addDocuments(trainingData);
    }

    async generatePrompt(topic, level, context) {
        const topicTemplate = TOPIC_TEMPLATES[topic]?.[level];
        if (!topicTemplate) {
            throw new Error('Invalid topic or level');
        }

        // Combine template with retrieved context
        return `
Based on the following reference material:
${context.join('\n')}

${topicTemplate.prompt} about ${topicTemplate.concepts.join(', ')}.
The question should be at ${level} difficulty level.
Generate a clear, specific interview question that tests the candidate's knowledge.
`;
    }

    async retrieveContext(topic, level) {
        const query = `${topic} ${level} programming interview questions`;
        return await this.documentStore.query(query);
    }

    async generateQuestion(prompt) {
        try {
            const session = new LlamaChatSession({ context: this.context });
            const response = await session.prompt(prompt);
            return this.formatQuestion(response);
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

        // Clean up and format the question
        question = question
            .replace(/^\d+\.\s*/, '') // Remove leading numbers
            .replace(/^Q:\s*/, '')    // Remove Q: prefix
            .trim();

        // Ensure the question starts with a capital letter
        return question.charAt(0).toUpperCase() + question.slice(1);
    }

    async generateQuestionSet(topic, level, timeLimit) {
        const questionCount = TIME_QUESTION_COUNT[timeLimit];
        const questions = new Set();
        
        // Retrieve relevant context once for the entire set
        const context = await this.retrieveContext(topic, level);

        while (questions.size < questionCount) {
            const prompt = await this.generatePrompt(topic, level, context);
            const question = await this.generateQuestion(prompt);
            
            // Only add the question if it's unique
            if (!questions.has(question)) {
                questions.add(question);
            }
        }

        return Array.from(questions);
    }
}