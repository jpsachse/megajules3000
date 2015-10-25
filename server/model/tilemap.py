from tile import Tile, SIZE as tile_size
from PIL import Image

class TileMap():

    def __init__(self, width, height, name="No Name", startX = -1, startY = -1):
        self.name = name
        self.matrix = list()
        self.actions = list()
        self.facts = ["I'm a fact. A default fact."]
        self.generate_matrix(width, height)
        self.startX = startX
        self.startY = startY

    def generate_matrix(self, width, height):
        self.width = width
        self.height = height
        for h in range(0, height):
            self.matrix.append([Tile() for w in range(0, width)])

    def as_image(self, root_directory):
        complete_image = Image.new("RGBA",
                                (tile_size*self.width,
                                tile_size*self.height))
        for w in range(0, self.width):
            for h in range(0, self.height):
                current_tile = self.matrix[h][w]
                current_tile_im = Image.open(root_directory + current_tile.image)
                box = (w*tile_size, h*tile_size) # upper left corner
                complete_image.paste(current_tile_im, box)
        return complete_image

    def as_collision_map(self):
        complete_collision_map = list()
        for w in range(0, self.width):
            complete_collision_map.append([])
            for h in range(0, self.height):
                current_tile = self.matrix[h][w]
                current_collision = {
                    "c": current_tile.collision,
                    "a": current_tile.action_index
                }
                complete_collision_map[w].append(current_collision)
        return complete_collision_map