import { DEFAULT_PROMPT } from './prompts';

const OLLAMA_URL = 'http://localhost:11434/api/generate';
const MODEL_NAME = 'llama4:scout';

export async function handleQuery(query: string): Promise<string> {
  console.log(`[orchestrator] Received query: ${query}`);

  const requestBody = {
    model: MODEL_NAME,
    prompt: `${DEFAULT_PROMPT}\n\nUser query: ${query}`,
    stream: false,
    format: 'json'
  };

  console.log(`[orchestrator] Request URL: ${OLLAMA_URL}`);

  try {
    const response = await fetch(OLLAMA_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    });

    console.log(`[orchestrator] Response status: ${response.status}`);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[orchestrator] Error response body: ${errorText}`);
      throw new Error(`Ollama API error: ${response.statusText}`);
    }

    const data = await response.json();
    const llmResponse = JSON.parse(data.response);
    const result = llmResponse.result;

    console.log(`[orchestrator] Ollama response: ${result}`);
    return result;
  } catch (error) {
    console.error(`[orchestrator] Error handling query:`, error);
    throw error;
  }
}