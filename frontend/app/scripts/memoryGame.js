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
    var flippedTiles = [];
    var isWaiting = false;

    //cons
    var NUM_COLS = 5;
    var NUM_ROWS = 4;
    var MARGIN_TILES = 10;
    var WIDTH = Math.floor(canvas.getWidth()/ NUM_COLS - MARGIN_TILES);
    var numFlipped = 0;
    
    var Tile = function(x, y, face) {
        this.x = x;
        this.y = y;
        this.face = face;
    };

    function render(x, y, face) {
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

    Tile.prototype.isUnderMouse = function(x, y) {
        return x >= this.x && x <= this.x + WIDTH  &&
            y >= this.y && y <= this.y + WIDTH;
    };

    Tile.prototype.drawFaceDown = function() {
        render(this.x, this.y, 'images/Game_Jam_2.png');
    };

    Tile.prototype.drawFaceUp = function() {
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

    function mouseClicked(mouseX, mouseY) {
        if (!isWaiting) {
            for (var i = 0; i < tiles.length; i++) {
                if (numFlipped < 2 && tiles[i].isUnderMouse(mouseX, mouseY)) {
                    tiles[i].drawFaceUp();
                    flippedTiles.push(tiles[i]);
                    numFlipped++;
                }
                else
                {
                    if ($.inArray(tiles[i], flippedTiles) !== -1) {
                        tiles[i].drawFaceUp();
                    } else {
                        tiles[i].drawFaceDown();
                    }
                }
                if (numFlipped === 2) {
                    isWaiting = true;
                    window.setTimeout(function() {
                        if (flippedTiles[0].face === flippedTiles[1].face) {
                            tiles.splice(tiles.indexOf(flippedTiles[0]), 1);
                            tiles.splice(tiles.indexOf(flippedTiles[1]), 1);
                        }
                        
                        for (var k = 0; k < tiles.length; k++) {
                            tiles[k].drawFaceDown();
                        }
                        
                        flippedTiles = [];
                        numFlipped = 0;
                        isWaiting = false;
                    }, 2000);
                    //break;
                }
            }
        }
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

    canvas.on('mouse:down', function(options) {
        console.log(options.e.layerX, options.e.layerY);
        mouseClicked(options.e.layerX, options.e.layerY);
    });

    return that;


}