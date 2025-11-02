type action = 'answer_directly' | 'route_to_prompt' | 'custom_prompt' | 'incoming_query';

export interface IncomingQuery {
  action: 'incoming_query';
  query: string;
  prompt?: string;
}

export interface LLMQuery {
  action: action;
  model: string;
  prompt: string;
  query: string;
}

export type LLMQueryResponse = | {
  action: 'answer_directly';
  result: string;
  model: string;
  reasoning: string;
} | {
  action: 'route_to_prompt';
  prompt_name: string;
  model: string;
  reasoning: string;
} | {
  action: 'custom_prompt';
  custom_prompt: string;
  model: string;
  reasoning: string;
};
