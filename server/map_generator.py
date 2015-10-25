import json

from model.tilemap import TileMap
from model.tile import Tile
from model.action import Action


class MapGenerator:

    def generate_map(self, map_file):
        with open(map_file) as f:
            map = json.load(f)
            height = len(map["map"])
            width = len(map["map"][0])

            if 'startX' in map and 'startY' in map:
                result = TileMap(width, height, "No Name", map["startX"], map["startY"])
            else:
                result = TileMap(width, height)
            result.entity = map["entity"]
            result.actions = []
            current_action_index = 0
            for h in range(0, height):
                for w in range(0, width):
                    tile_type = map["map"][h][w]
                    tile = map["tiles"][str(tile_type)]
                    tile_action_type = tile.get("action")
                    if tile_action_type:
                        new_action = Action(id=current_action_index, type=tile_action_type, content=tile["content"])
                        result.actions.append(new_action)
                        result.matrix[h][w] = Tile(image=tile["image"]
                                                   , collision=tile["collision"]
                                                   , action_index=current_action_index)
                        current_action_index += 1
                        next_action_tile = tile.get("next_action")
                        previous_action_object = new_action
                        while next_action_tile:
                            previous_action_object.next_action = current_action_index
                            new_action_object = Action(id=current_action_index, type=next_action_tile["action"], content=next_action_tile["content"])
                            result.actions.append(new_action_object)
                            current_action_index += 1
                            previous_action_object  = new_action_object
                            next_action_tile = next_action_tile.get("next_action")
                    else:
                        result.matrix[h][w] = Tile(image=tile["image"]
                                                   , collision=tile["collision"]
                                                   , action_index=None)
            return result
