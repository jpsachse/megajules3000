SIZE = 32


class Tile():

    def __init__(self, collision=False, action=None, image=None):
        self.collision = collision
        self.action = action
        self.image = image