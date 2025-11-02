import { WebSocket, WebSocketServer } from 'ws';
import { handleQuery } from './orchestrator';
import { IncomingQuery } from './types/queryProtocol';

const PORT = 3141;

export function startWebSocketServer() {
  const wss = new WebSocketServer({ port: PORT });
  console.log(`[websocket] WebSocket server started on ws://localhost:${PORT}`);

  wss.on('connection', (ws: WebSocket) => {
    console.log('[websocket] New client connected');

    ws.on('message', async (data: string) => {
      try {
        const parsedMessage = JSON.parse(data.toString());
        console.log(`[websocket] Received message: ${parsedMessage}`);

        if (!parsedMessage.query) {
          ws.send(JSON.stringify({
            status: 'error',
            error: 'missing required field: query'
          }));
          return;
        }

        const incomingQuery: IncomingQuery = {
          action: 'incoming_query',
          query: parsedMessage.query,
          prompt: parsedMessage.prompt
        };

        const response = await handleQuery(incomingQuery);

        ws.send(JSON.stringify({
          status: 'success',
          data: response
        }));
      } catch (error) {
        console.error(`[websocket] Error processing message: ${error}`);
        ws.send(JSON.stringify({
          status: 'error',
          error: error instanceof Error ? error.message : 'Unknown error'
        }));
      }
    });

    ws.on('close', () => {
      console.log('[websocket] Client disconnected');
    });
  });
}
