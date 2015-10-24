function Map (options) {

    var that = {},
        currentMap,
        currentPosX = 0,
        currentPosY = 0;

    that.loadFromServer = function(url, callback) {
        $.get(url, function( data ) {
            console.log(data);
            currentMap = JSON.parse(data);
            that.mapURL = SERVER.concat(currentMap.objects);
            currentPosX = Math.ceil(currentMap["map"].length / 2) - 1;
            currentPosY = Math.ceil(currentMap["map"][0].length / 2) - 1;
            callback();
        });
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

    that.playerMovesIntoDirection = function(direction) {
        if (!that.canMoveInDirection(direction)) {
            throw "Cannot move in the direction " + direction;
        }
        switch (direction) {
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
                console.log("Cannot move in the direction " + direction);
                break;
        }
    }

    that.getCurrentPosX = function() {
        return currentPosX;
    };

    that.getCurrentPosY = function() {
        return currentPosY;
    };

    that.getMapWidth = function() {
        return currentMap["map"].length;
    };

    that.getMapHeight = function() {
        return currentMap["map"][0].length;
    };

    return that;
}