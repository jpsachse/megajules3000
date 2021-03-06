import os.path
import random

from map_generator import MapGenerator
from knowledge.fetcher import KnowledgeFetcher


class MapManager():

    def __init__(self, initial_map, map_directory="maps/"):
        self.directory = map_directory
        self.current_map = None
        self.maps = self.retrieve_maps()
        self.knowledge_fetcher = KnowledgeFetcher()
        self.knowledgePool = {}
        if type(initial_map) == int:
            self.change_map_by_index(initial_map)
        else:
            self.change_map_by_name(initial_map)

    def retrieve_maps(self):
        if self.directory == None or not os.path.exists(self.directory):
            raise Exception("Invalid maps directory")

        result = list()
        generator = MapGenerator()
        for map_file in os.listdir(self.directory):
            if map_file.endswith(".json"):
                map_path = self.directory + map_file
                map = generator.generate_map(map_path)
                map.name = map_file.replace(".json", "")
                result.append(map)
        return result

    def get_map_by_index(self, index):
        return self.maps[index]

    def get_map_by_name(self, map_name):
        for map in self.maps:
            if map.name == map_name:
                return map

    def takeFactFromCurrentLevel(self):
        if not self.current_map.entity in self.knowledgePool:
            self.knowledgePool[self.current_map.entity] = self.knowledge_fetcher.get_filtered_facts_for(self.current_map.entity)
        index = random.randint(0, len(self.knowledgePool[self.current_map.entity]))
        return self.knowledgePool[self.current_map.entity].pop(index)

    def change_map_by_index(self, index):
        self.current_map = self.maps[index]

    def change_map_by_name(self, name):
        self.current_map = self.get_map_by_name(name)
