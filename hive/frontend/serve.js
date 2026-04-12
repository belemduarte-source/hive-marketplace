const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 9091;
const ROOT = __dirname;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css':  'text/css',
  '.js':   'application/javascript',
  '.json': 'application/json',
  '.png':  'image/png',
  '.ico':  'image/x-icon',
  '.svg':  'image/svg+xml',
  '.woff2':'font/woff2',
};

http.createServer((req, res) => {
  let pathname = req.url.split('?')[0];
  if (pathname === '/') pathname = '/index.html';

  const filePath = path.join(ROOT, pathname);
  const ext = path.extname(filePath).toLowerCase();
  const mime = MIME[ext] || 'application/octet-stream';
  const isHtml = mime.startsWith('text/html');

  const target = fs.existsSync(filePath) ? filePath : path.join(ROOT, 'index.html');

  fs.readFile(target, (err, data) => {
    if (err) { res.writeHead(500); res.end('Error'); return; }
    const headers = { 'Content-Type': mime, 'Content-Length': data.length };
    if (isHtml) {
      headers['Cache-Control'] = 'no-store';
      headers['Clear-Site-Data'] = '"cache", "storage"';
    }
    res.writeHead(200, headers);
    res.end(data);
  });
}).listen(PORT, '127.0.0.1', () => {
  console.log(`Hive frontend on http://localhost:${PORT}`);
});
