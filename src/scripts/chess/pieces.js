const { createVector } = require("./vector.js");

const { Move, KnightMove, BasePawnMove, FirstPawnMove, TackingPawnMove, EnPassantMove, BasePromotionPawnMove, TackingPromotionPawnMove, ShortCastle, LongCastle } = require('./moves.js');


class Piece {

    constructor(x, y, isWhite, letter, imgs) {
        this.vector = createVector(x, y);
        this.isWhite = isWhite;
        this.img = imgs[0];
        this.letter = letter;
        this.moves = [
            new Move(createVector(1, 0)),
            new Move(createVector(1, 1)),
            new Move(createVector(1, -1)),
            new Move(createVector(0, 1)),
            new Move(createVector(0, -1)),
            new Move(createVector(-1, 0)),
            new Move(createVector(-1, 1)),
            new Move(createVector(-1, -1))
        ];
        this.isDragged = false;
        this.score = 0;

        this.firstMove = true;
        this.enPassantVulnerable = false;
    }

    show(tilesize, sketch) {
        sketch.imageMode(sketch.CENTER);
        if (this.isDragged) {
            sketch.image(this.img, sketch.mouseX, sketch.mouseY, tilesize, tilesize);
        } else {
            sketch.image(this.img, 
                this.vector.x * tilesize + tilesize / 2, 
                this.vector.y * tilesize + tilesize / 2, 
                tilesize, 
                tilesize);
        }
    }

    move(board, tilesize, X, Y) {
        let mouseVector = createVector(Math.floor(X/tilesize), Math.floor(Y/tilesize));
        const validMoves = this.getValidMoves(mouseVector, board);
        if (validMoves.length === 1) {
            if (board.getPiecesByTeamAndType(this.isWhite, King)[0].isPutInCheck(this, validMoves[0], board)) return false;
            validMoves[0].doWhateverThisMoveDo(this, board);
            return true;
        } else if (validMoves.length > 1) {
            console.log("Something went wrong!");
        }
        return false;

    }

    getValidMoves(vector, board) {
        let ret = [];
        for (const move of this.getMoves(vector)) {
            if (move.isValid(this.vector, board)) ret.push(move);
        }

        return ret;
    }

    getMoves(vector) {
        let ret = [];
        for(const move of this.moves) {
            if (move.getNewVector(this.vector).equals(vector)) ret.push(move);
        }

        return ret;
    }
}

class King extends Piece {
    constructor(x, y, isWhite, imgs) {
        super(x, y, isWhite, 'K', imgs);
        if (isWhite) this.img = imgs[0];
        else this.img = imgs[6];
        this.score = 1000;

        this.moves.push(new ShortCastle(createVector(2, 0)));
        this.moves.push(new LongCastle(createVector(-2, 0)));


    }

    
    clone(imgs) {
        return new King(this.vector.x, this.vector.y, this.isWhite, imgs);
    }

    isAttacked(board) {
        for (const piece of board.getPiecesByTeam(!this.isWhite)) {
            for (const move of piece.moves) {
                if (move.isCastleMove) continue;
                if (move.isValid(piece.vector, board) &&
                move.getNewVector(piece.vector).equals(this.vector)
                ) return true;

            }
        }
        return false;
    }

    isPutInCheck(piece, move, board) {
        let clonedBoard = board.clone();

        move.doWhateverThisMoveDo(clonedBoard.getPieceAt(piece.vector), clonedBoard);

        return clonedBoard.getPiecesByTeamAndType(this.isWhite, King)[0].isAttacked(clonedBoard);
    }

}

class Queen extends Piece{
    constructor(x, y, isWhite, imgs) {
        super(x, y, isWhite, 'Q', imgs);
        if (isWhite) this.img = imgs[1];
        else this.img = imgs[7]
        this.score = 9;
        this.moves = [];
        
        for (let i = 1; i<8; i++) {
            this.moves.push(new Move(createVector(i, 0)));
            this.moves.push(new Move(createVector(-i, 0)));
            this.moves.push(new Move(createVector(0, i)));
            this.moves.push(new Move(createVector(0, -i)));
            this.moves.push(new Move(createVector(i, i)));
            this.moves.push(new Move(createVector(i, -i)));
            this.moves.push(new Move(createVector(-i, i)));
            this.moves.push(new Move(createVector(-i, -i)));
        }
    }

    clone(imgs) {
        return new Queen(this.vector.x, this.vector.y, this.isWhite, imgs);
    }

}

class Bishop extends Piece {
    constructor(x, y, isWhite, imgs) {
        super(x, y, isWhite, 'B', imgs);
        if (isWhite) this.img = imgs[2];
        else this.img = imgs[8]
        this.score = 3;
        this.moves = [];
        for (let i = 1; i<8; i++) {
            this.moves.push(new Move(createVector(i, i)));
            this.moves.push(new Move(createVector(i, -i)));
            this.moves.push(new Move(createVector(-i, i)));
            this.moves.push(new Move(createVector(-i, -i)));
        }
    }

    clone(imgs) {
        return new Bishop(this.vector.x, this.vector.y, this.isWhite, imgs);
    }
}

class Rook extends Piece {
    constructor(x, y, isWhite, imgs) {
        super(x, y, isWhite, 'R', imgs);
        if (isWhite) this.img = imgs[4];
        else this.img = imgs[10]
        this.score = 9;
        this.moves = [];
        for (let i = 1; i<8; i++) {
            this.moves.push(new Move(createVector(i, 0)));
            this.moves.push(new Move(createVector(-i, 0)));
            this.moves.push(new Move(createVector(0, i)));
            this.moves.push(new Move(createVector(0, -i)));
        }
    }

    clone(imgs) {
        return new Rook(this.vector.x, this.vector.y, this.isWhite, imgs);
    }
}

class Knight extends Piece {
    constructor(x, y, isWhite, imgs) {
        super(x, y, isWhite, 'N', imgs);
        if (isWhite) this.img = imgs[3];
        else this.img = imgs[9]
        this.score = 3;
        this.moves = [];
        for (let i = -2; i<3; i+=4) {
            for (let j = -1; j<2; j+=2) {
                this.moves.push(new KnightMove(createVector(i, j)));
                this.moves.push(new KnightMove(createVector(j, i)));
            }
        }
    }

    clone(imgs) {
        return new Knight(this.vector.x, this.vector.y, this.isWhite, imgs);
    }

}
class Pawn extends Piece {
    constructor(x, y, isWhite, imgs) {
        super(x, y, isWhite, 'p', imgs);
        if (isWhite) this.img = imgs[5];
        else this.img = imgs[11]
        this.score = 1;

        let i;
        if (!this.isWhite) i = -1;
        else i = 1;
        this.moves = [
            new BasePawnMove(createVector(0, i)), 
            new FirstPawnMove(createVector(0, 2*i)),
            new TackingPawnMove(createVector(1, i)),
            new TackingPawnMove(createVector(-1, i)),
            new EnPassantMove(createVector(1, i)), 
            new EnPassantMove(createVector(-1, i)),
            new BasePromotionPawnMove(createVector(0, i)),
            new TackingPromotionPawnMove(createVector(1, i)),
            new TackingPromotionPawnMove(createVector(-1, i))
        ]
    }
        

    clone(imgs) {
        let ret = new Pawn(this.vector.x, this.vector.y, this.isWhite, imgs);

        ret.firstMove = this.firstMove;

        ret.enPassantVulnerable = this.enPassantVulnerable;

        return ret;
    }
}


export { King, Queen, Rook, Bishop, Knight, Pawn, Piece };