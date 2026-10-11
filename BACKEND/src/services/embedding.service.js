
import { GoogleGenAI } from "@google/genai";

const EMBEDDING_MODEL = "gemini-embedding-001";

const generateEmbedding = async (text) => {
    if (!text || !text.trim()) {
        throw new Error("Text is required to generate an embedding");
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
        throw new Error(
            "GEMINI_API_KEY is missing. Check your BACKEND/.env file."
        );
    }

    const ai = new GoogleGenAI({ apiKey });

    const response = await ai.models.embedContent({
        model: EMBEDDING_MODEL,
        contents: text,
        config: {
            outputDimensionality: 768
        }
    });

    const embedding = response.embeddings?.[0]?.values;

    if (!embedding || embedding.length === 0) {
        throw new Error("Failed to generate embedding");
    }

    return embedding;
};

export default generateEmbedding;
