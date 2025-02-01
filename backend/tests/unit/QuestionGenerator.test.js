// tests/unit/QuestionGenerator.test.js
const { QuestionGenerator } = require('../../src/services/questionGenerator');
const { DocumentStore } = require('../../src/services/document_store');

// Mock the Llama and ChromaDB dependencies
jest.mock('node-llama-cpp', () => ({
    LlamaModel: jest.fn().mockImplementation(() => ({
        // Mock methods
    })),
    LlamaContext: jest.fn(),
    LlamaChatSession: jest.fn().mockImplementation(() => ({
        prompt: jest.fn().mockResolvedValue('What is inheritance in Java?')
    }))
}));

jest.mock('../../src/services/documentStore');

describe('QuestionGenerator', () => {
    let questionGenerator;

    beforeEach(() => {
        // Reset all mocks before each test
        jest.clearAllMocks();
        questionGenerator = new QuestionGenerator();
    });

    test('should initialize successfully', async () => {
        await questionGenerator.initialize();
        expect(DocumentStore).toHaveBeenCalled();
    });

    test('should generate a valid question', async () => {
        const prompt = 'Generate a Java question about inheritance';
        const question = await questionGenerator.generateQuestion(prompt);
        expect(question).toBe('What is inheritance in Java?');
    });

    test('should format questions correctly', () => {
        const testCases = [
            {
                input: '1. What is inheritance in Java?',
                expected: 'What is inheritance in Java?'
            },
            {
                input: 'Q: What are primitive data types?',
                expected: 'What are primitive data types?'
            },
            {
                input: 'Tell me about Java classes',
                expected: 'Tell me about Java classes?'
            }
        ];

        testCases.forEach(({ input, expected }) => {
            const formatted = questionGenerator.formatQuestion(input);
            expect(formatted).toBe(expected);
        });
    });

    test('should generate correct number of questions based on time limit', async () => {
        const questions = await questionGenerator.generateQuestionSet('Java', 'easy', '30');
        expect(questions).toHaveLength(3);
    });
});