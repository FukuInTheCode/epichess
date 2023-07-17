import { createVector } from './vector';

const boardSize = 8;

class Move {
    constructor(d, del_d = null) {
        this.d = d;
        this.del_xy = this.d
        if (del_d != null) this.del_xy = del_d;
        this.directionVector = createVector(this.d.x / Math.abs(this.d.x), this.d.y / Math.abs(this.d.y));
    }

    getNewVector(vector) {
        return createVector(
            vector.x + this.d.x,
            vector.y + this.d.y
        );
    }

    getNewDelVector(vector) {
        return createVector(
            vector.x + this.del_xy.x,
            vector.y + this.del_xy.y
        );
    }

    isValid(vector, board) {
        return (
            this.isWithinBorder(this.getNewVector(vector), board) &&
            (!board.isPieceAt(this.getNewVector(vector)) ||
            board.getPieceAt(this.getNewVector(vector)).isWhite !== board.getPieceAt(vector).isWhite) &&
            !this.isMovingThroughPieces(vector, board)
        )
    }

    isWithinBorder(vector, board) {
        return (
            vector.x < board.size &&
            vector.y < board.size &&
            vector.x >= 0 &&
            vector.y >= 0
        )
    }

    doWhateverThisMoveDo(piece, board) {
        board.del(this.getNewDelVector(piece.vector));
        piece.vector = this.getNewVector(piece.vector);
        board.resetEnpassant(piece.isWhite);
    }

    isMovingThroughPieces(vector, board) {
        let i = 1;
        const newVec = this.getNewVector(vector);

        while (i*this.directionVector.x + vector.x !== newVec.x ||
                i*this.directionVector.y + vector.y !== newVec.y
                ) {
                    if (board.isPieceAt(createVector(
                                            i*this.directionVector.x + vector.x,
                                            i*this.directionVector.y + vector.y
                                            ))) return true;
                    i++;
                }
        return false;
        
    }
}

class KnightMove extends Move {
    constructor(d, del_d = null) {
        super(d, del_d);
    }

    isValid(vector, board) {
        return (
            this.isWithinBorder(this.getNewVector(vector), board) &&
            (!board.isPieceAt(this.getNewVector(vector)) ||
            board.getPieceAt(this.getNewVector(vector)).isWhite !== board.getPieceAt(vector).isWhite)
        )
    }

}

class BasePawnMove extends Move {
    constructor(d, del_d = null) {
        super(d, del_d);
        this.lastRow;
        if (d.y === 1) this.lastRow = boardSize - 1;
        else this.lastRow = 0;
    }

    isValid(vector, board) {
        return (
            this.isWithinBorder(this.getNewVector(vector), board) &&
            this.getNewVector(vector).y !== this.lastRow &&
            !board.isPieceAt(this.getNewVector(vector)) &&
            !this.isMovingThroughPieces(vector, board)
        )
    }

    doWhateverThisMoveDo(piece, board) {
        board.del(this.getNewDelVector(piece.vector));
        piece.vector = this.getNewVector(piece.vector);
        piece.firstMove = false;
        board.resetEnpassant(piece.isWhite);
    }
    
}

class TackingPawnMove extends BasePawnMove {
    constructor(d, del_d = null) {
        super(d, del_d);
    }

    
    isValid(vector, board) {
        return (
            this.isWithinBorder(this.getNewVector(vector), board) &&
            this.getNewVector(vector).y !== this.lastRow &&
            board.isPieceAt(this.getNewVector(vector)) &&
            board.getPieceAt(this.getNewVector(vector)).isWhite !== board.getPieceAt(vector).isWhite &&
            !this.isMovingThroughPieces(vector, board)
        )
    }
}

class FirstPawnMove extends BasePawnMove {
    constructor(d, del_d = null) {
        super(d, del_d);
    }

    isValid(vector, board) {
        return (
            this.isWithinBorder(this.getNewVector(vector), board) &&
            this.getNewVector(vector).y !== this.lastRow &&
            board.getPieceAt(vector).firstMove &&
            !board.isPieceAt(this.getNewVector(vector)) &&
            !this.isMovingThroughPieces(vector, board)
        )
    }

    doWhateverThisMoveDo(piece, board) {
        board.del(this.getNewDelVector(piece.vector));
        piece.vector = this.getNewVector(piece.vector);
        piece.firstMove = false;
        board.resetEnpassant(piece.isWhite);
        piece.enPassantVulnerable = true;
    }

}

class EnPassantMove extends BasePawnMove {
    // eslint-disable-next-line
    constructor(d, del_d = null) {
        super(d, createVector(d.x, 0));
    }

    
    isValid(vector, board) {
        return (
            this.isWithinBorder(this.getNewVector(vector), board) &&
            this.getNewVector(vector).y !== this.lastRow &&
            !board.isPieceAt(this.getNewVector(vector)) &&
            board.isPieceAt(this.getNewDelVector(vector)) &&
            board.getPieceAt(this.getNewDelVector(vector)).isWhite !== board.getPieceAt(vector).isWhite &&
            board.getPieceAt(this.getNewDelVector(vector)).enPassantVulnerable &&
            !this.isMovingThroughPieces(vector, board)
        )
    }
}

class BasePromotionPawnMove extends BasePawnMove {
    constructor(d, del_d = null, type) {
        super(d, del_d);
        this.type = type;
    }

      
    isValid(vector, board) {
        return (
            this.isWithinBorder(this.getNewVector(vector), board) &&
            this.getNewVector(vector).y === this.lastRow &&
            !board.isPieceAt(this.getNewVector(vector)) &&
            !this.isMovingThroughPieces(vector, board)
        );
    }

    doWhateverThisMoveDo(piece, board) {
        board.del(this.getNewDelVector(piece.vector));
        const tmp = this.getNewVector(piece.vector)
        board.add(new this.type(tmp.x, tmp.y, piece.isWhite));
        board.resetEnpassant(piece.isWhite);
        board.del(piece.vector);

    }
}

class TackingPromotionPawnMove extends BasePromotionPawnMove {
    constructor(d, del_d = null, type) {
        super(d, del_d, type);
    }
      
    isValid(vector, board) {
        return (
            this.isWithinBorder(this.getNewVector(vector), board) &&
            this.getNewVector(vector).y === this.lastRow &&
            board.isPieceAt(this.getNewVector(vector)) &&
            board.getPieceAt(this.getNewVector(vector)).isWhite !== board.getPieceAt(vector).isWhite &&
            !this.isMovingThroughPieces(vector, board)
        );
    }
}


export {
    Move,
    KnightMove,
    BasePawnMove,
    TackingPawnMove,
    FirstPawnMove,
    EnPassantMove,
    BasePromotionPawnMove,
    TackingPromotionPawnMove
  };