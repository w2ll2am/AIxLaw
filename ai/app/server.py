from typing import Annotated
from fastapi import FastAPI, File, Form, UploadFile, Request
from fastapi.responses import RedirectResponse
from fastapi.middleware.cors import CORSMiddleware
from langserve import add_routes
import uuid

from app.upload import StorageManager
from app.chat import Chat    

import traceback

app = FastAPI()
origins = ["*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

storage = StorageManager()
chat = Chat()

@app.get("/")
async def redirect_root_to_docs():
    return RedirectResponse("/docs")


@app.post("/upload")
def upload(file: UploadFile = File(...)):
    try:
        contents = file.file.read()
        with open(file.filename, 'wb') as f:
            f.write(contents)

        uuid_name = str(uuid.uuid4())
        uri = storage.upload_to_bucket(
            file.filename,
            uuid_name,
        )

        chat.set_current_uri(uri)
        entities = chat.extract_entities()
    
    except Exception as e:
        return {"message": f"There was an error uploading the file: {traceback.format_exc()}"}
    finally:
        file.file.close()

    return {
        "message": f"Successfully uploaded {file.filename}",
        "uri": uri,
        "entities": entities
    }


@app.post("/chat_message")
async def chat_message(message: Annotated[str, Form()]):

    response = chat.chat(message)
    return {
        "message": message,
        "response": response
    }

@app.get("/state")
def state():
    return chat.get_current_uri()

@app.get("/reset")
def reset():
    chat.set_current_uri(None)
    return "done"


# Edit this to add the chain you want to add
# from rag_google_cloud_vertexai_search.chain import chain as rag_google_cloud_vertexai_search_chain

# add_routes(app, rag_google_cloud_vertexai_search_chain, path="/rag-google-cloud-vertexai-search")

# import vertexai
# vertexai.init(project="cambridge-law24cam-7868", location=<LOCATION>)

# llm = VertexAI(
#     model_name="text-bison@001",
#     max_output_tokens=256,
#     temperature=0.1,
#     top_p=0.8,
#     top_k=40,
#     verbose=True,)

# embeddings = VertexAIEmbeddings()

if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="localhost", port=8000)
