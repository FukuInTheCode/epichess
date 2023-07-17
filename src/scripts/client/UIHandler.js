class UIHandler {
    constructor(tilesize) {
        this.tilesize = tilesize;
    }

        
    show(sketch) {


        sketch.client.gameManager.board.show(this.tilesize, sketch);
        
        return;
    }

    updateHTMLPlayerStatus(status) {
        document.getElementById('playerGameStatus').innerHTML = status;
        return;
    }


}

export { UIHandler };