var canvas = new fabric.Canvas('gameCanvas');
var player;
var isAnimating = false;

var DIRECTION = {
    'left': 0,
    'up': 1,
    'right': 2,
    'down': 3
};

$(document).ready(function () {
    // var imageLoader = document.getElementById('imageLoader');
    // imageLoader.addEventListener('change', handleImage, false);
    fabric.util.loadImage('http://orig06.deviantart.net/27e0/f/2011/264/f/0/monster_rpg_map_central_plains_by_monstermmorpg-d4ahvot.png', function(img) {
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
    });

    fabric.util.loadImage('http://www.williammalone.com/articles/create-html5-canvas-javascript-sprite-animation/images/coin-sprite-animation-sprite-sheet.png', function(img) {
        player = Player({
            context: canvas.getContext("2d"),
            width: 440,
            height: 40,
            image: img,
            numberOfFrames: 10,
            ticksPerFrame: 6
        });
        player.render();
    });

    window.addEventListener('keydown', moveSelection);
});

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
    switch (evt.keyCode) {
        case 37:
            leftArrowPressed();
            break;
        case 39:
            rightArrowPressed();
            break;
        case 38:
            upArrowPressed();
            break;
        case 40:
            downArrowPressed();
            break;
    }
};

function goOrRotateTo(direction) {
    if (!isAnimating) {
        isAnimating = true;
        if (player.direction === direction) {
            animateMovement(direction);
        } else {
            player.changeDirection(direction);
            isAnimating = false;
        }
    }
}

function animateMovement(direction, stepsToBeDone) {
    if(typeof stepsToBeDone === "undefined") {
        stepsToBeDone = 50;
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
        canvas.renderAll();
        player.resetAnimation();
    }
}

function animateBackgroundOneStep(direction) {
    var background = canvas.getObjects()[0];
    switch (direction) {
        case DIRECTION.left:
            background.left++;
            break;
        case DIRECTION.up:
            background.top++;
            break;
        case DIRECTION.right:
            background.left--;
            break;
        case DIRECTION.down:
            background.top--;
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