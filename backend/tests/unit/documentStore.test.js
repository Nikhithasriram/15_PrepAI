// tests/unit/documentStore.test.js
describe('DocumentStore', () => {
    let documentStore;

    beforeEach(() => {
        documentStore = new DocumentStore();
    });

    test('should initialize ChromaDB collection', async () => {
        await documentStore.initialize();
        expect(documentStore.collection).toBeDefined();
    });

    test('should add documents successfully', async () => {
        const testDocs = [
            {
                topic: 'Java',
                question: 'What is inheritance?'
            }
        ];

        await documentStore.initialize();
        await documentStore.addDocuments(testDocs);
        // Add expectations based on ChromaDB behavior
    });

    test('should retrieve relevant documents', async () => {
        await documentStore.initialize();
        const results = await documentStore.query('Java inheritance');
        expect(Array.isArray(results)).toBe(true);
    });
});