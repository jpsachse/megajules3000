from tile import Tile, SIZE as tile_size
from PIL import Image

class TileMap():

    def __init__(self, width, height, name="No Name"):
        self.name = name
        self.matrix = list()
        self.generate_matrix(width, height)

    def generate_matrix(self, width, height):
        self.width = width
        self.height = height
        for w in range(0, width):
            self.matrix.append([Tile() for h in range(0, height)])

    def as_image(self):
        complete_image = Image.new("RGBA", 
                                (tile_size*self.width, 
                                tile_size*self.height))                        
        for w in range(0, self.width):
            for h in range(0, self.height):
                current_tile = self.matrix[w][h]
                current_tile_im = Image.open("mock/"+current_tile.image)
                box = (w*tile_size, h*tile_size) # upper left corner
                complete_image.paste(current_tile_im, box)
        return complete_image
    
    def as_collision_map(self):
        complete_collision_map = list()
        for w in range(0, self.width):
            complete_collision_map.append([])
            for h in range(0, self.height):
                current_tile = self.matrix[w][h]
                current_collision = {
                    "c": current_tile.collision,
                    "a": current_tile.action
                }
                complete_collision_map[w].append(current_collision)
        return complete_collision_map