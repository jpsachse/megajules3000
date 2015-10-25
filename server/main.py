import json
import random

from flask import Flask, url_for
from flask.ext.cors import CORS

from map_manager import MapManager

app = Flask(__name__)
CORS(app)

map_manager = MapManager(map_directory="maps/", initial_map="Alabastia")

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
    elif action.type == "startMinigame":
        if action.content["name"] == "guessMe":
            facts = {}
            print action.content
            for entity in action.content["entities"]:
                facts[entity] = []
                temp_facts = map_manager.knowledge_fetcher.get_filtered_facts_for(entity)
                for i in range(10):
                    if len(temp_facts) > 0:
                        pos = random.randint(0, len(temp_facts) - 1)
                        facts[entity].append(temp_facts.pop(pos))
            action.content["solutions"] = []
            action.content["facts"] = []
            for entity, entity_facts in facts.iteritems():
                name = map_manager.knowledge_fetcher.get_label_for(entity)
                print name
                action.content["solutions"].append(name)
                action.content["facts"].append(entity_facts)
    return json.dumps(action.__dict__)

@app.route('/minigame/<action_id>/<result>')
def evaluate_minigame(action_id, result):
    action = map_manager.current_map.actions[int(action_id)]
    next_action = map_manager.current_map.actions[action.next_action]
    print result
    if int(result) > 0: #TODO: real evaluation
        if next_action.type == "changeMap":
            map_manager.change_map_by_name(next_action.content)
            return json.dumps(next_action.__dict__)
        else:
            raise Exception("There shall be a changeMap after a minigame!")
    else:
        return json.dumps(next_action.__dict__)

if __name__ == '__main__':
    app.run(port=4242, debug=True)