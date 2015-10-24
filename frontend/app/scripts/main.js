var canvas = new fabric.Canvas('gameCanvas');
var player;
var isAnimating = false;
var movementKeyPressed = [];
var currentMap;

var DIRECTION = {
    'left': 0,
    'up': 1,
    'right': 2,
    'down': 3
};
var TILE_SIZE = 32;
var MOVEMENT_KEYS = {
    'left': 37,
    'up':   38,
    'right':39,
    'down': 40
};
var SERVER = "http://127.0.0.1:4242";

$(document).ready(function () {
    loadInformationFromServer();
    window.addEventListener('keydown', moveSelection);
    window.addEventListener('keyup', keyUp);
});

function loadInformationFromServer() {
    currentMap = Map({
        context: canvas.getContext("2d")
    });
    currentMap.loadFromServer(SERVER.concat("/current_map"), loadSpritesForPlayer);
}

function loadSpritesForPlayer() {
//http://www.williammalone.com/articles/create-html5-canvas-javascript-sprite-animation/images/coin-sprite-animation-sprite-sheet.png
    fabric.util.loadImage('images/sprites/player.png', function(img) {
        player = Player({
            context: canvas.getContext("2d"),
            width: TILE_SIZE * 2,
            height: TILE_SIZE * 4,
            image: img,
            numberOfFrames: 2,
            ticksPerFrame: 10,
            posX: canvas.getWidth() / 2,
            posY: canvas.getHeight() / 2
        });
        player.render();
    });
}

function doStuff() {
    canvas.renderAll();
}

function leftArrowPressed() {
    goOrRotateTo(DIRECTION.left);
}

function rightArrowPressed() {
    goOrRotateTo(DIRECTION.right);
}

function upArrowPressed() {
    goOrRotateTo(DIRECTION.up);
}

function downArrowPressed() {
    goOrRotateTo(DIRECTION.down);
}

function moveSelection(evt) {
    if (evt.keyCode >= MOVEMENT_KEYS.left && evt.keyCode <= MOVEMENT_KEYS.down) {
        movementKeyPressed[evt.keyCode] = true;
    }
    switch (evt.keyCode) {
        case MOVEMENT_KEYS.left:
            leftArrowPressed();
            break;
        case MOVEMENT_KEYS.right:
            rightArrowPressed();
            break;
        case MOVEMENT_KEYS.up:
            upArrowPressed();
            break;
        case MOVEMENT_KEYS.down:
            downArrowPressed();
            break;
        case 13: //return
            if (!currentMap.canMoveInDirection(player.direction)) {
                if (currentMap.mayInteractInDirection(player.direction)) {
                    console.log("Found an interaction.");
                    var action = currentMap.getInteractionForDirection(player.direction);
                    //TODO: get action from server and act accordingly
                } else {
                    console.log("No interaction found.");
                }
            }
            break;
    }
};

function keyUp(evt) {
    if (evt.keyCode >= MOVEMENT_KEYS.left && evt.keyCode <= MOVEMENT_KEYS.down) {
        movementKeyPressed[evt.keyCode] = false;
    }
}

function goOrRotateTo(direction) {
    if (!isAnimating) {
        isAnimating = true;
        if (player.direction === direction) {
            if (currentMap.canMoveInDirection(direction)) {
                currentMap.playerStartsMovingInDirection(direction);
                animateMovement(direction);
            } else {
                isAnimating = false;
            }
        } else {
            currentMap.render();
            player.changeDirection(direction);
            isAnimating = false;
            window.setTimeout(function() {
                if (movementKeyPressed[MOVEMENT_KEYS.left]) {
                    goOrRotateTo(DIRECTION.left);
                } else if (movementKeyPressed[MOVEMENT_KEYS.up]) {
                    goOrRotateTo(DIRECTION.up);
                } else if (movementKeyPressed[MOVEMENT_KEYS.right]) {
                    goOrRotateTo(DIRECTION.right);
                } else if (movementKeyPressed[MOVEMENT_KEYS.down]) {
                    goOrRotateTo(DIRECTION.down);
                }
            }, 100);
        }
    }
}

function animateMovement(direction, stepsToBeDone) {
    if(typeof stepsToBeDone === "undefined") {
        stepsToBeDone = TILE_SIZE;
    }
    currentMap.animateNextStep();
    player.animateNextStep();
    if (stepsToBeDone > 0) {
        fabric.util.requestAnimFrame(function() {
            animateMovement(direction, stepsToBeDone - 2);
        });
    } else {
        isAnimating = false;
        currentMap.playerDidFinishMoving();
        player.render();
        if (currentMap.mayInteractAtCurrentPosition()) {
            console.log("Interaction found at current position!!!");
            var interaction = currentMap.getInteractionForCurrentPosition();
            //TODO: get action from server and act accordingly
            player.resetAnimation();
        } else if (!(movementKeyPressed[MOVEMENT_KEYS.left] ||
            movementKeyPressed[MOVEMENT_KEYS.up] ||
            movementKeyPressed[MOVEMENT_KEYS.right] ||
            movementKeyPressed[MOVEMENT_KEYS.down])) {
            player.resetAnimation();
        }
    }
}