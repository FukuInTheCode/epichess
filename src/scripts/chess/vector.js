function createVector(x, y) {
    return new Vector(x, y);
}

class Vector {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    equals(vector) {
        return (
            this.x === vector.x &&
            this.y === vector.y
        )
    }
} 

export { createVector };