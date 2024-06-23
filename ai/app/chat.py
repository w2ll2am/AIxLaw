import base64
import vertexai
from vertexai.generative_models import GenerativeModel, Part, FinishReason
import vertexai.preview.generative_models as generative_models

import json


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
        self.current_entities = None
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
        self.current_entities = None

        if file_uri is not None:
            self._current_document = self.uri_to_document()
        else:
            self._current_document = None
        
        return self.current_uri

    def get_current_uri(self):
        return self.current_uri

    def extract_entities(self):
        response = self.entity_model.generate_content(
            [self._current_document, self.entity_instructions],
            generation_config=self.generation_config,
            safety_settings=self.safety_settings,
        )
        self.current_entities = str(response)
        dictionary = json.loads(response.text[7:-3])
        return dictionary
    

    def chat(self, message):

        self.message_history.append(f"User: {message}")
        constructor = f"""
            <EXTRACTED DATA>
                {self.current_entities}
            </EXTRACTED DATA>

            <CHAT HISTORY>
                {"\n\n".join(self.message_history)}
            </CHAT HISTORY>
        """

        response = self.model.generate_content(
            [self._current_document, constructor],
            generation_config=self.generation_config,
            safety_settings=self.safety_settings,
        )

        print(response)
        
        self.message_history.append(f"Gemini-Flash: {response.text}")
        print(self.message_history)
        return response.text

if __name__ == "__main__":
    # document1 = Part.from_uri(
    #     mime_type="application/pdf",
    #     # uri="gs://cloud-samples-data/generative-ai/pdf/earnings_statement.pdf"
    #     # uri = "gs://aixlaw/dash sample.pdf"
    #     uri = "gs://aixlaw/o/0c2e2cb0-8f44-420b-8b21-042fb2c67011"
    # )

    # text1 = """You are a chatbot. follow these instructions"""

    # chat = Chat()
    # chat.set_current_uri("gs://aixlaw/o/6e7a268f-4864-4660-961e-2a8ed61aa41e")
    # entities = chat.extract_entities()

    to = "```json\n{\n    \"tenancy_details\": {\n        \"is_assured_shorthold_tenancy\": \"True\",\n        \"commencement_date\": \"1st September 2021\",\n        \"rent_amount\": \"450\",\n        \"rent_payment_date\": \"1st July 2021\",\n        \"rent_payment_quantum\": \"11,250\",\n        \"deposit_amount\": \"2,250\",\n        \"fixed_term_duration\": \"50\",\n        \"is_pets_allowed\": \"False\",\n        \"is_pets_allowed_with_landlord_consent\": \"True\",\n        \"is_assignment_or_sublet_allowed\": \"False\",\n        \"is_assignment_or_sublet_allowed_with_landlord_permission\": \"True\",\n        \"responsibilities\": {\n            \"is_landlord_responsible_for_council_tax\": \"False\",\n            \"is_landlord_responsible_for_gas\": \"False\",\n            \"is_landlord_responsible_for_water\": \"False\",\n            \"is_landlord_responsible_for_electricity\": \"False\",\n            \"is_landlord_responsible_for_internet\": \"True\",\n            \"is_landlord_responsible_for_telephone\": \"False\",\n            \"is_landlord_responsible_for_tv_licence\": \"False\"\n        },\n        \"termination_grounds\": \"the Rent or any part of it is in arrears, whether formally demanded or not, or\\nthe Tenant is in breach of any of the obligations under this agreement, or\\nany of the grounds of Schedule 2 of the Housing Act 1988 apply (these grounds allow the Landlord to seek possession of the Property in specified circumstances, including rent arrears, damage to the Property, nuisance and breach of a condition of the tenancy agreement), or\\na notice is served under section 21 of the Housing Act 1988 (section 21 gives the Landlord a right to end an assured shorthold tenancy without any specific reason, though only after any fixed term has ended, or in operation of a break clause).\",\n        \"landlord_access_notice_period\": \"24\",\n        \"landlord_access_rights\": \"to view the state and condition (on a monthly basis) and to execute repairs and other works upon the Property or other properties, or\\nto show prospective purchasers the Property at all times during the Term and to erect a board to indicate that the Property is for sale, or\\nto show prospective tenants the Property, during the last month of the Term and to erect a board to indicate that the Property is to let.\"\n    }\n}\n```"
    json.loads(to)