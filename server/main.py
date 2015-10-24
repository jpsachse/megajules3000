import json

from flask import Flask
from flask.ext.cors import CORS

from mapmanager import MapManager

app = Flask(__name__)
CORS(app)

map_manager = MapManager(map_directory="maps/", initial_map="Paris.json")

@app.route('/current_map')
def get_map():
    response = dict()
    response["name"] = "Sample"
    response["objects"] = "{}"
    response["map"] = "[[{}, {}], [{}, {}]]"
    return json.dumps(response)


if __name__ == '__main__':
    app.run(port=4242, debug=True)