const http = require('http');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const port = Number(process.env.PORT || 8080);
const contentTypes = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp'
};

function send(res, status, body, type) {
  res.writeHead(status, { 'Content-Type': type || 'text/plain; charset=utf-8' });
  res.end(body);
}

http.createServer((req, res) => {
  let requestPath = decodeURIComponent((req.url || '/').split('?')[0]);
  if (requestPath === '/' || requestPath.endsWith('/')) requestPath += 'index.html';
  const filePath = path.resolve(root, requestPath.slice(1));
  if (!filePath.startsWith(root)) return send(res, 403, 'Forbidden');
  fs.readFile(filePath, (error, content) => {
    if (error) return send(res, 404, 'Not found');
    send(res, 200, content, contentTypes[path.extname(filePath).toLowerCase()] || 'application/octet-stream');
  });
}).listen(port, '127.0.0.1', () => {
  console.log(`网页试玩地址：http://127.0.0.1:${port}/web/`);
});

