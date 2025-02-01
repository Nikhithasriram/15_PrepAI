# model_service.py
from transformers import AutoModelForCausalLM, AutoTokenizer
from flask import Flask, request, jsonify
import torch

app = Flask(__name__)

# Load model and tokenizer
model = None
tokenizer = None

def load_model():
    global model, tokenizer
    model = AutoModelForCausalLM.from_pretrained("deepseek-ai/DeepSeek-R1", trust_remote_code=True)
    tokenizer = AutoTokenizer.from_pretrained("deepseek-ai/DeepSeek-R1")
    model.eval()  # Set to evaluation mode

@app.route('/generate', methods=['POST'])
def generate_text():
    try:
        data = request.json
        prompt = data.get('prompt', '')
        max_length = data.get('max_length', 100)
        
        # Tokenize input
        inputs = tokenizer(prompt, return_tensors="pt")
        
        # Generate text
        with torch.no_grad():
            outputs = model.generate(
                inputs.input_ids,
                max_length=max_length,
                num_return_sequences=1,
                temperature=0.7,
                pad_token_id=tokenizer.eos_token_id
            )
        
        # Decode and return response
        generated_text = tokenizer.decode(outputs[0], skip_special_tokens=True)
        return jsonify({'generated_text': generated_text})
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    load_model()
    app.run(host='0.0.0.0', port=5000)

# requirements.txt
flask==2.0.1
torch==2.0.0
transformers==4.30.0