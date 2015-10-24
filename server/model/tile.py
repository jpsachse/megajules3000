SIZE = 32


class Tile():

    def __init__(self, collision=False, action=None, image=None, action_index=None):
        self.collision = collision
        self.action = action
        self.image = image
        self.action_index = action_index # ignore if action is None