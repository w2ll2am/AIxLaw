from fastapi import FastAPI, File, UploadFile
from fastapi.responses import RedirectResponse
from langserve import add_routes
import uuid

from app.upload import StorageManager

app = FastAPI()
storage = StorageManager()

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
        
    except Exception as e:
        return {"message": f"There was an error uploading the file: {str(e)}"}
    finally:
        file.file.close()

    return {
        "message": f"Successfully uploaded {file.filename}",
        "uri": uri
    }


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

    uvicorn.run(app, host="0.0.0.0", port=8000)
