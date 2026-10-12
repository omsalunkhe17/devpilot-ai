
import { Pinecone } from "@pinecone-database/pinecone";

const apiKey = process.env.PINECONE_API_KEY;
const indexHost = process.env.PINECONE_INDEX_HOST;

if (!apiKey) {
    throw new Error("PINECONE_API_KEY is missing from .env");
}

if (!indexHost) {
    throw new Error("PINECONE_INDEX_HOST is missing from .env");
}

const pinecone = new Pinecone({ apiKey });

const knowledgeIndex = pinecone.index({
    host: indexHost
});

export default knowledgeIndex;
