SIZE = 32


class Tile():

    def __init__(self, collision=False, image=None, action_index=None):
        self.collision = collision
        self.image = image
        self.action_index = action_index