import { Board } from '../chess/board.js'

import { createVector } from '../chess/vector.js'

class GameManager {
    constructor(imgs) {
        this.board = new Board(8, imgs);
        this.isPlayerTurn = true;
        this.isPlayerWhite = true;
        this.dragged = null

    }
  
    // Update the board with the received data
    updateBoard(listedBoard, client) {
        this.isPlayerTurn = true;
        client.uiHandler.updateHTMLPlayerStatus('Your turn!');
        this.board.listToBoard(listedBoard);
        this.checkmateCheck(client);
        return;
    }
  
    // Check if the player is checkmated
    checkmateCheck(client) {
        if (this.board.isCheckmated(this.isPlayerWhite)) {
            this.handleLostByCheckmate(client);
            client.socket.emit('isCheckmated');
        }
        return; 
    }

    handleMousePressed(sketch) {
        let tmpMouseVector = createVector(Math.floor(sketch.mouseX/sketch.client.uiHandler.tilesize), Math.floor(sketch.mouseY/sketch.client.uiHandler.tilesize));
        if (this.board.isPieceAt(tmpMouseVector)) {
            this.dragged = this.board.getPieceAt(tmpMouseVector);
            this.dragged.isDragged = true;
        }
    } 


    handleMouseReleased(sketch) {
        if (sketch.client.enemyID === null) return;
        if (!this.dragged) return;

        this.dragged.isDragged = false;
        if (this.isPlayerTurn && this.dragged.isWhite === this.isPlayerWhite) {
            if (this.dragged.move(this.board, sketch.client.uiHandler.tilesize, sketch.mouseX, sketch.mouseY)) {
                sketch.client.uiHandler.show(sketch);
                sketch.client.sendData();
            }
        }
        this.dragged = null;
        return;
    }
  
    // Event handler for when the enemy disconnects
    handleEnemyDisconnected() {
      // ...
      return;
    }
  
    // Event handler for when an enemy is found
    handleEnemyFound(isWhite) {
      this.isPlayerWhite = this.isPlayerTurn = isWhite;
      return;
    }
  
    // Event handler for when the player is checkmated
    handleLostByCheckmate(client) {
        client.uiHandler.updateHTMLPlayerStatus('lost! Checkmated!');
        client.enemyID = null;
        this.isPlayerTurn = false;
        return;
    }
  
    // Event handler for when the enemy is checkmated
    handleWonByCheckmate(client) {
        client.uiHandler.updateHTMLPlayerStatus('Won! Enemy is checkmated!');
        client.enemyID = null;
        this.isPlayerTurn = false;
        return;
    }
  }

export { GameManager };