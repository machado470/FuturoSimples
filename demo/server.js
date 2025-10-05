const http = require('http');
const fs = require('fs');
const path = require('path');

const { runSimulations } = require('./simulationEngine');

const publicDir = path.join(__dirname, 'public');

function getContentType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  switch (ext) {
    case '.html':
      return 'text/html';
    case '.js':
      return 'application/javascript';
    case '.css':
      return 'text/css';
    case '.json':
      return 'application/json';
    case '.png':
      return 'image/png';
    case '.jpg':
    case '.jpeg':
      return 'image/jpeg';
    default:
      return 'application/octet-stream';
  }
}

const server = http.createServer((req, res) => {
  // API endpoint for running simulations
  if (req.method === 'POST' && req.url === '/api/simulation/run') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        const data = JSON.parse(body);
        const results = runSimulations(data);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(results));
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid JSON' }));
      }
    });
    return;
  }

  // Serve static files from public directory
  const sanitizedPath = path.normalize(req.url).replace(/^([\.]+[\/])+/, '');
  let filePath = path.join(publicDir, sanitizedPath);

  // Default to index.html for root or directory access
  if (!req.url || req.url === '/' || filePath === publicDir) {
    filePath = path.join(publicDir, 'index.html');
  }

  fs.readFile(filePath, (err, content) => {
    if (err) {
      // On any read error, fallback to index.html
      fs.readFile(path.join(publicDir, 'index.html'), (err2, content2) => {
        if (err2) {
          res.writeHead(500);
          res.end('Server error');
        } else {
          res.writeHead(200, { 'Content-Type': 'text/html' });
          res.end(content2);
        }
      });
    } else {
      res.writeHead(200, { 'Content-Type': getContentType(filePath) });
      res.end(content);
    }
  });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
