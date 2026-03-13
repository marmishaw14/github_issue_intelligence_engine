import { QdrantClient } from "@qdrant/js-client-rest";

export const qdrant = new QdrantClient({
    url: "http://localhost",
    port: 6333,
    apiKey: process.env.QDRANT_API_KEY,
});
