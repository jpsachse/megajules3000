from tile import Tile


class TileMap():

    def __init__(self, width, height, name="No Name"):
        self.name = name
        self.matrix = list()
        self.generate_matrix(width, height)

    def generate_matrix(self, width, height):
        for w in range(0, width):
            self.matrix.append([Tile() for h in range(0, height)])

    def as_image(self):
        pass