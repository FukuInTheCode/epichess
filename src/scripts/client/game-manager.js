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
    updateBoard(listedBoard, AlgebraicNotation, client) {
        this.isPlayerTurn = true;
        client.uiHandler.updateHTMLPlayerStatus('Your turn!');
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

    handleMousePressed(sketch) {
        let tmpMouseVector = createVector(Math.floor(sketch.mouseX/sketch.client.uiHandler.tilesize), Math.floor(sketch.mouseY/sketch.client.uiHandler.tilesize));
        if (this.board.isPieceAt(tmpMouseVector)) {
            this.dragged = this.board.getPieceAt(tmpMouseVector);
            this.dragged.isDragged = true;
        }
    } 


    handleMouseReleased(sketch) {

        if (!this.dragged) return;

        if (sketch.client.enemyID === null) {
            this.dragged.isDragged = false;
            return;
        }


        this.dragged.isDragged = false;

        if (this.isPlayerTurn && this.dragged.isWhite === this.isPlayerWhite) {
            if (this.dragged.move(this.board, sketch.client.uiHandler.tilesize, sketch.mouseX, sketch.mouseY)) {
                sketch.client.uiHandler.show(sketch);
                console.log(this.board.AlgebraicNotationArray);
                sketch.client.sendData();
 
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

    handlePatByNotEnoughtMaterial(client) {
        client.uiHandler.updateHTMLPlayerStatus('Pat! Not enought material! Nobody Win!');
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