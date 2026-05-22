import { WebSocketServer, WebSocket } from 'ws';

const wss = new WebSocketServer({ port: 8080 });
const clients = new Set<WebSocket>();

wss.on('connection', (ws: WebSocket) => {
    clients.add(ws);
    console.log(`New client joined. Active clients: ${clients.size}`);

    ws.on('message', (message: string) => {
        try {
            const parsedData = JSON.parse(message.toString());
            clients.forEach((client) => {
                if (client !== ws && client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify(parsedData));
                }
            });
        } catch (error) {
            console.error('Failed to parse incoming data:', error);
        }
    });

    ws.on('close', () => {
        clients.delete(ws);
        console.log(`Someone left. Active clients: ${clients.size}`);
    });
});

console.log('WebSocket server running on ws://localhost:8080');