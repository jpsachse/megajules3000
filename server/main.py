import json

from flask import Flask, url_for
from flask.ext.cors import CORS

from mapmanager import MapManager

app = Flask(__name__)
CORS(app)

map_manager = MapManager(map_directory="maps/")
map_manager.change_map(0)

@app.route('/current_map')
def get_map():
    map = map_manager.current_map
    response = dict()
    response["name"] = map.name
    map.as_image(map_manager.directory).save("static/" + map.name + ".png")
    response["objects"] = url_for('static', filename=map.name+'.png')
    response["map"] = map.as_collision_map()
    return json.dumps(response)


if __name__ == '__main__':
    app.run(port=4242, debug=True)