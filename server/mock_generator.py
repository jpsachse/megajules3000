import json

from model.tilemap import TileMap
from model.tile import Tile


class MockGenerator:

    def __init__(self, filename):
        self.filename = filename

    def generate(self):
        with open(self.filename) as f:
            map = json.load(f)
            width = len(map["map"])
            height = len(map["map"][0])

            result = TileMap(width, height)
            for w in range(0, width):
                for h in range(0, height):
                    tile_type = map["map"][w][h]
                    tile = map["tiles"][str(tile_type)]
                    result.matrix[w][h] = Tile(image=tile["image"], collision=tile["collision"])
            return result
