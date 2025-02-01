// src/services/documentStore.js
const { ChromaClient } = require('chromadb');

class DocumentStore {
    constructor() {
        this.client = new ChromaClient();
        this.collection = null;
    }

    async initialize() {
        try {
            this.collection = await this.client.createCollection("interview_questions");
        } catch (error) {
            console.error('Error initializing ChromaDB:', error);
            throw error;
        }
    }

    async addDocuments(documents) {
        try {
            const ids = documents.map((_, index) => `doc_${index}`);
            await this.collection.add({
                ids: ids,
                documents: documents,
                metadatas: documents.map(doc => ({ source: 'training_data' }))
            });
        } catch (error) {
            console.error('Error adding documents:', error);
            throw error;
        }
    }

    async query(query, topK = 3) {
        try {
            const results = await this.collection.query({
                queryTexts: [query],
                nResults: topK
            });
            return results.documents[0];
        } catch (error) {
            console.error('Error querying documents:', error);
            throw error;
        }
    }
}



