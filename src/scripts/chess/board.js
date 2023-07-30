import { King, Queen, Rook, Bishop, Knight, Pawn } from './pieces.js';
import { createVector } from './vector.js';


class Board {
    constructor(size){
        this.whitePieces = [];
        this.blackPieces = [];
        this.size = size;

        this.halfMovesCount = 0;
        this.FullMovesCount = 1;

        this.AlgebraicNotationArray = [];
        this.setupPieces();


    }
    
    setupPieces() {

        this.whitePieces.push(new King(3, 0, true));
        this.blackPieces.push(new King(3, 7, false));

        this.whitePieces.push(new Queen(4, 0, true));
        this.blackPieces.push(new Queen(4, 7, false));

        this.whitePieces.push(new Rook(0, 0, true));
        this.blackPieces.push(new Rook(0, 7, false));
        this.whitePieces.push(new Rook(7, 0, true));
        this.blackPieces.push(new Rook(7, 7, false));
        
        this.whitePieces.push(new Bishop(2, 0, true));
        this.blackPieces.push(new Bishop(2, 7, false));
        this.whitePieces.push(new Bishop(5, 0, true));
        this.blackPieces.push(new Bishop(5, 7, false));

        this.whitePieces.push(new Knight(1, 0, true));
        this.blackPieces.push(new Knight(1, 7, false));
        this.whitePieces.push(new Knight(6, 0, true));
        this.blackPieces.push(new Knight(6, 7, false));

        for (let i = 0; i<8; i++) {
            this.whitePieces.push(new Pawn(i, 1, true));
            this.blackPieces.push(new Pawn(i, 6, false));
        }

        
        return;
        
    }


    show(sketch, isReversed){
        let i, j;
        for (i = 0; i < 8; i++) {
            for (j = 0; j < 8; j++) {
              if ((i + j) % 2 == 1) {
                sketch.fill(78, 135, 13);
              } else {
                sketch.fill(241, 255, 223);
              }
              sketch.noStroke();
              sketch.rect(i * sketch.tilesize, j * sketch.tilesize, sketch.tilesize);
        
            }
          }
        

        for(i = 0; i < this.whitePieces.length; i++) this.whitePieces[i].show(sketch, isReversed);
        for(i = 0; i < this.blackPieces.length; i++) this.blackPieces[i].show(sketch, isReversed);
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

    getPiecesByTeamAndLetter(team, letter) {
        let ret = [];
        for (const piece of this.getPiecesByTeam(team)) if (piece.letter === letter) ret.push(piece);
        return ret;
    }


    clone() {
        let i;
        let ret = new Board(this.size);
        ret.AlgebraicNotationArray = this.AlgebraicNotationArray;
        ret.halfMovesCount = this.halfMovesCount;
        ret.FullMovesCount = this.FullMovesCount;
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
        this.halfMovesCount = 0;
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
            let tmpPiece = new letterToClassDict[list[i][0]](list[i][2].x, list[i][2].y, list[i][1], this.imgs);
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

    hasEnoughtPieces(team) {
        let pieces;

        if(team) pieces = this.whitePieces;
        else pieces = this.blackPieces;



        if(pieces.length >= 3) return true;

        if(pieces.length <= 1) return false;

        for(const piece of pieces) {
            if (piece.letter === 'K') continue;

            if (piece.letter === 'B') return false;

            if (piece.letter === 'N') return false;
        }

        return true;

    }

    toFen(isWhite) {
        let ret;
        ret = this.toFenPiecePlacement() + ' ';
        ret += this.toFenActiveColor(isWhite) + ' ';
        ret += this.toFenCastlingRights() + ' ';
        ret += this.toFenEnPassantTarget(!isWhite) + ' ';
        ret += this.toFenHalfMoves() + ' ';
        ret += this.toFenFullMoves(!isWhite);
        return ret;
    }

    toFenPiecePlacement() {
        let ret = '';
        for(let y=7; y>-1; y--) {
            let blankSquareCount = 0;
            for(let x=7;x>-1; x--) {
                if(this.isPieceAt(createVector(x, y)) === false) {
                    blankSquareCount++;
                    continue;
                }

                if(blankSquareCount !== 0) {
                    ret+=blankSquareCount;
                    blankSquareCount = 0; 
                }

                if(this.getPieceAt(createVector(x, y)).isWhite) ret+= this.getPieceAt(createVector(x, y)).letter.toUpperCase()
                else ret+= this.getPieceAt(createVector(x, y)).letter.toLowerCase();
            }
            if(blankSquareCount !== 0) ret+= blankSquareCount;
            ret += '/';
        }

        return ret;
    }

    toFenActiveColor(isWhite) {
        let ret;
        if(isWhite) ret = 'w';
        else ret = 'b';

        return ret;
    }

    // certified too long but idc
    toFenCastlingRights() {
        function check(tmpPiece, king) {
            return (
                tmpPiece !== null &&
                tmpPiece.letter === 'R' &&
                tmpPiece.isWhite === king.isWhite &&
                tmpPiece.firstMove
            )
        }

        let ret = '';
        let tmpKing = this.getPiecesByTeamAndLetter(true, 'K')[0];

        if(tmpKing !== null && tmpKing.firstMove) {
            let tmpPiece = this.getPieceAt(createVector(0, tmpKing.vector.y));
            if(check(tmpPiece, tmpKing)) ret += 'K';

            tmpPiece = this.getPieceAt(createVector(this.size - 1, tmpKing.vector.y));
            if(check(tmpPiece, tmpKing)) ret += 'Q';
        }
        tmpKing = this.getPiecesByTeamAndLetter(false, 'K')[0];
        if(tmpKing !== null && tmpKing.firstMove) {
            let tmpPiece = this.getPieceAt(createVector(0, tmpKing.vector.y));
            if(check(tmpPiece, tmpKing)) ret += 'k';

            tmpPiece = this.getPieceAt(createVector(this.size - 1, tmpKing.vector.y));
            if(check(tmpPiece, tmpKing)) ret += 'q';
        }
        return ret;
    }

    toFenEnPassantTarget(isWhite) {

        let tmpPieces = this.getPiecesByTeam(isWhite);

        for(const piece of tmpPieces) {
            if(piece.letter !== 'p') continue;
            if(piece.enPassantVulnerable) {
                if(isWhite) return String.fromCharCode(104 - piece.vector.x) + piece.vector.y.toString();
                else return String.fromCharCode(104 - piece.vector.x) + (piece.vector.y + 2).toString();
            }
        }

        return '-';

    }

    toFenHalfMoves() {
        return this.halfMovesCount.toString();
    }

    toFenFullMoves(isPlayerWhite) {
        if(!isPlayerWhite) this.FullMovesCount += 1;
        return this.FullMovesCount.toString();
    }

    fromFen(fen) {
        const parts = fen.split(' ');
        console.log(parts);
    }
}

export { Board };