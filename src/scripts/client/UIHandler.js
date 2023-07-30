class UIHandler {
    constructor() {
        this.isReversed = true;
    }

        
    show(gameManager, sketch) {
        gameManager.board.show(sketch, this.isReversed);
        return;
    }

    updateHTMLPlayerStatus(status) {
        this.clientStatus = status;
        return;
    }

    changeUsername() {
        this.username += this.username
    }


}

export { UIHandler };