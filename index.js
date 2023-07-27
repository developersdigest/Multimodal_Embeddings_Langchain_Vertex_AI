//1 Import necessary modules
import fs from "fs";
import path from "path";
import { GoogleVertexAIMultimodalEmbeddings } from "langchain/experimental/multimodal_embeddings/googlevertexai";
import { FaissStore } from "langchain/vectorstores/faiss";
import { Document } from "langchain/document";

//2 Initialize GoogleVertexAIMultimodalEmbeddings
const embeddings = new GoogleVertexAIMultimodalEmbeddings();

//3 Define path for vector store
const vectorStorePath = "vector_store";

//4 Function to clear a directory
const clearDirectory = (directoryPath) => {
  fs.readdirSync(directoryPath).forEach((file) => {
    const filePath = path.join(directoryPath, file);
    fs.unlinkSync(filePath);
  });
};

//5 Function to add image and its embeddings to the vector store
const addImage = async (path, id) => {
  const img = fs.readFileSync(path);
  const vectors = await embeddings.embedImageQuery(img);
  const document = new Document({
    pageContent: img.toString("base64"),
    metadata: { id: id, mediaType: "image", path: path },
  });
  await vectorStore.addVectors([vectors], [document]);
  console.log(`Image ${path} added.`);
};

//6 Function to add text and its embeddings to the vector store
const addText = async (text, id) => {
  const vectors = await embeddings.embedQuery(text);
  const document = new Document({
    pageContent: text,
    metadata: { id: id, mediaType: "text" },
  });
  await vectorStore.addVectors([vectors], [document]);
  console.log(`Text "${text}" added.`);
};

//7 Function to perform image similarity search
const imageSimilaritySearch = async (path, results) => {
  clearDirectory("output");
  console.log("Performing image similarity search.");
  const imageQuery = fs.readFileSync(path);
  const imageVectors = await embeddings.embedImageQuery(imageQuery);
  const imageResult = await vectorStore.similaritySearchVectorWithScore(
    imageVectors,
    results
  );
  console.log(`Similarity search results for image query: "${path}`);
  printResults(imageResult);
};

//8 Function to perform text similarity search
const textSimilaritySearch = async (text, results) => {
  clearDirectory("output");
  console.log("Performing text similarity search.");
  const textVectors = await embeddings.embedQuery(text);
  const textResult = await vectorStore.similaritySearchVectorWithScore(
    textVectors,
    results
  );
  console.log(`Similarity search results for text query: ${text}`);
  printResults(textResult);
};

//9 Function to print similarity search results
const printResults = (results) => {
  results.forEach((item) => {
    const metadata = JSON.stringify(item[0].metadata);
    const score = item[1];
    console.log(`Metadata: ${metadata}, Score: ${score}`);
    if (item[0].metadata.mediaType === "text") {
      console.log(`Text: ${item[0].pageContent}`);
    } else if (item[0].metadata.mediaType === "image") {
      let filename = item[0].metadata.path.split("/").pop();
      fs.writeFileSync(
        `output/${filename}`,
        item[0].pageContent,
        "base64"
      );
    }
  });
};

//10 Initialize vector store
let vectorStore = fs.existsSync(vectorStorePath)
  ? await FaissStore.load(vectorStorePath)
  : new FaissStore(embeddings, {});

//11 Function to add items to the vector store
const addItemsToVectorStore = async () => {
  if (!fs.existsSync(vectorStorePath)) {
    const images = [
      "images/dog.jpeg",
      "images/cat.jpg",
      "images/parrot.jpg",
      "images/iphone.jpeg",
      "images/steve.jpeg",
      "images/airpod.jpeg",
    ];
    const texts = [
      "Dogs are domesticated mammals.",
      "Apple Inc. is an American multinational technology company.",
      "Steve Jobs was the chairman, chief executive officer, and co-founder of Apple Inc.",
    ];

    let imageId = 0;
    for (let i = 0; i < images.length; i++, imageId++)
      await addImage(images[i], imageId);

    let textId = images.length;
    for (let i = 0; i < texts.length; i++, textId++)
      await addText(texts[i], textId);
  }
};

//12 Add items to the vector store
await addItemsToVectorStore();

//13 Perform similarity searches
await imageSimilaritySearch('images/dog2.jpeg', 1);
await imageSimilaritySearch('images/steve2.jpg', 3);
await imageSimilaritySearch('images/apple-store.png', 3);
await textSimilaritySearch('Dogs', 3);
await textSimilaritySearch('Apple Inc', 3);
await textSimilaritySearch('Steve Jobs', 3);

//14 Save the state of the vector store
await vectorStore.save(vectorStorePath);
