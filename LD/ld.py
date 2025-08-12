import os
import base64
import requests
import gradio as gr
from dotenv import load_dotenv

load_dotenv()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if not GEMINI_API_KEY:
    raise EnvironmentError("Please set GEMINI_API_KEY in your .env file.")

GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent"

custom_css = """
.gradio-container {
    background: #1e1e1e;
    font-family: 'Google Sans', 'Roboto', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    color: #e8eaed;
}

.gradio-h1 {
    color: #a8c7fa;
    text-align: center;
    padding-top: 20px;
    padding-bottom: 10px;
    transition: transform 0.3s ease;
    font-size: 2.5rem;
}

.gradio-h1:hover {
    transform: scale(1.0);
}

#main-block {
    border-radius: 12px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.4);
    background: #2e2f33;
    padding: 20px;
    transition: box-shadow 0.3s ease;
}

#main-block:hover {
    box-shadow: 0 0 15px rgba(168, 199, 250, 0.2), 0 4px 6px rgba(0, 0, 0, 0.4);
}

#image-input-container {
    border: 2px dashed #4a4a4a;
    border-radius: 8px;
    padding: 15px;
    margin-bottom: 20px;
    text-align: center;
    transition: all 0.3s ease;
}

#image-input-container:hover {
    border-color: #a8c7fa;
    box-shadow: 0 2px 4px rgba(168, 199, 250, 0.2);
}

#submit-button {
    background-color: #1a73e8;
    color: white;
    font-weight: bold;
    padding: 12px 24px;
    border-radius: 9999px;
    border: none;
    cursor: pointer;
    transition: background-color 0.3s ease, transform 0.1s ease;
}

#submit-button:hover {
    background-color: #4285f4;
}

#submit-button:active {
    transform: scale(0.98);
}

#name-output-area, #desc-output-area {
    min-height: 50px;
    border: 1px solid #4a4a4a;
    border-radius: 8px;
    padding: 15px;
    background: #1e1e1e;
    color: #e8eaed;
    line-height: 1.6;
    transition: box-shadow 0.3s ease, border-color 0.3s ease;
}

#name-output-area:hover, #desc-output-area:hover {
    border-color: #a8c7fa;
    box-shadow: 0 0 5px rgba(168, 199, 250, 0.2);
}

@media (max-width: 768px) {
    .gradio-h1 {
        font-size: 2.5rem;
    }
    #main-block {
        padding: 10px;
    }
}
"""

def identify_lab_equipment(image_path):
    if image_path is None:
        return "No image uploaded.", ""

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

    lines = text_output.split("\n")
    name = ""
    description = ""
    for line in lines:
        if line.lower().startswith("name:"):
            name = line[5:].strip()
        elif line.lower().startswith("description:"):
            description = line[12:].strip()

    return name or "Unknown", description or text_output

with gr.Blocks(css=custom_css, theme=gr.themes.Base()) as demo:
    gr.Markdown("## 🧪 Lab Equipment Detector", elem_classes=["gradio-h1"])
    
    with gr.Column(elem_id="main-block"):
        with gr.Row():
            image_input = gr.Image(type="filepath", label="Upload an image of lab equipment", elem_id="image-input-container")
        
        with gr.Row():
            name_output = gr.Textbox(label="Equipment Name", elem_id="name-output-area")
        
        with gr.Row():
            desc_output = gr.Textbox(label="Description", lines=3, elem_id="desc-output-area")
        
        submit_btn = gr.Button("Identify", elem_id="submit-button")

        submit_btn.click(
            identify_lab_equipment,
            inputs=image_input,
            outputs=[name_output, desc_output]
        )

if __name__ == "__main__":
    demo.launch()
