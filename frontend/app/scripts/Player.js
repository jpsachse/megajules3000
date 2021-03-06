function Player (options) {

    var that = {};

    that.context = options.context;
    that.width = options.width;
    that.height = options.height;
    that.image = options.image;
    that.direction = options.direction || DIRECTION.down;
    that.posX = options.posX || 0;
    that.posY = options.posY || 0;
    var numberOfFrames = options.numberOfFrames || 1;
    var frameIndex = 0;
    var tickCount = 0;
    var ticksPerFrame = options.ticksPerFrame || 0;

    that.render = function () {
        that.context.drawImage(
           that.image,
           frameIndex * that.width / numberOfFrames,
           that.direction * that.height / 4,
           that.width / numberOfFrames,
           that.height / 4,
           that.posX - that.width / numberOfFrames / 2,
           that.posY - that.height / 8,
           that.width / numberOfFrames,
           that.height / 4);
    };

    that.update = function () {

        tickCount += 2;

        if (tickCount > ticksPerFrame) {

            tickCount = 0;

            // Go to the next frame
            frameIndex += 1;
            frameIndex %= numberOfFrames;
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