import { Board } from '../chess/board.js'

import { createVector } from '../chess/vector.js'

class GameManager {
    constructor() {
        this.board = new Board(8);
        this.isPlayerTurn = false;
        this.isPlayerWhite = true;
        this.dragged = null
        this.timer = {
            minutes: '00',
            secondes: '00'
        }
    }
  
    // Update the board with the received data
    updateBoard(listedBoard, AlgebraicNotation, client) {
        this.isPlayerTurn = true;
        client.uiHandler.updateHTMLPlayerStatus(client, 'Your turn!');
        this.board.listToBoard(listedBoard);
        this.board.AlgebraicNotationArray.push(AlgebraicNotation);
        console.log(this.board.AlgebraicNotationArray);

        
        if (this.amICheckmated()) {
            client.socket.emit('lostByCheckmate');
            this.handleLostByCheckmate(client);
        }

        if (this.isPatByMaterial()) {
            client.socket.emit('GameEndOnPat-NEM')
            this.handlePatByNotEnoughtMaterial(client);
        }

        return;
    }

    handleMousePressed(client, sketch) {
        let tmpMouseVector;
        if (client.uiHandler.isReversed) {
            tmpMouseVector = createVector(7 - Math.floor(sketch.mouseX/sketch.tilesize), 7 - Math.floor(sketch.mouseY/sketch.tilesize));
        } else {
            tmpMouseVector = createVector(Math.floor(sketch.mouseX/sketch.tilesize), Math.floor(sketch.mouseY/sketch.tilesize));
        }
        
        if (this.board.isPieceAt(tmpMouseVector)) {
            this.dragged = this.board.getPieceAt(tmpMouseVector);
            this.dragged.isDragged = true;
        }
    } 


    handleMouseReleased(client, sketch) {

        if (!this.dragged) return;

        if (client.enemyID === null) {
            this.dragged.isDragged = false;
            return;
        }

        this.dragged.isDragged = false;

        if (this.isPlayerTurn && this.dragged.isWhite === this.isPlayerWhite) {
            if (this.dragged.move(this.board, sketch.tilesize, sketch.mouseX, sketch.mouseY, client.uiHandler.isReversed)) {
                client.uiHandler.show(client, sketch);
                console.log(this.board.AlgebraicNotationArray);
                client.sendData();
 
            }
        }
        this.dragged = null;
        return;
    }
  
    // Event handler for when the enemy disconnects
    handleEnemyDisconnected() {
        this.isPlayerTurn = false;
      return;
    }
  
    // Event handler for when an enemy is found
    handleEnemyFound(isWhite) {
      this.isPlayerWhite = this.isPlayerTurn = isWhite;
      this.board = new Board(this.board.size, this.board.imgs)
      return;
    }
  
    // Event handler for when the player is checkmated
    handleLostByCheckmate(client) {
        client.uiHandler.updateHTMLPlayerStatus(client, 'lost! Checkmated!');
        client.enemyID = null;
        this.isPlayerTurn = false;
        return;
    }
  
    // Event handler for when the enemy is checkmated
    handleWonByCheckmate(client) {
        client.uiHandler.updateHTMLPlayerStatus(client, 'Won! Enemy is checkmated!');
        client.enemyID = null;
        this.isPlayerTurn = false;
        return;
    }

    handlePatByNotEnoughtMaterial(client) {
        client.uiHandler.updateHTMLPlayerStatus(client, 'Pat! Not enought material! Nobody Win!');
        client.enemyID = null;
        this.isPlayerTurn = false;
        return;
    }

    amICheckmated() {
        return this.board.isCheckmated(this.isPlayerWhite);
    }


    isPatByMaterial() {

        return !(
            this.board.hasEnoughtPieces(true) ||
            this.board.hasEnoughtPieces(false)
        )
    }
  }

export { GameManager };