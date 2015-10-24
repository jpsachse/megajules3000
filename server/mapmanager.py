import os.path

from mock_generator import MockGenerator


class MapManager():

    def __init__(self, map_directory="maps/", initial_map=None):
        self.directory = map_directory
        self.current_map = initial_map
        self.maps = self.retrieve_maps()


    def retrieve_maps(self):
        if self.directory == None or not os.path.exists(self.directory):
            raise Exception("Invalid maps directory")

        generator = MockGenerator()
        for map_file in os.listdir(self.directory):
            if map_file.endswith(".json"):
                map_path = self.directory + map_file
                map_path.replace(".json", "")
                map = generator.generate_map(map_path)
                map.name = map_file
                self.maps.append(map)


    def get_map(self, index):
        return self.maps[index]
