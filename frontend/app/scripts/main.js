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
    currentMap = Map();
    currentMap.loadFromServer(SERVER.concat("/current_map"), loadSpritesForMap);
}

function loadSpritesForMap() {
    //'http://orig06.deviantart.net/27e0/f/2011/264/f/0/monster_rpg_map_central_plains_by_monstermmorpg-d4ahvot.png'
    fabric.util.loadImage(currentMap.mapURL, function(img) {
        var instanceWidth, instanceHeight;
        instanceWidth = img.width;
        instanceHeight = img.height;

        var tileSize = instanceWidth / currentMap.getMapWidth();

        var imgInstance = new fabric.Image(img, {
                width: instanceWidth,
                height: instanceHeight,
                top: TILE_SIZE * (5 - currentMap.getCurrentPlayerPosY()), //5 because 11 is the width of the displayed map
                left: TILE_SIZE * (5 - currentMap.getCurrentPlayerPosX()),
                originX: 'left',
                originY: 'top'
            });
        imgInstance.evented = false;
        canvas.add(imgInstance);
        canvas.renderAll();
    });
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
    if (currentMap.canMoveInDirection(DIRECTION.left)) {
        goOrRotateTo(DIRECTION.left);
    }
}

function rightArrowPressed() {
    if (currentMap.canMoveInDirection(DIRECTION.right)) {
        goOrRotateTo(DIRECTION.right);
    }
}

function upArrowPressed() {
    if (currentMap.canMoveInDirection(DIRECTION.up)) {
        goOrRotateTo(DIRECTION.up);
    }
}

function downArrowPressed() {
    if (currentMap.canMoveInDirection(DIRECTION.down)) {
        goOrRotateTo(DIRECTION.down);
    }
}

function moveSelection(evt) {
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
    if (evt.keyCode >= MOVEMENT_KEYS.left && evt.keyCode <= MOVEMENT_KEYS.down) {
        movementKeyPressed[evt.keyCode] = true;
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
            animateMovement(direction);
            currentMap.playerMovesIntoDirection(direction);
        } else {
            canvas.renderAll();
            player.changeDirection(direction);
            isAnimating = false;
        }
    }
}

function animateMovement(direction, stepsToBeDone) {
    if(typeof stepsToBeDone === "undefined") {
        stepsToBeDone = TILE_SIZE;
    }
    animateBackgroundOneStep(direction);
    canvas.renderAll();
    player.animateNextStep();
    stepsToBeDone--;
    if (stepsToBeDone > 0) {
        fabric.util.requestAnimFrame(function() {
            animateMovement(direction, stepsToBeDone - 1);
        });
    } else {
        isAnimating = false;
        if (currentMap.mayInteractAtCurrentPosition()) {
            var interaction = currentMap.getInteractionForCurrentPosition();
            //TODO: get action from server and act accordingly
            canvas.renderAll();
            player.resetAnimation();
        } else if (!(movementKeyPressed[MOVEMENT_KEYS.left] ||
            movementKeyPressed[MOVEMENT_KEYS.up] ||
            movementKeyPressed[MOVEMENT_KEYS.right] ||
            movementKeyPressed[MOVEMENT_KEYS.down])) {
            canvas.renderAll();
            player.resetAnimation();
        }
    }
}

function animateBackgroundOneStep(direction) {
    //TODO: I don't know, why I have to move it 2 pixels...
    var background = canvas.getObjects()[0];
    switch (direction) {
        case DIRECTION.left:
            background.left+=2;
            break;
        case DIRECTION.up:
            background.top+=2;
            break;
        case DIRECTION.right:
            background.left-=2;
            break;
        case DIRECTION.down:
            background.top-=2;
            break;
        default:
            console.log('animateBackground does not know how to handle ' + direction);
            break;
    }
}

function handleImage(e) {
    var reader = new FileReader();
    reader.onload = function (event) {
        var img = new Image();
        img.onload = function () {

            var instanceWidth, instanceHeight;

            instanceWidth = img.width;
            instanceHeight = img.height;

            var imgInstance = new fabric.Image(img, {
                width: instanceWidth,
                height: instanceHeight,
                top: (canvas.getHeight() / 2 - instanceHeight / 2),
                left: (canvas.getWidth() / 2 - instanceWidth / 2),
                originX: 'left',
                originY: 'top'
            });
            imgInstance.evented = false;
            canvas.add(imgInstance);
            canvas.renderAll();
        };
        img.src = event.target.result;
    };
    reader.readAsDataURL(e.target.files[0]);
}