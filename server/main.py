import json

from flask import Flask, url_for
from flask.ext.cors import CORS

from map_manager import MapManager

app = Flask(__name__)
CORS(app)

map_manager = MapManager(map_directory="maps/", initial_map="Alabastia")
map_manager.change_map_by_name("Big_City_House2")

@app.route('/current_map')
def get_map():
    map = map_manager.current_map
    response = dict()
    if map.startX >= 0:
        response['startX'] = map.startX
    if map.startY >= 0:
        response['startY'] = map.startY
    response["name"] = map.name
    map.as_image(map_manager.directory).save("static/" + map.name + ".png")
    response["objects"] = url_for('static', filename=map.name+'.png')
    response["map"] = map.as_collision_map()
    return json.dumps(response)

@app.route('/action/<action_id>')
def show_user_profile(action_id):
    action = map_manager.current_map.actions[int(action_id)]
    if action.type == "changeMap":
        map_manager.change_map_by_name(action.content)
    elif action.type == "showFact" and action.content == "":
        try: 
            action.content = map_manager.takeFactFromCurrentLevel()
        except IndexError:
            action.content = "Nothing interesting (Pool of facts is empty.)"
    return json.dumps(action.__dict__)


if __name__ == '__main__':
    app.run(port=4242, debug=True)