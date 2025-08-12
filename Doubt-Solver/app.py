import gradio as gr
from core.gemini_vision import (
    process_math_image,
    process_science_input,
    process_english_essay,
    evaluate_test_pdf
)

def handle_math_image(file_path):
    detailed, one_liner = process_math_image(file_path)
    return detailed, f"<div class='one-liner-box'>{one_liner}</div>"

def handle_science_input(question, image_path):
    detailed, one_liner = process_science_input(question, image_path)
    return detailed, f"<div class='one-liner-box'>{one_liner}</div>"

def handle_english_essay(essay_text):
    detailed, one_liner = process_english_essay(essay_text)
    return detailed, f"<div class='one-liner-box'>{one_liner}</div>"

def handle_test_pdf(file_path):
    detailed, one_liner = evaluate_test_pdf(file_path)
    return detailed, f"<div class='one-liner-box'>{one_liner}</div>"

with open("Doubt-Solver/styleapp.css", "r") as css_file:
    custom_css = css_file.read()

with gr.Blocks() as app:
    gr.HTML(f"""
       <style>
       {custom_css}
       </style>
    """)
    gr.Markdown("""
        # 📚 CurricuLens Academic Hub
        <div class="subtitle">
        Made with <span style="color: #ff4d4d;">❤️</span> by Atharva
        </div>
        """, elem_id="main-title")

    

    with gr.Tab("Math Solver"):
        math_image = gr.Image(label="Upload Math Problem Image", type="filepath")
        math_button = gr.Button("Solve")
        math_output = gr.Textbox(label="Detailed Solution")
        math_summary = gr.HTML()
        math_button.click(fn=handle_math_image, inputs=[math_image], outputs=[math_output, math_summary])

    with gr.Tab("Science Helper"):
        science_input = gr.Textbox(label="Enter Science Question", lines=3)
        science_image = gr.Image(label="Optional Image", type="filepath")
        science_button = gr.Button("Get Answer")
        science_output = gr.Textbox(label="Detailed Answer")
        science_summary = gr.HTML()
        science_button.click(fn=handle_science_input, inputs=[science_input, science_image], outputs=[science_output, science_summary])

    with gr.Tab("English Grammar Check"):
        essay_input = gr.Textbox(label="Type or Paste Essay Here", lines=10, interactive=True)
        essay_button = gr.Button("Check Grammar & Suggestions")
        essay_output = gr.Textbox(label="Detailed Feedback")
        essay_summary = gr.HTML()
        essay_button.click(fn=handle_english_essay, inputs=[essay_input], outputs=[essay_output, essay_summary])

    with gr.Tab("Test Evaluator"):
        test_pdf = gr.File(label="Upload Answer Sheet PDF", type="filepath", file_types=[".pdf"])
        test_button = gr.Button("Evaluate Test")
        test_output = gr.Textbox(label="Evaluation Details")
        test_summary = gr.HTML()
        test_button.click(fn=handle_test_pdf, inputs=[test_pdf], outputs=[test_output, test_summary])

app.launch(inline=False, inbrowser=True, max_threads=5)
