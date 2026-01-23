// pages/api/logs/index.js
import WebSocket from 'ws';

let clients = new Set();

export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Для WebSocket соединений
  if (req.headers.upgrade === 'websocket') {
    handleWebSocket(req, res);
    return;
  }

  res.status(400).json({ error: 'Expected WebSocket connection' });
}

function handleWebSocket(req, res) {
  const wss = new WebSocket.Server({ noServer: true });
  
  wss.on('connection', (ws) => {
    console.log('Новое клиентское подключение');
    clients.add(ws);

    // Отправляем историю логов (если есть)
    // sendLogHistory(ws);

    ws.on('close', () => {
      console.log('Клиент отключился');
      clients.delete(ws);
    });

    ws.on('error', (error) => {
      console.error('WebSocket ошибка:', error);
    });
  });

  wss.handleUpgrade(req, req.socket, Buffer.alloc(0), (ws) => {
    wss.emit('connection', ws, req);
  });
}

// Функция для трансляции логов всем клиентам
export function broadcastLog(log) {
  const message = JSON.stringify(log);
  clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}

// В вашем loader'e добавьте это:
// import { broadcastLog } from '../../pages/api/logs';