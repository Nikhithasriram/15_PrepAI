// src/controllers/questionController.js
class QuestionController {
    constructor() {
        this.generator = new QuestionGenerator();
    }

    async initialize() {
        await this.generator.initialize();
    }

    async generateQuestions(req, res) {
        try {
            const { topic, level, timeLimit } = req.body;

            if (!topic || !level || !timeLimit) {
                return res.status(400).json({ error: 'Missing required parameters' });
            }

            const questions = await this.generator.generateQuestionSet(topic, level, timeLimit);
            res.json({ questions });
        } catch (error) {
            console.error('Error:', error);
            res.status(500).json({ error: 'Failed to generate questions' });
        }
    }
}

module.exports = { QuestionController, QuestionGenerator };