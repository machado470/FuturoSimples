const http = require('http');
const fs = require('fs');
const path = require('path');
const { runSimulations } = require('./simulationEngine');

const publicDir = path.join(__dirname, 'public');

function getContentType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  switch (ext) {
    case '.html': return 'text/html';
    case '.js': return 'application/javascript';
    case '.css': return 'text/css';
    case '.json': return 'application/json';
    case '.png': return 'image/png';
    case '.jpg':
    case '.jpeg': return 'image/jpeg';
    default: return 'application/octet-stream';
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
        const input = JSON.parse(body || '{}');
        // Map simplified fields from front-end to engine-specific fields
        const mapped = {
          renda_base: Number(input.renda || input.renda_base) || 0,
          renda_variavel: Number(input.renda_variavel) || 0,
          crescimento_renda_anual: Number(input.crescimento_renda_anual) || 0,
          gastos_fixos: Number(input.gastos || input.gastos_fixos) || 0,
          gastos_variaveis: Number(input.gastos_variaveis) || 0,
          saldo_investido: Number(input.saldo_investido) || 0,
          aporte_mensal: Number(input.aporte_mensal) || 0,
          perfil: input.perfil || 'moderado',
          dividas: (input.debts || input.dividas || []).map(d => ({
            saldo: Number(d.saldo),
            taxa: Number(d.taxa),
            parcela: Number(d.parcela),
            tipo: d.tipo || 'divida'
          }))
        };
        const results = runSimulations(mapped);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(results));
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid JSON' }));
      }
    });
    return;
  }

  // Serve static files
  const sanitizedPath = path.normalize(req.url).replace(/^([\\.]+[\\/])+/, '');
  let filePath = path.join(publicDir, sanitizedPath);
  if (!req.url || req.url === '/' || filePath === publicDir) {
    filePath = path.join(publicDir, 'index.html');
  }
  fs.readFile(filePath, (err, content) => {
    if (err) {
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
