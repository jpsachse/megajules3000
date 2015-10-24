var DEFAULT_SERVER = "http://localhost:4242/";
var parsedObject;

function init() {
	$.get(DEFAULT_SERVER + "current_map", function(mapJSON) {
		parsedObject = $.parseJSON(mapJSON);
		//collisionMap = parsedObject.map;
		//surfaceMapPath = parsedObject.objects;


	});
}

function getMapImage() {
	$.get(DEFAULT_SERVER + parsedObject.objects, function(image) {
		return image;
	});
}

function isCollision(x, y) {
	//return if this field is walkable
	return $.parseJSON(parsedObject.map[x][y]).c;
}

function checkAction(x, y) {
	//returns action id, null otherwise
	return $.parseJSON(parsedObject.map[x][y]).a;
}

