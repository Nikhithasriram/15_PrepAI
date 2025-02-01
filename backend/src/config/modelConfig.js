export default {
    llamaConfig: {
        contextSize: 2048,
        temperature: 0.7,
        topP: 0.95,
        topK: 50
    },
    ragConfig: {
        retrievalCount: 3,
        minSimilarity: 0.7
    }
};