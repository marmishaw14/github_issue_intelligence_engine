import { qdrant } from "./lib/qdrant";

export const main = async () => {
    const response = await qdrant.getCollections();
    console.log(response);
};

main().catch(console.error);