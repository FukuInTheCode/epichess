class UIHandler {
    constructor(tilesize) {
        this.tilesize = tilesize;
        this.clientStatus = "";
    }

        
    show(sketch) {
        sketch.client.gameManager.board.show(this.tilesize, sketch);
        
        return;
    }

    updateHTMLPlayerStatus(status) {
        document.getElementById('PlayerGameStatus').innerHTML = status;
        return;
    }


}

export { UIHandler };