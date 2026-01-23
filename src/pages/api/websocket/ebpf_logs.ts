import { WebSocketServer } from 'ws';
import { spawn } from 'child_process';
import { createServer, IncomingMessage, ServerResponse } from 'http';
import { parse } from 'url';
import { client } from 'stompjs';
import { timeStamp } from 'console';

const clients = new Set();

export default function handler(req: IncomingMessage, res: ServerResponse) {
    if (req.method != 'GET') {
        res.statusCode = 405;
        res.end("Method Not Allowed (Allowed Only GET)");
    } else {
        res.statusCode = 200;
        res.end("Succesfully (200)");
    }

    res.setHeader("Upgrade", "Websocket");
    res.setHeader("Connection", "Upgrade");
    /*
    The HTTP 426 Upgrade Required status code is a relatively uncommon error, but it plays a crucial role in ensuring the web's evolving standards and protocols are upheld. 
    This error signifies that the requested resource can only be accessed using a different protocol, often a newer or more secure one
    */
    res.statusCode = 426;
    res.end("HTTP 426 Upgrade Required");
}

const server = createServer();
const wss = new WebSocketServer({ noServer: true });

wss.on("connection", (ws: any) => {
    console.log('New WebSocket client connected');
    clients.add(ws);

    ws.on('close', () => {
        console.log('WebSocket client disconnected');
        clients.delete(ws);
    });

    ws.on('error', (error: number) => {
        console.error('WebSocket error:', error);
    });

    /*
    JSON.stringify() is a built-in method in JavaScript used to convert a JavaScript value (usually an object or an array) into a JSON-formatted string. 
    This process is known as serialization or "stringifying". 
    */
    ws.send(JSON.stringify({
        type: "system",
        message: "Connected to eBPF logs WebSocket",
        timestamp: Date.now()
    }));
});

server.on("upgrade", (request: any, socket: any, head: any) => {
    // WARNING
    const { pathname } = parse(request.url);

    if (pathname === "api/websocket/ebpf-logs") {
        wss.handleUpgrade(request, socket, head, (ws: any) => {
            wss.emit("connection", ws, request);
        })
    } else {
        socket.destroy();
    }
});

function startEBPFLoader() {
    const loader = spawn("sudo", ["./loader"], {
        // current working directory
        cwd: "/path/to",
        stdio: ["pipe", "pipe", "pipe"]
    });

    loader.stdout.on('data', (data) => {
        const lines = data.toString.split("\n");
        lines.forEach((line: any) => {
            if (line.trim()) {
                const logEntry = parseEBPFLog(line);
                if (logEntry) {
                    clients.forEach((client: any) => {
                        if (client.readyState === 1) { // OPEN
                            client.send(JSON.stringify(logEntry));
                        }
                    });
                }
            }
        })
    });

    loader.stderr.on('data', (data) => {
        console.error('eBPF loader error:', data.toString());
    });
  
    loader.on('close', (code) => {
        console.log(`eBPF loader exited with code ${code}`);
        // Перезапускаем через 5 секунд
        setTimeout(startEBPFLoader, 5000);
    });
}

function parseEBPFLog(line: any) {
  // Пример: [1426672787799] PID: 830 (dbus-daemon) FD: 280 Type: ACCEPT Size: 0 Port: 47190
  const regex = /\[(\d+)\] PID: (\d+) \(([^)]+)\) FD: (\d+) Type: (\w+) Size: (\d+) Port: (\d+)/;
  const match = line.match(regex);
  
  if (match) {
    return {
      type: 'ebpf_event',
      timestamp: parseInt(match[1]),
      pid: parseInt(match[2]),
      process: match[3],
      fd: parseInt(match[4]),
      eventType: match[5],
      size: parseInt(match[6]),
      port: parseInt(match[7]),
      raw: line,
      time: new Date().toISOString()
    };
  }
  
  if (line.includes('Connected') || line.includes('Starting')) {
    return {
      type: 'system',
      message: line,
      timestamp: Date.now()
    };
  }
  
  return null;
}

const PORT = process.env.WS_PORT || 3001;
server.listen(PORT, () => {
  console.log(`WebSocket server running on port ${PORT}`);
  startEBPFLoader();
});