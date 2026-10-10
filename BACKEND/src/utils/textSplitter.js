
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 150
});

const splitTextIntoChunks = async (text) => {
    const chunks = await textSplitter.splitText(text);

    return chunks;
};

export default splitTextIntoChunks;
