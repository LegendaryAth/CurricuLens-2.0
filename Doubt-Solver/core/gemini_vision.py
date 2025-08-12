import os
import requests
from dotenv import load_dotenv
import base64

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1/models/gemini-2.5-pro:generateContent"
HEADERS = {
    "Content-Type": "application/json"
}

def extract_summary(full_text, keyword="Final Answer"):
    for line in full_text.split('\n'):
        if keyword.lower() in line.lower():
            return line.strip()
    return full_text.split('\n')[0]

def process_math_image(image_path):
    if not GEMINI_API_KEY:
        return "API Key missing.", "API Key missing."

    with open(image_path, "rb") as img_file:
        img_data = img_file.read()

    img_base64 = base64.b64encode(img_data).decode("utf-8")

    payload = {
        "contents": [
            {
                "parts": [
                    {
                        "inline_data": {
                            "mime_type": "image/png",
                            "data": img_base64
                        }
                    },
                    {
                        "text": "Solve the math problem in the image step-by-step and also provide a final answer in the format: 'Final Answer: <result>'"
                    }
                ]
            }
        ]
    }

    response = requests.post(GEMINI_API_URL, headers=HEADERS, params={"key": GEMINI_API_KEY}, json=payload)
    if response.status_code != 200:
        return f"Error: {response.status_code} - {response.text}", "Error"

    response_json = response.json()
    try:
        parts = response_json['candidates'][0]['content']['parts']
        full_solution = parts[0].get('text', 'No solution found.')
        summary = extract_summary(full_solution, keyword="Final Answer")
        return full_solution, summary
    except:
        return "Failed to parse Gemini response.", "Failed"

def process_science_input(question_text, image_path):
    if not GEMINI_API_KEY:
        return "API Key missing.", "API Key missing."

    parts = []
    if image_path:
        with open(image_path, "rb") as img_file:
            img_data = img_file.read()
        img_base64 = base64.b64encode(img_data).decode("utf-8")
        parts.append({
            "inline_data": {
                "mime_type": "image/png",
                "data": img_base64
            }
        })

    parts.append({
        "text": f"Answer the following science question in detail. Then summarize the answer in one line starting with 'Final Answer:':\n{question_text}"
    })

    payload = {
        "contents": [
            {
                "parts": parts
            }
        ]
    }

    response = requests.post(GEMINI_API_URL, headers=HEADERS, params={"key": GEMINI_API_KEY}, json=payload)
    if response.status_code != 200:
        return f"Error: {response.status_code} - {response.text}", "Error"

    response_json = response.json()
    try:
        parts = response_json['candidates'][0]['content']['parts']
        full_answer = parts[0].get('text', 'No answer found.')
        summary = extract_summary(full_answer, keyword="Final Answer")
        return full_answer, summary
    except:
        return "Failed to parse Gemini response.", "Failed"

def process_english_essay(essay_text):
    if not GEMINI_API_KEY:
        return "API Key missing.", "API Key missing."

    payload = {
        "contents": [
            {
                "parts": [
                    {
                        "text": f"Check grammar, spelling, and suggest improvements for this essay. Provide detailed feedback and at the end, summarize it in one line starting with 'Final Summary:'.\n\n{essay_text}"
                    }
                ]
            }
        ]
    }

    response = requests.post(GEMINI_API_URL, headers=HEADERS, params={"key": GEMINI_API_KEY}, json=payload)
    if response.status_code != 200:
        return f"Error: {response.status_code} - {response.text}", "Error"

    response_json = response.json()
    try:
        parts = response_json['candidates'][0]['content']['parts']
        feedback = parts[0].get('text', 'No suggestions found.')
        summary = extract_summary(feedback, keyword="Final Summary")
        return feedback, summary
    except:
        return "Failed to parse Gemini response.", "Failed"

def evaluate_test_pdf(pdf_path):
    if not GEMINI_API_KEY:
        return "API Key missing.", "API Key missing."

    with open(pdf_path, "rb") as pdf_file:
        pdf_data = pdf_file.read()

    pdf_base64 = base64.b64encode(pdf_data).decode("utf-8")

    payload = {
        "contents": [
            {
                "parts": [
                    {
                        "inline_data": {
                            "mime_type": "application/pdf",
                            "data": pdf_base64
                        }
                    },
                    {
                        "text": "Evaluate the answers in this PDF and provide detailed feedback. At the end, give a one-line summary with final score starting with 'Final Score:'."
                    }
                ]
            }
        ]
    }

    response = requests.post(GEMINI_API_URL, headers=HEADERS, params={"key": GEMINI_API_KEY}, json=payload)
    if response.status_code != 200:
        return f"Error: {response.status_code} - {response.text}", "Error"

    response_json = response.json()
    try:
        parts = response_json['candidates'][0]['content']['parts']
        evaluation = parts[0].get('text', 'No evaluation found.')
        summary = extract_summary(evaluation, keyword="Final Score")
        return evaluation, summary
    except:
        return "Failed to parse Gemini response.", "Failed"
