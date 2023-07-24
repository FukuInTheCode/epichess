const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

let clients = [];

let ClientIDGameQueue = [];

// Socket.IO event handling
io.on('connection', (socket) => {

  console.log(clients.length + ': User | ' + socket.id, 'connected');
  clients.push(socket);
  socket.enemyID = null;

  socket.on('disconnect', () => {
    console.log('User | ' + socket.id, 'disconnected');

    clients = clients.filter(client => client !== socket);
    ClientIDGameQueue = ClientIDGameQueue.filter(clientID => clientID !== socket.id);

    if (!socket.enemyID) return;

    let tmpEnemy = clients.filter(client => client.id === socket.enemyID)[0];

    tmpEnemy.enemyID = null;

    tmpEnemy.emit('enemyDisconnected');

  });

  socket.on('inResearch', () => {
    if(ClientIDGameQueue.includes(socket.id)) return;
    // check if a clients is already searching for a game and if not add the clients to the Queue
    if (ClientIDGameQueue.length > 0) {

      let socketIsWhite = Boolean(Math.floor(Math.random() * 2));

      let tmpEnemyID = ClientIDGameQueue.splice(0, 1)[0];
      socket.enemyID = tmpEnemyID;

      socket.emit('enemyFound', tmpEnemyID, socketIsWhite);


      let enemy = clients.filter(client => client.id === tmpEnemyID)[0];
      enemy.enemyID = socket.id;

      enemy.emit('enemyFound', socket.id, !socketIsWhite);

    } else {
      ClientIDGameQueue.push(socket.id);
    }

  });

  socket.on('hasPlayed', (listedBoard, AlgebraicNotation) => {
    if (socket.id === null) return;

    let tmpEnemy = clients.filter(client => client.id === socket.enemyID)[0];

    tmpEnemy.emit('enemyHasPlayed', listedBoard, AlgebraicNotation);
  });

  socket.on('lostByCheckmate', () => {
    console.log(socket.enemyID);
    let tmpEnemy = clients.filter(client => client.id === socket.enemyID)[0];
    tmpEnemy.emit('wonByCheckmate');
    socket.enemyID = null;
    tmpEnemy.enemyID = null;
  });

  socket.on('GameEndOnPat-NEM', () => {
    let tmpEnemy = clients.filter(client => client.id === socket.enemyID)[0];
    tmpEnemy.emit('patNotEnoughtMaterial');
    socket.enemyID = null;
    tmpEnemy.enemyID = null;

  });

});

// Start the server
const port = 3000;
const hostname = '0.0.0.0'; // Listen on all network interfaces
http.listen(port, hostname, () => {
  console.log(`Server listening on ${hostname}:${port}`);
});
