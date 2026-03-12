import { qdrant } from "./lib/qdrant";

export const main = async () => {
    await qdrant.createCollection("issues", {
        vectors: {
            size: 1536,
            distance: "Cosine",
        },
    });

    console.log("Collection created");
}

main().catch(console.error);