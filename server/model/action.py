class Action():
    def __init__(self, id=-1, type="", next_action=None, content=""):
        self.type = type
        self.next_action = next_action
        self.content = content
        self.id = id