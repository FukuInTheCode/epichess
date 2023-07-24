class UIHandler {
    constructor() {
        this.clientStatus = "Idling";
        this.isReversed = true;

        this.username = 'Fukumi';

        this.enemyUsername = 'Bad Player';

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