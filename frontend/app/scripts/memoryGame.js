$(document).ready(function () {
    var game = MemoryGame();
    game.initializeGame(['images/Game_Jam.png', 'images/Game_Jam.png', 'images/Game_Jam.png', 'images/Game_Jam.png', 'images/Game_Jam.png', 'images/Game_Jam.png', 'images/Game_Jam.png', 'images/Game_Jam.png', 'images/Game_Jam.png', 'images/Game_Jam.png'],
     function() {});
});

function MemoryGame() {
    var that = {};

    that.callback = null;
    var canvas = new fabric.Canvas('memoryGameCanvas');

    var tiles = [];

    //cons
    var NUM_COLS = 5;
    var NUM_ROWS = 4;
    var MARGIN_TILES = 10;
    var WIDTH = Math.floor(canvas.getWidth()/ NUM_COLS - MARGIN_TILES);
    
    var Tile = function(x, y, face) {
        var image;
        this.x = x;
        this.y = y;
        this.face = face;
    };

    function render(x, y, face) {
        console.log(WIDTH);
        fabric.util.loadImage(face, function(img) {
                canvas.getContext("2d").drawImage(
                    img,
                    x,
                    y,
                    WIDTH,
                    WIDTH
                   );
            });
    }

    Tile.prototype.drawFaceDown = function() {
        console.log(this.y);
        render(this.x, this.y, this.face);
    };

    function getFaceOrder(facePath){
        var order = [];
        for (var i = 0; i < (NUM_COLS * NUM_ROWS / 2); i++) {
            // Randomly pick one from the array of facePath
            var randomInd = Math.floor(Math.random(facePath.length));
            var face = facePath[randomInd];
            // Push 2 copies onto array
            order.push(face);
            order.push(face);
            // Remove from data array so we don't re-pick
            facePath.splice(randomInd, 1);
        }

        order.sort(function() {
            return 0.5 - Math.random(1);
        });

        return order;
    }

    function createTiles(order) {
        
    }

    that.initializeGame = function(data, callback) {
        that.callback = callback;

        var order = getFaceOrder(data);
        for (var i = 0; i < NUM_COLS; i++) {
            for (var j = 0; j < NUM_ROWS; j++) {
                tiles.push(new Tile(i * (WIDTH + MARGIN_TILES) + 10, (WIDTH + MARGIN_TILES) * j + 40, order.pop()));
            }
        }

        for (var k = 0; k < tiles.length; k++) {
            tiles[k].drawFaceDown();
        }
        
    };

    return that;


}