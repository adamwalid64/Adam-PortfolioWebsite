const express = require('express');
const path = require('path');
const app = express();

const DEFAULT_PORT = parseInt(process.env.PORT, 10) || 3000;

app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/projects', (req, res) => {
  const projects = require('./data/projects.json');
  res.json(projects);
});

function startServer(port) {
  const server = app.listen(port);
  server.on('listening', () => {
    console.log(`Server running on port ${port}`);
  });
  server.on('error', err => {
    if (err.code === 'EADDRINUSE') {
      console.log(`Port ${port} in use, trying ${port + 1}`);
      startServer(port + 1);
    } else {
      throw err;
    }
  });
}

startServer(DEFAULT_PORT);
