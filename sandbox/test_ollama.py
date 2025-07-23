#!/usr/bin/env python3

import requests

def test_ollama():
    url = "http://localhost:11434/api/generate"
    payload = {
        "model": "mistral",
        "prompt": "Say 'working'",
        "stream": False
    }
    
    print("Testing Ollama/Mistral...")
    
    response = requests.post(url, json=payload, timeout=30)
    result = response.json()
    ai_response = result.get('response', '').strip()
    
    print(f"Response: {ai_response}")

if __name__ == "__main__":
    test_ollama()
