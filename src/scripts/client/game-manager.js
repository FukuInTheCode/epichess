import { Board } from '../chess/board.js'

import { createVector } from '../chess/vector.js'

class GameManager {
    constructor(uiHandler) {
        this.board = new Board(8);
        this.isPlayerTurn = false;
        this.isPlayerWhite = true;
        this.isPlaying = false;
        this.dragged = null;
        this.uiHandler = uiHandler;
    }
    // eslint-disable-next-line
    initSocket(socket, isPlaying) {
        socket.on('enemyFound', (enemyID, isPlayerWhite) => {
            socket.emit('getEnemyInfo');
            isPlaying[0] = true;
            this.handleEnemyFound(enemyID, isPlayerWhite);
            return;
        });

        socket.on('enemyDisconnected', () => {
            isPlaying[0] = false;
            this.handleEnemyDisconnected();
            return;
        });

        socket.on('wonByCheckmate', () => {
            isPlaying[0] = false;
            this.handleWonByCheckmate();
            return;
        });

        socket.on('patNotEnoughtMaterial', () => {
            isPlaying[0] = false;
            this.handlePatByNotEnoughtMaterial()
        })

        return;
    }
  
    // Update the board with the received data
    updateBoard(listedBoard, AlgebraicNotation, socket, isPlaying) {
        this.isPlayerTurn = true;
        this.uiHandler.updateHTMLPlayerStatus('Your turn!');
        this.board.listToBoard(listedBoard);
        this.board.AlgebraicNotationArray.push(AlgebraicNotation);

        
        if (this.amICheckmated()) {
            isPlaying[0] = false;
            socket.emit('lostByCheckmate');
            this.handleLostByCheckmate();
        }

        if (this.isPatByMaterial()) {
            isPlaying[0] = false;
            socket.emit('GameEndOnPat-NEM');
            this.handlePatByNotEnoughtMaterial();
        }

        return;
    }

    handleMousePressed(sketch) {
        let tmpMouseVector;
        if (this.uiHandler.isReversed) {
            tmpMouseVector = createVector(7 - Math.floor(sketch.mouseX/sketch.tilesize), 7 - Math.floor(sketch.mouseY/sketch.tilesize));
        } else {
            tmpMouseVector = createVector(Math.floor(sketch.mouseX/sketch.tilesize), Math.floor(sketch.mouseY/sketch.tilesize));
        }
        
        if (this.board.isPieceAt(tmpMouseVector)) {
            this.dragged = this.board.getPieceAt(tmpMouseVector);
            this.dragged.isDragged = true;
        }
    } 


    handleMouseReleased(sketch, socket, arr) {

        if (!this.dragged) return;

        this.dragged.isDragged = false;

        if (this.isPlayerTurn && this.dragged.isWhite === this.isPlayerWhite) {
            if (this.dragged.move(this.board, sketch.tilesize, sketch.mouseX, sketch.mouseY, this.uiHandler.isReversed)) {
                this.uiHandler.show(this, sketch);

                arr.push(this.board.AlgebraicNotationArray[this.board.AlgebraicNotationArray.length-1]);
                
                this.sendData(socket);

                if (this.isPlayerWhite) this.uiHandler.updateHTMLPlayerStatus('Black turn!');
                else this.uiHandler.updateHTMLPlayerStatus('White turn!');

            }
        }
        this.dragged = null;
        return;
    }
  
    // Event handler for when the enemy disconnects
    handleEnemyDisconnected() {
        this.uiHandler.updateHTMLPlayerStatus('Won! Enemy disconnect!');
        this.isPlaying = false;
        this.isPlayerTurn = false;
      return;
    }
  
    // Event handler for when an enemy is found
    handleEnemyFound(enemyID, isPlayerWhite) {
        this.isPlaying = true;
        this.uiHandler.enemyUsername = enemyID
        this.uiHandler.isReversed = isPlayerWhite;
        this.isPlayerWhite = this.isPlayerTurn = isPlayerWhite;
        this.board = new Board(this.board.size, this.board.imgs);
        if (isPlayerWhite) this.uiHandler.updateHTMLPlayerStatus('Game Found! Your Turn!');
        else this.uiHandler.updateHTMLPlayerStatus('Game Found! White turn!');
        return;
    }
  
    // Event handler for when the player is checkmated
    handleLostByCheckmate() {
        this.uiHandler.updateHTMLPlayerStatus('lost! Checkmated!');
        this.isPlayerTurn = false;
        this.isPlaying = false;
        return;
    }
  
    // Event handler for when the enemy is checkmated
    handleWonByCheckmate() {
        this.uiHandler.updateHTMLPlayerStatus('Won! Enemy is checkmated!');
        this.isPlayerTurn = false;
        this.isPlaying = false;
        return;
    }

    handlePatByNotEnoughtMaterial() {
        this.uiHandler.updateHTMLPlayerStatus('Pat! Not enought material! Nobody Win!');
        this.isPlayerTurn = false;
        this.isPlaying = false;
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

    sendData(socket) {
        const listedBoard = this.board.boardToList();
        const BoardFEN = this.board.toFen(!this.isPlayerWhite);
        console.log(BoardFEN, 'envoyé');
        this.isPlayerTurn = false;
        socket.emit('hasPlayed', listedBoard, this.board.AlgebraicNotationArray[this.board.AlgebraicNotationArray.length - 1], BoardFEN);
        return;
    }


    // eslint-disable-next-line
    clickPlayButton(socket) {

        this.uiHandler.updateHTMLPlayerStatus('In research...');

        socket.emit('inResearch');



    }

  }

export { GameManager };