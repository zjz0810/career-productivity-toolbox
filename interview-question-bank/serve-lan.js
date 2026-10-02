const http = require('http')
const fs = require('fs')
const path = require('path')

const port = Number(process.argv[2] || 8080)
const root = path.resolve(__dirname)
const types = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg'
}

function getFilePath(requestUrl) {
  let pathname = decodeURIComponent((requestUrl || '/').split('?')[0])
  if (pathname === '/') pathname = '/web/'
  let filePath = path.resolve(root, '.' + pathname)
  if (filePath !== root && !filePath.startsWith(root + path.sep)) return null
  if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) filePath = path.join(filePath, 'index.html')
  return filePath
}

http.createServer((request, response) => {
  const filePath = getFilePath(request.url)
  if (!filePath || !fs.existsSync(filePath)) {
    response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' })
    response.end('Not found')
    return
  }
  response.writeHead(200, { 'Content-Type': types[path.extname(filePath).toLowerCase()] || 'application/octet-stream' })
  response.end(fs.readFileSync(filePath))
}).listen(port, '0.0.0.0', () => {
  console.log('FOC学习题库浏览器版已启动，端口：' + port)
})
