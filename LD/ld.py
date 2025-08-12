import os
import base64
import requests
import gradio as gr
from dotenv import load_dotenv

# Load Gemini API key from .env
load_dotenv()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if not GEMINI_API_KEY:
    raise EnvironmentError("Please set GEMINI_API_KEY in your .env file.")

# Gemini Vision API endpoint
GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent"

# Function to call Gemini Vision API
def identify_lab_equipment(image_path):
    if image_path is None:
        return "No image uploaded.", ""

    # Convert image to base64
    with open(image_path, "rb") as f:
        image_base64 = base64.b64encode(f.read()).decode("utf-8")

    headers = {"Content-Type": "application/json"}
    payload = {
        "contents": [
            {
                "parts": [
                    {
                        "text": "Identify the laboratory equipment in this image and provide a short description of what it is used for. Format the output as:\nName: <name>\nDescription: <description>"
                    },
                    {
                        "inline_data": {
                            "mime_type": "image/jpeg",
                            "data": image_base64
                        }
                    }
                ]
            }
        ]
    }

    response = requests.post(
        f"{GEMINI_API_URL}?key={GEMINI_API_KEY}",
        headers=headers,
        json=payload
    )

    if response.status_code != 200:
        return f"Error: {response.status_code} - {response.text}", ""

    result = response.json()
    text_output = result["candidates"][0]["content"]["parts"][0]["text"]

    # Try to split into name + description
    lines = text_output.split("\n")
    name = ""
    description = ""
    for line in lines:
        if line.lower().startswith("name:"):
            name = line[5:].strip()
        elif line.lower().startswith("description:"):
            description = line[12:].strip()

    return name or "Unknown", description or text_output

# Gradio UI
with gr.Blocks() as demo:
    gr.Markdown("## 🧪 Lab Equipment Detector (Gemini Vision)")
    with gr.Row():
        image_input = gr.Image(type="filepath", label="Upload an image of lab equipment")
    with gr.Row():
        name_output = gr.Textbox(label="Equipment Name")
    with gr.Row():
        desc_output = gr.Textbox(label="Description", lines=3)
    submit_btn = gr.Button("Identify")

    submit_btn.click(
        identify_lab_equipment,
        inputs=image_input,
        outputs=[name_output, desc_output]
    )

if __name__ == "__main__":
    demo.launch(server_name="127.0.0.1", server_port=7861)
