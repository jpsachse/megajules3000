import json

from model.tilemap import TileMap
from model.tile import Tile


class MockGenerator:

    def generate_map(self, map_file):
        with open(map_file) as f:
            map = json.load(f)
            width = len(map["map"])
            height = len(map["map"][0])

            result = TileMap(width, height)
            for w in range(0, width):
                for h in range(0, height):
                    tile_type = map["map"][h][w]
                    tile = map["tiles"][str(tile_type)]
                    tile_action = tile.get("action")
                    result.matrix[w][h] = Tile(image=tile["image"], collision=tile["collision"], action=tile.get("action"))
            return result
