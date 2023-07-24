import { createVector } from './vector';

const boardSize = 8;

class Move {
    constructor(d, del_d = null) {
        this.d = d;
        this.del_xy = this.d
        if (del_d != null) this.del_xy = del_d;
        this.directionVector = createVector(this.d.x / Math.abs(this.d.x), this.d.y / Math.abs(this.d.y));
        if (isNaN(this.directionVector.y)) this.directionVector.y = 0;
        if (isNaN(this.directionVector.x)) this.directionVector.x = 0; 

        this.isCastleMove = false;
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
        piece.firstMove = false;
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

    getAlgebraicNotation(piece, board) {
        let AlgebraicNotation = String.fromCharCode(104 - this.getNewVector(piece.vector).x) + (this.getNewVector(piece.vector).y + 1).toString();

        let prefix = this.getAlgebraicNotationPrefix(piece, board);
        let suffix = this.getAlgebraicNotationSuffix(piece, board);

        return (prefix + AlgebraicNotation + suffix);

    }

    getAlgebraicNotationSuffix(piece, board) {
        let suffix = '';

        let tmpAdditionBoolean = {
            check: false,
            checkmate: false
        }

        let tmpBoardCloned = board.clone();

        this.doWhateverThisMoveDo(tmpBoardCloned.getPieceAt(piece.vector), tmpBoardCloned);

        if(tmpBoardCloned.isCheckmated(!piece.isWhite)) tmpAdditionBoolean.checkmate = true;
        else if(tmpBoardCloned.getPiecesByTeamAndLetter(!piece.isWhite, 'K')[0].isAttacked(tmpBoardCloned)) tmpAdditionBoolean.check = true;

        if(tmpAdditionBoolean.checkmate) suffix = suffix.concat('#');
        else if(tmpAdditionBoolean.check) suffix = suffix.concat('+');

        return suffix;
    }

    // Certified too long but idc :)
    getAlgebraicNotationPrefix(piece, board) {
        let prefix;
        if(piece.letter === 'p') prefix = '';
        else prefix = piece.letter;

        let tmpAdditionBoolean = {
            x: false,
            y: false,
            take: false
        }

        let tmpPieceVectorWithSameMove = [];
        for(const p of board.getPiecesByTeamAndLetter(piece.isWhite, piece.letter).filter(p => !p.vector.equals(piece.vector))) {
            // eslint-disable-next-line
            for(const move of p.getValidMoves(this.getNewVector(piece.vector), board)) tmpPieceVectorWithSameMove.push(p.vector);
        }

        for(const vector of tmpPieceVectorWithSameMove) {
            if(vector.x === piece.vector.x) tmpAdditionBoolean.y = true;
            else if (vector.y === piece.vector.y) tmpAdditionBoolean.x = true;
            else if(!tmpAdditionBoolean.x && !tmpAdditionBoolean.y) tmpAdditionBoolean.x = true;
        }

        if(board.isPieceAt(this.getNewDelVector(piece.vector))) tmpAdditionBoolean.take = true;

        if(tmpAdditionBoolean.x) prefix = prefix.concat(String.fromCharCode(104 - piece.vector.x));
        if(tmpAdditionBoolean.y) prefix = prefix.concat((piece.vector.y+1).toString());
        if(piece.letter === 'p' && tmpAdditionBoolean.take) prefix = prefix.concat(String.fromCharCode(104 - piece.vector.x), 'x');
        else if(tmpAdditionBoolean.take) prefix = prefix.concat('x');



        return prefix;
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

class ShortCastle extends Move {
    constructor(d, del_d = null) {
        super(d, del_d);
        this.isCastleMove = true;
    }

    isValid(vector, board) {

        let tmpKing = board.getPieceAt(vector).clone(board.imgs);
        tmpKing.vector = tmpKing.vector.add(this.directionVector);

        return (
            this.isWithinBorder(this.getNewVector(vector), board) &&
            !this.isMovingThroughPieces(vector, board) &&
            board.getPieceAt(vector).letter === 'K' &&
            board.getPieceAt(vector).firstMove &&
            !board.getPieceAt(vector).isAttacked(board) &&
            !tmpKing.isAttacked(board) &&
            board.isPieceAt(createVector(board.size - 1, vector.y)) &&
            board.getPieceAt(createVector(board.size - 1, vector.y)).letter === 'R' &&
            board.getPieceAt(createVector(board.size - 1, vector.y)).firstMove

        )
    }

    doWhateverThisMoveDo(piece, board) {
        board.del(this.getNewDelVector(piece.vector));
        piece.vector = this.getNewVector(piece.vector);
        piece.firstMove = false;
        board.getPieceAt(createVector(board.size -1, piece.vector.y)).firstMove = false;
        board.getPieceAt(createVector(board.size -1, piece.vector.y)).vector = createVector(piece.vector.x - 1 , piece.vector.y);
        board.resetEnpassant(piece.isWhite);
    }

    // eslint-disable-next-line
    getAlgebraicNotation(piece, board) {
        return 'O-O';
    }
}


class LongCastle extends ShortCastle {
    constructor(d, del_d = null) {
        super(d, del_d);
    }

    isValid(vector, board) {

        let tmpKing = board.getPieceAt(vector).clone(board.imgs);
        tmpKing.vector = tmpKing.vector.add(this.directionVector);

        return (
            this.isWithinBorder(this.getNewVector(vector), board) &&
            !this.isMovingThroughPieces(vector, board) &&
            board.getPieceAt(vector).letter === 'K' &&
            board.getPieceAt(vector).firstMove &&
            !board.getPieceAt(vector).isAttacked(board) &&
            !tmpKing.isAttacked(board) &&
            board.isPieceAt(createVector(0, vector.y)) &&
            board.getPieceAt(createVector(0, vector.y)).letter === 'R' &&
            board.getPieceAt(createVector(0, vector.y)).firstMove

        )
    }

    doWhateverThisMoveDo(piece, board) {
        board.del(this.getNewDelVector(piece.vector));
        piece.vector = this.getNewVector(piece.vector);
        piece.firstMove = false;
        board.getPieceAt(createVector(0, piece.vector.y)).firstMove = false;
        board.getPieceAt(createVector(0, piece.vector.y)).vector = createVector(piece.vector.x + 1 , piece.vector.y);
        board.resetEnpassant(piece.isWhite);
    }


    // eslint-disable-next-line
    getAlgebraicNotation(piece, board) {
        return 'O-O-O';
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
    TackingPromotionPawnMove,
    ShortCastle,
    LongCastle
  };
