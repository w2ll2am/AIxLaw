import base64
import vertexai
from vertexai.generative_models import GenerativeModel, Part, FinishReason
import vertexai.preview.generative_models as generative_models

class Chat:
    generation_config = {
        "max_output_tokens": 8192,
        "temperature": 1,
        "top_p": 0.95,
    }

    safety_settings = {
        generative_models.HarmCategory.HARM_CATEGORY_HATE_SPEECH: generative_models.HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        generative_models.HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT: generative_models.HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        generative_models.HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT: generative_models.HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        generative_models.HarmCategory.HARM_CATEGORY_HARASSMENT: generative_models.HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    }

    def __init__(self):
        self.context = """"""
        vertexai.init(project="cambridge-law24cam-7868", location="europe-west2")
        
        # For chat
        with open("prompts/system_instructions.txt","r") as f:
            self.system_instructions = f.read()

        self.model = GenerativeModel(
            "gemini-1.5-flash-001",
            system_instruction=self.system_instructions
        )

        # For entity extraction
        with open("prompts/entity_instructions.txt","r") as f:
            self.entity_instructions = f.read()

        self.entity_model = GenerativeModel(
            "gemini-1.5-flash-001"
        )

        self.current_uri = None
        self._current_document = None
        self.message_history = []

    def uri_to_document(self):
        document = Part.from_uri(
            mime_type="application/pdf",
            uri = self.current_uri
        )
        return document

    def set_current_uri(self, file_uri):
        self.current_uri = file_uri
        self.message_history = []

        self._current_document = self.uri_to_document()
        
        return self.current_uri

    def get_current_uri(self):
        return self.current_uri

    def extract_entities(self):
        response = self.entity_model.generate_content(
            [self._current_document, self.entity_instructions],
            generation_config=self.generation_config,
            safety_settings=self.safety_settings,
        )
        
        return response
    

    def chat(message):

        return 

if __name__ == "__main__":
    document1 = Part.from_uri(
        mime_type="application/pdf",
        # uri="gs://cloud-samples-data/generative-ai/pdf/earnings_statement.pdf"
        # uri = "gs://aixlaw/dash sample.pdf"
        uri = "gs://aixlaw/o/0c2e2cb0-8f44-420b-8b21-042fb2c67011"
    )

    text1 = """You are a chatbot. follow these instructions"""

    chat = Chat()
    chat.set_current_uri("gs://aixlaw/o/6e7a268f-4864-4660-961e-2a8ed61aa41e")
    entities = chat.extract_entities()

