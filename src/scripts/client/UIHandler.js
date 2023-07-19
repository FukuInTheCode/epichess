class UIHandler {
    constructor(tilesize) {
        this.tilesize = tilesize;
        this.clientStatus = "";
    }

        
    show(client, sketch) {
        client.gameManager.board.show(this.tilesize, sketch);
        
        return;
    }

    updateHTMLPlayerStatus(client, status) {
        client.clientStatus = status;
        return;
    }


}

export { UIHandler };