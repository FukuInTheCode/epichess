//!bin/node.js


import { GameManager } from './game-manager.js';
import { UIHandler } from './UIHandler.js';
import io from 'socket.io-client'

// Represents the client class for the chess application


class MyClient {
    constructor(imgs) {
        this.enemyID = null;
        this.gameManager = new GameManager(imgs);
        this.uiHandler = new UIHandler(100);
        this.socket = io('http://192.168.1.34:3000', { transports: ['websocket'] });
        this.setListener();
    }

    setListener() {
        this.socket.on('enemyFound', (enemyID, isPlayerWhite) => {
            this.enemyFound(enemyID, isPlayerWhite);
            return;
        });

        this.socket.on('enemyDisconnected', () => {
            this.enemyDisconnected();
            return;
        });

        this.socket.on('enemyHasPlayed', (listedBoard) => {
            this.gameManager.updateBoard(listedBoard, this);
            return;
        });

        this.socket.on('wonByCheckmate', () => {
            this.gameManager.handleWonByCheckmate(this);
            return;
        });

        return;
    }


        
    mouseReleased() {
        this.gameManager.handleMouseRelease(this);
        return;
    }

    
    clickPlayButton() {
        if (this.enemyID !== null) return;

        this.uiHandler.updateHTMLPlayerStatus('In research...');

        this.socket.emit('inResearch');
        return;
    }


    sendData() {

        const listedBoard = this.gameManager.board.boardToList();

        this.gameManager.isPlayerTurn = false;
        this.socket.emit('hasPlayed', (listedBoard));
        if (this.gameManager.isPlayerWhite) this.uiHandler.updateHTMLPlayerStatus('Black turn!');
        else this.uiHandler.updateHTMLPlayerStatus('White turn!');
        return;
    }

    enemyDisconnected() {
        this.uiHandler.updateHTMLPlayerStatus('Won! Enemy disconnect!');
        return;
    }

    enemyFound(enemyID, isPlayerWhite) {
        this.enemyID = enemyID;
        this.gameManager.handleEnemyFound(isPlayerWhite);
        if (isPlayerWhite) this.uiHandler.updateHTMLPlayerStatus('Game Found! Your Turn!');
        else this.uiHandler.updateHTMLPlayerStatus('Game Found! White turn!');
        return;
    }
}

export { MyClient };
