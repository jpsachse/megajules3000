import json

from model.tilemap import TileMap
from model.tile import Tile
from model.action import Action


class MockGenerator:

    def generate_map(self, map_file):
        with open(map_file) as f:
            map = json.load(f)
            width = len(map["map"])
            height = len(map["map"][0])

            result = TileMap(width, height)
            result.actions = []
            current_action_index=0
            for w in range(0, width):
                for h in range(0, height):
                    tile_type = map["map"][h][w]
                    tile = map["tiles"][str(tile_type)]
                    tile_action_type = tile.get("action")
                    new_action=None                    
                    if tile_action_type:          
                        new_action = Action(tile_action_type,content=tile["content"])
                        result.actions.append(new_action)
                        current_action_index +=1
                    result.matrix[w][h] = Tile(image=tile["image"]
                        , collision=tile["collision"]
                        , action=new_action
                        , action_index=current_action_index) 
            return result
