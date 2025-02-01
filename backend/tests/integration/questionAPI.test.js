const request = require('supertest');
const app = require('../../src/app');
const { QuestionController } = require('../../src/controllers/questionController');

describe('Question API', () => {
    beforeAll(async () => {
        const controller = new QuestionController();
        await controller.initialize();
    });

    test('should generate questions with valid input', async () => {
        const response = await request(app)
            .post('/api/generate-questions')
            .send({
                topic: 'Java',
                level: 'easy',
                timeLimit: '30'
            });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('questions');
        expect(Array.isArray(response.body.questions)).toBe(true);
    });

    test('should handle invalid input', async () => {
        const response = await request(app)
            .post('/api/generate-questions')
            .send({
                topic: 'InvalidTopic',
                level: 'easy',
                timeLimit: '30'
            });

        expect(response.status).toBe(400);
    });
});