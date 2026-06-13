const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;

const routes = {
    "/": "index.html",
    "/about": "about.html",
    "/contact": "contact.html"
};

const mimeTypes = {
    '.html': 'text/html; charset=utf-8',
    '.css':  'text/css',
    '.js':   'application/javascript',
    '.json': 'application/json',
    '.png':  'image/png',
    '.ico':  'image/x-icon',
    '.webp': 'image/webp',
    '.svg':  'image/svg+xml',
}; 

const server = http.createServer((req, res) => {

if (req.method === 'POST' && req.url === '/log-error') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
        try {
            const { message, source, line, col, time } = JSON.parse(body);
            const entry = `[${time}] ${message} | ${source}:${line}:${col}\n`;
            fs.appendFileSync(path.join(__dirname, 'errors.log'), entry);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ ok: true }));
        } catch (e) {
            res.writeHead(400);
            res.end();
        }
    });
    return;
}

    const fileName = routes[req.url];
    if (fileName) {
        const filePath = path.join(__dirname, fileName);
        fs.readFile(filePath, (err, data) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/html; charset=utf-8' });
                res.end('<h1>500 - Błąd serwera</h1>');
                return;
            }
            res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
            res.end(data);
        });
        return;
    }

    const ext = path.extname(req.url);
    const mime = mimeTypes[ext];
    if (mime) {
        const filePath = path.join(__dirname, req.url);
        fs.readFile(filePath, (err, data) => {
            if (err) {
                res.writeHead(404);
                res.end();
                return;
            }
            res.writeHead(200, { 'Content-Type': mime });
            res.end(data);
        });
        return;
    }

    res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end('<h1>404 - Nie znaleziono strony</h1>');
});

server.listen(PORT, () => {
    console.log(`Serwer działa : http://localhost:${PORT}`);
});


