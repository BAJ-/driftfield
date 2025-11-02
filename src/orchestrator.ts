import { PROMPT_MODEL_SELECTOR, PROMPTS } from './prompts';
import type { IncomingQuery, LLMQuery, LLMQueryResponse } from './types/queryProtocol';

const OLLAMA_URL = 'http://localhost:11434/api/generate';
const MODEL_NAME = 'llama4:scout';

export async function handleQuery(request: IncomingQuery): Promise<string> {
  console.log(`[orchestrator] Received query: ${request.query}`);

  const llmQuery: LLMQuery = {
    action: request.action,
    model: MODEL_NAME,
    prompt: request.prompt || PROMPT_MODEL_SELECTOR,
    query: request.query
  };
  console.log(`[orchestrator] Constructed LLM query: ${JSON.stringify(llmQuery)}`);

  return await callLLM(llmQuery);
}

async function callLLM(request: LLMQuery): Promise<string> {
  const requestBody = {
    model: request.model,
    prompt: `${request.prompt}\n\nUser query: ${request.query}`,
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
      throw new Error(`LLM request failed with status ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    console.log(`[orchestrator] Raw response data: ${JSON.stringify(data)}`);
    const responseData = JSON.parse(data.response) as LLMQueryResponse;
    console.log(`[orchestrator] LLM response data: ${JSON.stringify(responseData)}`);

    if (!responseData) {
      throw new Error('Invalid response from LLM');
    }

    if (responseData.action === 'answer_directly') {
      return responseData.result;
    } else {
      const prompt = responseData.action === 'route_to_prompt' ? PROMPTS.get(responseData.prompt_name) : responseData.custom_prompt;
      if (!prompt) {
        throw new Error(`Empty prompt error`);
      }

      const recQuery:LLMQuery = {
        action: responseData.action,
        model: responseData.model,
        prompt: prompt,
        query: request.query
      };
      return callLLM(recQuery);
    }
  } catch (error) {
    console.error(`[orchestrator] Error handling query:`, error);
    throw error;
  }
}
