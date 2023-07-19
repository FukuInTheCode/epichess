//!bin/node.js


import { GameManager } from './game-manager.js';
import { UIHandler } from './UIHandler.js';
import io from 'socket.io-client'

// Represents the client class for the chess application


class MyClient {
    constructor() {
        this.enemyID = null;

        this.clientStatus = "Idling";

        this.socket = io('http://192.168.1.34:3000', { transports: ['websocket'] });
        
    }

    setup(imgs) {
        this.gameManager = new GameManager(imgs);
        this.uiHandler = new UIHandler(100);
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

        this.socket.on('enemyHasPlayed', (listedBoard, AlgebraicNotation) => {
            this.gameManager.updateBoard(listedBoard, AlgebraicNotation, this);
            return;
        });

        this.socket.on('wonByCheckmate', () => {
            this.gameManager.handleWonByCheckmate(this);
            return;
        });

        this.socket.on('patNotEnoughtMaterial', () => {
            this.gameManager.handlePatByNotEnoughtMaterial(this)
        })

        return;
    }


        
    mouseReleased() {
        this.gameManager.handleMouseRelease(this);
        return;
    }

    
    clickPlayButton() {
        if (this.enemyID !== null) return;

        this.uiHandler.updateHTMLPlayerStatus(this, 'In research...');

        this.socket.emit('inResearch');
        return;
    }


    sendData() {

        const listedBoard = this.gameManager.board.boardToList();

        this.gameManager.isPlayerTurn = false;
        this.socket.emit('hasPlayed', listedBoard, this.gameManager.board.AlgebraicNotationArray[this.gameManager.board.AlgebraicNotationArray.length - 1]);

        
        if (this.gameManager.isPlayerWhite) this.uiHandler.updateHTMLPlayerStatus(this, 'Black turn!');
        else this.uiHandler.updateHTMLPlayerStatus(this, 'White turn!');

        return;
    }

    enemyDisconnected() {
        if (this.enemyID === null) return;
        this.uiHandler.updateHTMLPlayerStatus(this, 'Won! Enemy disconnect!');
        this.gameManager.handleEnemyDisconnected();
        this.enemyID = null;
        return;
    }

    enemyFound(enemyID, isPlayerWhite) {
        this.enemyID = enemyID;
        this.gameManager.handleEnemyFound(isPlayerWhite);
        if (isPlayerWhite) this.uiHandler.updateHTMLPlayerStatus(this, 'Game Found! Your Turn!');
        else this.uiHandler.updateHTMLPlayerStatus(this, 'Game Found! White turn!');
        return;
    }

    disconnectSocket() {
        if (this.socket) {
            this.socket.disconnect();
        }
        return;
    }
}

export { MyClient };
