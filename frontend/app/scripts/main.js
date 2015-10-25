var canvas = new fabric.Canvas('gameCanvas');
var player;
var isAnimating = false;
var movementKeyPressed = [];
var currentMap;
var currentAction = null;
var isLoading = true;

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
var SERVER = "http://localhost:4242";
var ACTION_TYPES = {
    'SHOW_TEXT': 'showText',
    'CHANGE_MAP': 'changeMap',
    'START_MINIGAME': 'startMinigame'
};
var MINIGAMES = {
    'GUESSME': 'guessMe'
};
var TEXT_SEPARATOR = '#newline#';

$(document).ready(function () {
    loadInformationFromServer();
    window.addEventListener('keydown', handleKey);
    window.addEventListener('keyup', keyUp);
});

function loadInformationFromServer() {
    isLoading = true;
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
        isLoading = false;
    });
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

function handleKey(evt) {
    if (currentAction === null) {
        moveSelection(evt);
    } else {
        handleKeyWhileHandlingAction(evt);
    }
}

function moveSelection(evt) {
    if (isLoading) {
        return;
    }
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
                    var actionID = currentMap.getInteractionForDirection(player.direction);
                    loadActionFromServer(actionID, receiveAction);
                } else {
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
    if (isLoading) {
        return;
    }
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
            var actionID = currentMap.getInteractionForCurrentPosition();
            player.resetAnimation();
            loadActionFromServer(actionID, receiveAction);
        } else if (!(movementKeyPressed[MOVEMENT_KEYS.left] ||
            movementKeyPressed[MOVEMENT_KEYS.up] ||
            movementKeyPressed[MOVEMENT_KEYS.right] ||
            movementKeyPressed[MOVEMENT_KEYS.down])) {
            player.resetAnimation();
        }
    }
}

function loadActionFromServer(actionID, callback) {
    isLoading = true;
    $.get(SERVER.concat('/action/' + actionID), function (data) {
        receiveAction(JSON.parse(data));
    });
}

function receiveAction(action) {
    currentAction = action;
    handleCurrentAction();
}

function handleKeyWhileHandlingAction(evt) {
    if (evt.keyCode === 13) { // "Return"-Key
        if (currentAction.type !== ACTION_TYPES.START_MINIGAME) {
            handleCurrentAction();
        }
    }
}

function handleCurrentAction() {
    isLoading = false;
    switch (currentAction.type) {
        case ACTION_TYPES.SHOW_TEXT:
            updateDisplayedActionText();
            if ($('#ingameText').text().length === 0 && currentAction.content.length === 0) {
                if (currentAction.nextAction !== null && typeof currentAction.nextAction !== "undefined") {
                    loadActionFromServer(currentAction.nextAction, receiveAction);
                } else {
                    currentAction = null;
                }
            }
            break;
        case ACTION_TYPES.CHANGE_MAP:
            console.log("Should load map: " + currentAction.content);
            currentAction = null;
            loadInformationFromServer();
            break;
        case ACTION_TYPES.START_MINIGAME:
            console.log("Should start a minigame");
            startMinigame();
            break;
        default:
            console.log("Cannot handle action of type " + currentAction.type);
            break;
    }
}

function updateDisplayedActionText() {
    $('#ingameText').empty();
    var text = getNextTextSection(currentAction.content, 85);
    if (text.length < currentAction.content.length) {
        var remainingContent = currentAction.content.substring(text.length);
        currentAction.content = remainingContent;
    } else {
        currentAction.content = '';
    }
    if (text.indexOf(TEXT_SEPARATOR) > 0) {
        text = text.substring(0, text.indexOf(TEXT_SEPARATOR));
    }
    if (currentAction.content.length > 0) {
        text = text.concat(' &#x25BC;');
    }
    if (text.length > 0) {
        $('#ingameText').append(text);
    }
}

function getNextTextSection(text, maxLength) {
    var forcedSplitPos = text.indexOf(TEXT_SEPARATOR);
    if (forcedSplitPos <= 0 || forcedSplitPos > maxLength) {
        if (text.length > maxLength) {
            var splitPos = text.indexOf(' ', maxLength - 10);
            if (splitPos > 0) {
                return text.substring(0, splitPos);
            }
        }
    } else if (forcedSplitPos > 0) {
        return text.substring(0, forcedSplitPos + TEXT_SEPARATOR.length);
    }
    return text;
}

function startMinigame() {
    var miniGameInfo = JSON.parse(currentAction.content);
    var miniGameData = miniGameInfo.data;
    $('#'+miniGameInfo.name).fadeIn().removeClass('hidden');
    $('#mainGameContainer').hide();
    var miniGame = GuessMe();
    miniGame.initializeGame(miniGameData, miniGameDidFinish);
}

function miniGameDidFinish(result) {
    //TODO: handle the result
    var miniGameInfo = JSON.parse(currentAction.content);
    var miniGameData = miniGameInfo.data;
    $('#'+miniGameInfo.name).hide();
    $('#mainGameContainer').show();
    currentAction = null;
}