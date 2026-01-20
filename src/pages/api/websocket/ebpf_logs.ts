import { WebSocketServer } from 'ws';
import { spawn } from 'child_process';
import { createServer, IncomingMessage, ServerResponse } from 'http';
import { parse } from 'url';

const clients = new Set();

export default function handler(req: IncomingMessage, res: ServerResponse) {
    if (req.method != 'GET') {
        res.statusCode = 405;
        res.end("Method Not Allowed (Allowed Only GET)");
    } else {
        res.statusCode = 200;
        res.end("Succesfully (200)")
    }

    res.setHeader('Upgrade', 'Websocket');
    res.setHeader('Connection', 'Upgrade');
    
}