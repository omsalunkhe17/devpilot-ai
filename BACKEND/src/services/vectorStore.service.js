
import knowledgeIndex from "./pinecone.service.js";

const storeDocumentChunks = async ({
    documentId,
    workspaceId,
    chunks
}) => {
    if (!documentId || !workspaceId) {
        throw new Error("Document ID and workspace ID are required");
    }

    if (!chunks || chunks.length === 0) {
        throw new Error("No chunks provided to store");
    }

    const records = chunks.map((chunk) => ({
        id: `${documentId}-chunk-${chunk.chunkIndex}`,
        values: chunk.embedding,
        metadata: {
            documentId: String(documentId),
            workspaceId: String(workspaceId),
            chunkIndex: chunk.chunkIndex,
            text: chunk.text
        }
    }));

    await knowledgeIndex.upsert({
        records
    });

    return {
        storedCount: records.length
    };
};

export default storeDocumentChunks;
