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

            if 'startX' in map and 'startY' in map:
                result = TileMap(width, height, "No Name", map["startX"], map["startY"])
            else:
                result = TileMap(width, height)
            result.entity = map["entity"]
            result.actions = []
            current_action_index = 0
            for w in range(0, width):
                for h in range(0, height):
                    tile_type = map["map"][h][w]
                    tile = map["tiles"][str(tile_type)]
                    tile_action_type = tile.get("action")
                    if tile_action_type:
                        new_index = current_action_index
                        new_action = Action(id=new_index, type=tile_action_type, content=tile["content"])
                        result.actions.append(new_action)
                        result.matrix[w][h] = Tile(image=tile["image"]
                                                   , collision=tile["collision"]
                                                   , action_index=new_index)
                        current_action_index += 1
                        next_action = tile.get("next_action")
                        previous_action = new_action
                        while next_action:
                            new_index = current_action_index
                            previous_action.next_action = new_index
                            result.actions.append(Action(id=new_index, type=tile_action_type, content=tile["content"]))
                            current_action_index += 1
                            previous_action = next_action
                            next_action = next_action.get("next_action")
                    else:
                        result.matrix[w][h] = Tile(image=tile["image"]
                                                   , collision=tile["collision"]
                                                   , action_index=None)
            return result
