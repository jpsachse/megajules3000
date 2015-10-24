from tile import Tile


class TileMap():

    def __init__(self, width, height):
        self.matrix = list()
        for w in range(0, width):
            self.matrix.append([Tile() for h in range(0, height)])

    def as_image(self):
        pass