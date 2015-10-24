class Action():
    def __init__(self, type="", next_action=None, content=""):
        self.type = type
        self.next_action = next_action
        self.content = content