import { King, Queen, Rook, Bishop, Knight, Pawn } from './pieces.js';


class Board {
    constructor(size, imgs){
        this.whitePieces = [];
        this.blackPieces = [];
        this.size = size;
        this.setupPieces(imgs)
    }
    
    setupPieces(imgs) {

        this.whitePieces.push(new King(4, 0, true, imgs));
        this.blackPieces.push(new King(4, 7, false, imgs));

        this.whitePieces.push(new Queen(3, 0, true, imgs));
        this.blackPieces.push(new Queen(3, 7, false, imgs));

        this.whitePieces.push(new Rook(0, 0, true, imgs));
        this.blackPieces.push(new Rook(0, 7, false, imgs));
        this.whitePieces.push(new Rook(7, 0, true, imgs));
        this.blackPieces.push(new Rook(7, 7, false, imgs));
        
        this.whitePieces.push(new Bishop(2, 0, true, imgs));
        this.blackPieces.push(new Bishop(2, 7, false, imgs));
        this.whitePieces.push(new Bishop(5, 0, true, imgs));
        this.blackPieces.push(new Bishop(5, 7, false, imgs));

        this.whitePieces.push(new Knight(1, 0, true, imgs));
        this.blackPieces.push(new Knight(1, 7, false, imgs));
        this.whitePieces.push(new Knight(6, 0, true, imgs));
        this.blackPieces.push(new Knight(6, 7, false, imgs));

        for (let i = 0; i<8; i++) {
            this.whitePieces.push(new Pawn(i, 1, true, imgs));
            this.blackPieces.push(new Pawn(i, 6, false, imgs));
        }

        return;
        
    }

    show(tilesize, sketch){

        let i, j;
        for (i = 0; i < 8; i++) {
            for (j = 0; j < 8; j++) {
              if ((i + j) % 2 == 0) {
                sketch.fill(78, 135, 13);
              } else {
                sketch.fill(241, 255, 223);
              }
              sketch.noStroke();
              sketch.rect(i * tilesize, j * tilesize, tilesize);
        
            }
          }
        

        for(i = 0; i < this.whitePieces.length; i++) this.whitePieces[i].show(tilesize, sketch);
        for(i = 0; i < this.blackPieces.length; i++) this.blackPieces[i].show(tilesize, sketch);
        return;
    }

    isPieceAt(vector) {
        let i;
        for (i = 0; i<this.whitePieces.length; i++) if (this.whitePieces[i].vector.equals(vector)) return true;
        for (i = 0; i<this.blackPieces.length; i++) if (this.blackPieces[i].vector.equals(vector)) return true;
        return false;
    }

    getPieceAt(vector) {
        let i;
        if (!this.isPieceAt(vector)) return null;

        for (i = 0; i<this.whitePieces.length; i++) if (this.whitePieces[i].vector.equals(vector)) return this.whitePieces[i];
        for (i = 0; i<this.blackPieces.length; i++) if (this.blackPieces[i].vector.equals(vector)) return this.blackPieces[i];
        return null;
    }

    getPiecesByTeam(team) {
        if (team) return this.whitePieces;
        else return this.blackPieces;
    }

    getPiecesByTeamAndType(team, type) {
        let ret = [];
        for (const piece of this.getPiecesByTeam(team)) if (piece instanceof type) ret.push(piece);
        return ret;
    }

    clone() {
        let i;
        let ret = new Board(this.size);
        ret.whitePieces = [];
        ret.blackPieces = [];
        for(i = 0; i<this.whitePieces.length; i++) ret.whitePieces.push(this.whitePieces[i].clone());
        for(i = 0; i<this.blackPieces.length; i++) ret.blackPieces.push(this.blackPieces[i].clone());
        return ret;
    }

    del(vector) {
        let toDelete = this.getPieceAt(vector);
        if (toDelete === null) return;
        if (toDelete.isWhite) {
            delete this.whitePieces.splice(this.whitePieces.indexOf(toDelete), 1);
        } else {
            delete this.blackPieces.splice(this.blackPieces.indexOf(toDelete), 1);
        }
        return;
    }

    add(piece) {
        if (piece.isWhite) {
            this.whitePieces.push(piece);
        } else {
            this.blackPieces.push(piece);
        }
    }

    resetEnpassant(team) {
        if (team) {
            for (let piece of this.whitePieces) piece.enPassantVulnerable = false;
        } else {
            for (let piece of this.blackPieces) piece.enPassantVulnerable = false;
        }
    }
    
    boardToList() {
        let ret = [];

        for (const piece of this.whitePieces) {
            ret.push([piece.letter, true, piece.vector, piece.firstMove, piece.enPassantVulnerable]);
        }

        for (const piece of this.blackPieces) {
            ret.push([piece.letter, false, piece.vector, piece.firstMove, piece.enPassantVulnerable]);
        }

        return ret;
    }

    listToBoard(list) {
        this.whitePieces = [];
        this.blackPieces = [];

        const letterToClassDict = {
            'p': Pawn,
            'K': King,
            'Q': Queen,
            'N': Knight,
            'R': Rook,
            'B': Bishop
        };

        for (let i = 0; i<list.length; i++) {
            let tmpPiece = new letterToClassDict[list[i][0]](list[i][2].x, list[i][2].y, list[i][1]);
            tmpPiece.firstMove = list[i][3];
            tmpPiece.enPassantVulnerable = list[i][4];
            if (list[i][1]) this.whitePieces.push(tmpPiece);
            else this.blackPieces.push(tmpPiece);
        }

        return;
    }


    isCheckmated(team) {
        let tmpKing = this.getPiecesByTeamAndType(team, King)[0];
        for (const piece of this.getPiecesByTeam(team)) {
            for (const move of piece.moves) {
                if (move.isValid(piece.vector, this) &&
                    !tmpKing.isPutInCheck(piece, move, this)
                ) return false;
            }
        }
        return true;
    }
}

export { Board };