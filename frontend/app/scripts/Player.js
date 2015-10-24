function Player (options) {

    var that = {};

    that.context = options.context;
    that.width = options.width;
    that.height = options.height;
    that.image = options.image;
    that.direction = options.direction || DIRECTION.right;
    var numberOfFrames = options.numberOfFrames || 1;
    var frameIndex = 0;
    var tickCount = 0;
    var ticksPerFrame = options.ticksPerFrame || 0;

    that.render = function () {

        // Clear the canvas
        //that.context.clearRect(0, 0, that.width, that.height);
        // Draw the animation
        that.context.drawImage(
           that.image,
           frameIndex * that.width / numberOfFrames,
           0,
           that.width / numberOfFrames,
           that.height,
           0,
           0,
           that.width / numberOfFrames,
           that.height);
        console.log("render");
    };

    that.update = function () {

        tickCount += 1;

        if (tickCount > ticksPerFrame) {

            tickCount = 0;

            // Go to the next frame
            frameIndex += 1;
            frameIndex %= 4;
        }
    };


    that.setImage = function(image) {
        that.image = image;
    };

    that.animateNextStep = function() {
        that.update()
        that.render();
    }

    that.resetAnimation = function() {
        frameIndex = 0;
        tickCount = 0;
        that.render();
    }

    that.changeDirection = function(newDirection) {
        frameIndex = 0;
        tickCount = 0;
        that.direction = newDirection;
        that.render();
    }

    return that;
}