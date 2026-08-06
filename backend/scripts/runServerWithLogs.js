const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const logStream = fs.createWriteStream(path.join(__dirname, '../server_debug.log'));

const server = spawn('node', ['server.js'], {
  cwd: path.join(__dirname, '..'),
  env: process.env
});

server.stdout.pipe(logStream);
server.stderr.pipe(logStream);

server.on('close', (code) => {
  logStream.write(`\nServer process exited with code ${code}`);
});

console.log('Server debug process started');
setTimeout(() => {
  process.exit(0);
}, 20000);
