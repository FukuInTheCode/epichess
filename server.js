const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

// Socket.IO event handling
io.on('connection', (socket) => {
  console.log('A user connected');
});

// Start the server
const port = 3000;
const hostname = '0.0.0.0'; // Listen on all network interfaces
http.listen(port, hostname, () => {
  console.log(`Server listening on ${hostname}:${port}`);
});
