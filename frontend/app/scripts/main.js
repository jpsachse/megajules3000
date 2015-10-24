var canvas = new fabric.Canvas('gameCanvas');
var player;
var isAnimating = false;

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
//http://www.williammalone.com/articles/create-html5-canvas-javascript-sprite-animation/images/coin-sprite-animation-sprite-sheet.png
    fabric.util.loadImage('http://www.williammalone.com/articles/create-html5-canvas-javascript-sprite-animation/images/coin-sprite-animation-sprite-sheet.png', function(img) {
        player = Player({
            context: canvas.getContext("2d"),
            width: 440,
            height: 40,
            image: img,
            numberOfFrames: 10,
            ticksPerFrame: 6
        });
    });

    window.addEventListener('keydown', moveSelection);
});

function doStuff() {
    canvas.renderAll();
}

function leftArrowPressed() {
    if (!isAnimating) {
        isAnimating = true;
        animateMovement('left');
    }
}

function rightArrowPressed() {
    if (!isAnimating) {
        isAnimating = true;
        animateMovement('right');
    }
}

function upArrowPressed() {
    if (!isAnimating) {
        isAnimating = true;
        animateMovement('up');
    }
}

function downArrowPressed() {
    if (!isAnimating) {
        isAnimating = true;
        animateMovement('down');
    }
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
        case 'left':
            background.left++;
            break;
        case 'up':
            background.top++;
            break;
        case 'right':
            background.left--;
            break;
        case 'down':
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