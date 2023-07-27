# Multimodal Langchain

This repository includes a script that leverages the Langchain library and Google's Vertex AI to perform similarity searches. It allows for similarity searches based on images or text, storing the vectors and metadata in a Faiss vector store.

## Setup

To use this script, clone the repository and install the required dependencies via `npm install`.

## Run

The code first checks if a vector store already exists. If it does not, it initializes a new one and populates it with vectors from a set of predefined images and text. The vector store maintains a mapping from vectors to their corresponding media type (image or text) and other metadata. 

After initializing and populating the vector store, the script performs a series of similarity searches based on image and text queries. Results from the searches are printed in the console.

Finally, the state of the vector store is saved for future use.

## Dependencies

Ensure the following dependencies are installed:

- "faiss-node": "^0.2.2"
- "langchain": "^0.0.117"

Also, remember to set the "type" field to "module" in your package.json.

## Tags
\#Langchain \#VertexAI \#AI 

## Useful Links
- [Google Cloud Console](https://console.cloud.google.com/)
- [Google Model Garden](https://console.cloud.google.com/vertex-ai/publishers/google/model-garden/5)
- [Vertex AI](https://cloud.google.com/vertex-ai)
- [Google Cloud SDK](https://cloud.google.com/sdk/docs/install)
- [Langchain Docs](https://js.langchain.com/docs/modules/data_connection/experimental/multimodal_embeddings/google_vertex_ai)
