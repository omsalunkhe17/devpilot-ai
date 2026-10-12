
import splitTextIntoChunks from "../utils/textSplitter.js";
import generateEmbedding from "./embedding.service.js";

const generateDocumentEmbeddings = async (text) => {
    if (!text || !text.trim()) {
        throw new Error("Document text is required");
    }

    const chunks = await splitTextIntoChunks(text);
    const embeddedChunks = [];

    for (let i = 0; i < chunks.length; i++) {
        const embedding = await generateEmbedding(chunks[i]);

        embeddedChunks.push({
            chunkIndex: i,
            text: chunks[i],
            embedding
        });
    }

    return embeddedChunks;
};

export default generateDocumentEmbeddings;
