import express from "express";
import mongoose from "mongoose";
import fetch from "node-fetch";
import fs from "fs/promises";
import path from "path";

const app = express();
app.use(express.json());

// Load environment variables
import dotenv from "dotenv";
dotenv.config();

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Interview session schema
const sessionSchema = new mongoose.Schema({
    candidateId: { type: String, required: true },
    domain: { type: String, required: true },
    questions: [{
        question: String,
        userAnswer: String,
        expectedAnswer: String,
        context: String,
        pageNumber: Number,
    }],
    phase: { type: String, default: 'introduction' },
    createdAt: { type: Date, default: Date.now },
});

const Session = mongoose.model('Session', sessionSchema);

// ConversationalInterviewer class
class ConversationalInterviewer {
    constructor() {
        this.questions = [];
        this.currentPhase = 'introduction';
        this.askedQuestions = new Set();
        this.technicalQuestionsAsked = 0;
        this.currentSession = null;
        this.llamaEndpoint = process.env.LLAMA_ENDPOINT || 'http://localhost:5000/generate_question';
        this.domain = null;

        // Conversational templates
        this.conversationalResponses = {
            introduction: [
                "Hi there! I'm Alex, and I'll be conducting your technical interview today. How are you doing?",
                "Hello! Thanks for joining us today. I'm Jamie, and I'll be asking you some questions about [domain]. How's your day going?",
                "Welcome to the technical interview! I'm Pat, and I'll be chatting with you about [domain] today. Ready to get started?"
            ],
            transition: [
                "Great! Let's dive into some technical questions about [domain].",
                "Excellent. Now, I'd like to explore your [domain] knowledge a bit.",
                "Perfect. Let's move on to some specific [domain] questions."
            ],
            followUp: [
                "Interesting approach! Could you elaborate on that?",
                "That's a good point. How would you handle [related scenario]?",
                "Nice explanation. What if [alternative scenario]?"
            ],
            encouragement: [
                "That's a solid explanation.",
                "Good thinking!",
                "I like your approach to this.",
                "You're on the right track."
            ],
            closing: [
                "Thank you for your detailed responses today.",
                "You've provided some great insights during our discussion.",
                "I appreciate your thorough explanations throughout the interview."
            ]
        };
    }

    // Load questions from a JSON file
    async loadQuestions(domain) {
        try {
            const filePath = path.join(process.cwd(), `${domain}_interview_questions.json`);
            const rawData = await fs.readFile(filePath, 'utf8');
            this.questions = JSON.parse(rawData);
            this.domain = domain;
            this.shuffleQuestions();
        } catch (error) {
            console.error('Error loading questions:', error);
            throw error;
        }
    }

    // Start a new interview session
    async startNewSession(candidateId, domain) {
        this.currentSession = new Session({ candidateId, domain });
        await this.currentSession.save();
        this.domain = domain;
        return this.getIntroduction();
    }

    // Get a random introduction message
    getIntroduction() {
        const intro = this.conversationalResponses.introduction[
            Math.floor(Math.random() * this.conversationalResponses.introduction.length)
        ].replace('[domain]', this.domain);
        this.currentPhase = 'introduction';
        return intro;
    }

    // Get a random encouragement message
    getRandomEncouragement() {
        return this.conversationalResponses.encouragement[
            Math.floor(Math.random() * this.conversationalResponses.encouragement.length)
        ];
    }

    // Generate a technical question using the LLaMA API
    async generateTechnicalQuestion() {
        try {
            const response = await fetch(this.llamaEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    context: this.getRelevantContext(),
                    difficulty: this.getCurrentDifficulty(),
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to generate question from LLaMA');
            }

            const questionData = await response.json();
            return questionData;
        } catch (error) {
            console.error('Error generating question:', error);
            // Fallback to a predefined question
            return {
                question: "Can you explain the concept of object-oriented programming?",
                context: "Object-oriented programming is a programming paradigm based on the concept of objects.",
                pageNumber: 1,
            };
        }
    }

    // Get relevant context for the question
    getRelevantContext() {
        if (this.domain === "JavaScript") {
            return "JavaScript is a high-level, interpreted programming language used for web development.";
        } else if (this.domain === "Python") {
            return "Python is a high-level, general-purpose programming language known for its simplicity and readability.";
        }
        return "";
    }

    // Get current difficulty level
    getCurrentDifficulty() {
        if (this.technicalQuestionsAsked < 3) return "easy";
        if (this.technicalQuestionsAsked < 6) return "medium";
        return "hard";
    }

    // Record user response
    async recordResponse(question, userAnswer) {
        if (this.currentSession) {
            this.currentSession.questions.push({
                question: question.question,
                userAnswer,
                expectedAnswer: question.expectedAnswer || "No expected answer provided.",
                context: question.context,
                pageNumber: question.pageNumber || 0,
            });
            await this.currentSession.save();
        }
    }

    // Generate a response based on the current phase
    async generateResponse(userInput) {
        if (this.currentPhase === 'technical' && this.lastTechnicalQuestion) {
            await this.recordResponse(this.lastTechnicalQuestion, userInput);
            this.lastTechnicalQuestion = null;
        }

        switch (this.currentPhase) {
            case 'introduction':
                this.currentPhase = 'technical';
                const transition = this.conversationalResponses.transition[
                    Math.floor(Math.random() * this.conversationalResponses.transition.length)
                ].replace('[domain]', this.domain);
                return transition;

            case 'technical':
                if (Math.random() < 0.3 && this.technicalQuestionsAsked > 0) {
                    return this.conversationalResponses.followUp[
                        Math.floor(Math.random() * this.conversationalResponses.followUp.length)
                    ];
                }

                if (this.technicalQuestionsAsked < this.questions.length) {
                    const question = await this.generateTechnicalQuestion();
                    this.lastTechnicalQuestion = question;
                    this.technicalQuestionsAsked++;
                    return `${this.getRandomEncouragement()} Now, ${question.question}`;
                } else {
                    this.currentPhase = 'closing';
                    return this.conversationalResponses.closing[
                        Math.floor(Math.random() * this.conversationalResponses.closing.length)
                    ];
                }

            case 'closing':
                return "Thanks for your time today! We'll be in touch soon with next steps.";
        }
    }

    // Shuffle questions
    shuffleQuestions() {
        for (let i = this.questions.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.questions[i], this.questions[j]] = [this.questions[j], this.questions[i]];
        }
    }
}

// Initialize interviewer
const interviewer = new ConversationalInterviewer();

// API Endpoints

// Start a new interview session
app.post('/api/interview/start', async (req, res) => {
    try {
        const { candidateId, domain } = req.body;
        if (!candidateId || !domain) {
            return res.status(400).json({ error: 'candidateId and domain are required' });
        }

        await interviewer.loadQuestions(domain);
        const response = await interviewer.startNewSession(candidateId, domain);
        res.json({ response });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Submit user response and get the next question
app.post('/api/interview/chat', async (req, res) => {
    try {
        const { message } = req.body;
        if (!message) {
            return res.status(400).json({ error: 'message is required' });
        }

        const response = await interviewer.generateResponse(message);
        res.json({ response });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get session details
app.get('/api/interview/session/:sessionId', async (req, res) => {
    try {
        const session = await Session.findById(req.params.sessionId);
        if (!session) {
            return res.status(404).json({ error: 'Session not found' });
        }
        res.json(session);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});