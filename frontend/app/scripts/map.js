function Map (options) {

    var PADDING = 5; //number of tiles free around the player

    var that = {},
        currentMap,
        currentPosX = 0,
        currentPosY = 0,
        currentAnimationOffsetX = 0,
        currentAnimationOffsetY = 0,
        currentAnimationDirection = -1,
        mapImage,
        mapURL;
    that.context = options.context;

    that.loadFromServer = function(url, callback) {
        $.get(url, function( data ) {
            console.log(data);
            currentMap = JSON.parse(data);
            mapURL = SERVER.concat(currentMap.objects);
            currentPosX = Math.ceil(currentMap["map"].length / 2) - 1;
            currentPosY = Math.ceil(currentMap["map"][0].length / 2) - 1;

            fabric.util.loadImage(mapURL, function(img) {
                mapImage = img;
                imageLoadedFromServer(callback);
            });
        });
    };

    function imageLoadedFromServer(callback) {
        // var imgInstance = new fabric.Image(img, {
        //         width: instanceWidth,
        //         height: instanceHeight,
        //         top: TILE_SIZE * (5 - currentMap.getCurrentPlayerPosY()), //5 because 11 is the width of the displayed map
        //         left: TILE_SIZE * (5 - currentMap.getCurrentPlayerPosX())
        //     });
        that.render();
        callback();
    }

    that.render = function() {
        var tileSize = mapImage.width / that.getMapWidth();
        var posX = currentAnimationOffsetX + tileSize * (currentPosX - PADDING);
        var posY = currentAnimationOffsetY + tileSize * (currentPosY - PADDING);
        var width = Math.min(tileSize * (2 * PADDING + 1), mapImage.width - posX);
        var height = Math.min(tileSize * (2 * PADDING + 1), mapImage.height - posY);
        var offsetX = 0;
        var offsetY = 0;
        if (posX < 0) {
            offsetX = -posX;
            posX = 0;
        }
        if (posY < 0) {
            offsetY = -posY;
            posY = 0;
        }

        that.context.clearRect(0,0,mapImage.width, mapImage.height);

        that.context.drawImage(
            mapImage,
            posX,
            posY,
            width,
            height,
            offsetX,
            offsetY,
            width,
            height
           );
    };

    that.canMoveInDirection = function(direction) {
        var mapInfo = currentMap["map"];
        if (mapInfo.length <= currentPosX || mapInfo[0].length <= currentPosY) {
            return false;
        }
        switch (direction) {
            case DIRECTION.left:
                return !mapInfo[currentPosX - 1][currentPosY].c;
                break;
            case DIRECTION.up:
                return !mapInfo[currentPosX][currentPosY - 1].c;
                break;
            case DIRECTION.right:
                return !mapInfo[currentPosX + 1][currentPosY].c;
                break;
            case DIRECTION.down:
                return !mapInfo[currentPosX][currentPosY + 1].c;
                break;
            default:
                console.log("canMoveInDirection cannot cope with direcion " + direction);
                return false;
                break;
        }
    };

    that.playerStartsMovingInDirection = function(direction) {
        if (!that.canMoveInDirection(direction)) {
            throw "Cannot move in the direction " + direction;
        }
        currentAnimationOffsetX = 0;
        currentAnimationOffsetY = 0;
        currentAnimationDirection = direction;
    };

    that.animateNextStep = function() {
        var tileSize = mapImage.width / that.getMapWidth();
        switch (currentAnimationDirection) {
            case DIRECTION.left:
                currentAnimationOffsetX-=2;
                break;
            case DIRECTION.up:
                currentAnimationOffsetY-=2;
                break;
            case DIRECTION.right:
                currentAnimationOffsetX+=2;
                break;
            case DIRECTION.down:
                currentAnimationOffsetY+=2;
                break;
            default:
                console.log("Cannot move in the direction " + currentAnimationDirection);
                break;
        }
        that.render();
    };

    that.playerDidFinishMoving = function() {
        switch (currentAnimationDirection) {
            case DIRECTION.left:
                currentPosX--;
                break;
            case DIRECTION.up:
                currentPosY--;
                break;
            case DIRECTION.right:
                currentPosX++;
                break;
            case DIRECTION.down:
                currentPosY++;
                break;
            default:
                console.log("Cannot move in the direction " + currentAnimationDirection);
                break;
        }
        currentAnimationOffsetX = 0;
        currentAnimationOffsetY = 0;
        currentAnimationDirection = -1;
        that.render();
    };

    that.getCurrentPlayerPosX = function() {
        return currentPosX;
    };

    that.getCurrentPlayerPosY = function() {
        return currentPosY;
    };

    that.getMapWidth = function() {
        return currentMap["map"].length;
    };

    that.getMapHeight = function() {
        return currentMap["map"][0].length;
    };

    that.mayInteractInDirection = function(direction) {
        switch (direction) {
            case DIRECTION.left:
                return this.mayInteractAtPosition(currentPosX - 1, currentPosY);
                break;
            case DIRECTION.up:
                return this.mayInteractAtPosition(currentPosX, currentPosY - 1);
                break;
            case DIRECTION.right:
                return this.mayInteractAtPosition(currentPosX + 1, currentPosY);
                break;
            case DIRECTION.down:
                return this.mayInteractAtPosition(currentPosX, currentPosY + 1);
                break;
            default:
                console.log("mayInteractInDirection cannot cope with " + direction);
                return false;
                break;
        }
    };

    that.getInteractionForDirection = function(direction) {
        switch (direction) {
            case DIRECTION.left:
                return this.getInteractionForPosition(currentPosX - 1, currentPosY);
                break;
            case DIRECTION.up:
                return this.getInteractionForPosition(currentPosX, currentPosY - 1);
                break;
            case DIRECTION.right:
                return this.getInteractionForPosition(currentPosX + 1, currentPosY);
                break;
            case DIRECTION.down:
                return this.getInteractionForPosition(currentPosX, currentPosY + 1);
                break;
            default:
                console.log("getInteractionForDirection cannot cope with " + direction);
                return false;
                break;
        }
    };

    that.mayInteractAtCurrentPosition = function() {
        return this.mayInteractAtPosition(currentPosX, currentPosY);
    };

    that.mayInteractAtPosition = function(posX, posY) {
        if (posX < 0 || posY < 0 || posX >= currentMap["map"] || posY >= currentMap["map"][0]) {
            return false;
        }
        var interaction = that.getInteractionForPosition(posX, posY);
        return interaction !== null && typeof interaction != "undefined";
    };

    that.getInteractionForCurrentPosition = function() {
        return that.getInteractionForPosition(currentPosX, currentPosY);
    };

    that.getInteractionForPosition = function(posX, posY) {
        return currentMap["map"][posX][posY].a;
    };

    return that;
}