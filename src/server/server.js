const express = require('express');
const { con } = require('./mysql');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

let clients = [];

let ClientIDGameQueue = [];


// Socket.IO event handling
io.on('connection', (socket) => {

  console.log(clients.length + ': User | ' + socket.id, 'connected');

  socket.enemyID = null;
  socket.isConnected = false;
  socket.username = null;

  clients.push(socket);


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

  socket.on('hasPlayed', (listedBoard, AlgebraicNotation, BoardFEN) => {
    if (socket.id === null) return;

    let tmpEnemy = clients.filter(client => client.id === socket.enemyID)[0];

    tmpEnemy.emit('enemyHasPlayed', listedBoard, AlgebraicNotation, BoardFEN);
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

  socket.on('userLogin', (username, password) => {
    if (socket.isConnected) return;

    con.query(`SELECT id FROM user_info WHERE username='${username}' AND password='${password}';`, (err, result) => {
      if(err) {
        socket.emit('loginFeedback', 'An error occurs. Please retry.');
        throw err;
      };
      
      if(result.length !== 1) {
        socket.emit('loginFeedback', 'Username or Password not valid!');
        return;
      };
      
      socket.isConnected = true;
      socket.username = username;

      socket.emit('loginFeedback');

      

    });
  });

      
  socket.on('userSignup', (username, password) => {
    if (socket.isConnected) return;

    con.query(`SELECT id FROM user_info WHERE username='${username}' AND password='${password}';`, (err, result) => {
      if(err) {
        socket.emit('signupFeedback', 'An error occurs. Please retry.');
        throw err;
      };
      
      if(result.length > 0) {
        socket.emit('signupFeedback', 'Username already used!');
        return;
      };
      
      con.query(`INSERT INTO user_info (username, password) VALUES ('${username}', '${password}')`, (err, result) => {
        if(err) {
          socket.emit('signupFeedback', 'An error occurs. Please retry.');
          throw err;
        };

        con.query(`INSERT INTO user_stats (id) SELECT id FROM user_info WHERE username='${username}';`);

        socket.isConnected = true;
        socket.username = username;

        socket.emit('signupFeedback');
      });
    });

  });

  socket.on('getElo', (username) => {
    con.query(`SELECT user_elo FROM user_info left JOIN user_stats ON user_info.id = user_stats.id WHERE username='${username}';`, (err, result)=> {
      if(err) throw err;
      if(result.length === 0) return;
      socket.emit('userElo', result[0].user_elo);
    });
  });

  socket.on('userExists', (username)=> {
    con.query(`SELECT id FROM user_info WHERE username='${username}'`, (err, result)=>{
      if(err) {
        socket.emit('ResponceToUserExists', false);
        throw err;
      };

      if(result.length !== 1) {
        socket.emit('ResponceToUserExists', false);
        return;
      }

      socket.emit('ResponceToUserExists', true);
    });
  });

  socket.on('disconnectUser', ()=>{
    socket.isConnected = false;
    socket.username = null;
  });


  socket.on('getEnemyInfo', ()=>{
    let tmpEnemy = clients.find(client => client.id === socket.enemyID);

    let enemyUsername = 'Anonymous';
    let enemyElo = 1000;

    if(tmpEnemy.isConnected) con.query(`SELECT user_elo FROM user_stats 
                                          JOIN user_info 
                                            ON user_stats.id = user_info.id
                                              WHERE username = '${tmpEnemy.username}'`,
                                        (err, result)=>{
                                          if(err) throw err;
                                          enemyElo = result[0].user_elo;
                                          enemyUsername= tmpEnemy.username;
                                          socket.emit('enemyInfo', enemyUsername, enemyElo);
                                        }); 
  else if (socket.isConnected) con.query(`SELECT user_elo FROM user_stats 
                                          JOIN user_info 
                                            ON user_stats.id = user_info.id
                                              WHERE username = '${socket.username}'`,
                                        (err, result)=>{
                                          if(err) throw err;
                                          enemyElo = result[0].user_elo;
                                          socket.emit('enemyInfo', enemyUsername, enemyElo);
                                        });

    
  })

});

// Start the server
const port = 3000;
const hostname = '0.0.0.0'; // Listen on all network interfaces
http.listen(port, hostname, () => {
  con.connect((err) => {
    if(err) throw err;
    console.log('connected to SQL server as ' + con.threadId);
  })
  
  console.log(`Server listening on ${hostname}:${port}`);
});