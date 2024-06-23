import base64
import vertexai
from vertexai.generative_models import GenerativeModel, Part, FinishReason
import vertexai.preview.generative_models as generative_models

textsi_1 = "As an expert in document entity extraction, you parse documents to identify and organize specific entities from diverse sources into structured formats, following detailed guidelines for clarity and completeness."

def generate(document, text):
  vertexai.init(project="cambridge-law24cam-7868", location="europe-west2")
  model = GenerativeModel(
    "gemini-1.5-flash-001",
    system_instruction=[textsi_1]
  )
  responses = model.generate_content(
      [document, text],
      generation_config=generation_config,
      safety_settings=safety_settings,
      stream=True,
  )

  for response in responses:
    print(response.text, end="")

document1 = Part.from_uri(
    mime_type="application/pdf",
    # uri="gs://cloud-samples-data/generative-ai/pdf/earnings_statement.pdf"
    uri = "gs://aixlaw/dash sample.pdf"
)

text1 = """You are a document entity extraction specialist. Given a document, your task is to extract the text value of the following entities:
{
 \"earning_item\": [
  {
   \"earning_rate\": \"\",
   \"earning_hours\": \"\",
   \"earning_type\": \"\",
   \"earning_this_period\": \"\"
  }
 ],
 \"direct_deposit_item\": [
  {
   \"direct_deposit\": \"\",
   \"employee_account_number\": \"\"
  }
 ],
 \"current_deduction\": \"\",
 \"ytd_deduction\": \"\",
 \"employee_id\": \"\",
 \"employee_name\": \"\",
 \"employer_name\": \"\",
 \"employer_address\": \"\",
 \"federal_additional_tax\": \"\",
 \"federal_allowance\": \"\",
 \"federal_marital_status\": \"\",
 \"gross_earnings\": \"\",
 \"gross_earnings_ytd\": \"\",
 \"net_pay\": \"\",
 \"net_pay_ytd\": \"\",
 \"ssn\": \"\",
 \"pay_date\": \"\",
 \"pay_period_end\": \"\",
 \"pay_period_start\": \"\",
 \"state_additional_tax\": \"\",
 \"state_allowance\": \"\",
 \"state_marital_status\": \"\",
 \"tax_item\": [
  {
   \"tax_this_period\": \"\",
   \"tax_type\": \"\",
   \"tax_ytd\": \"\"
  }
 ]
}

- The JSON schema must be followed during the extraction.
- The values must only include text strings found in the document.
- Generate null for missing entities."""

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

generate(document=document1, text=text1)

