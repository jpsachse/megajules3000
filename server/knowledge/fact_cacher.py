import json, sys

from fetcher import KnowledgeFetcher


class FactCacher():

    def __init__(self):
        self.fetcher = KnowledgeFetcher()


    def cache(self, entity):
        self.fetcher.get_filtered_facts_for(entity)
        with open(KnowledgeFetcher.FACT_CACHE_FILE, "w") as f:
            json.dump(self.fetcher.facts_cache, f)


    def cache_all(self, entities):
        for entity in entities:
            self.cache(entity)


if __name__ == "__main__":
    args = sys.argv[1:]
    FactCacher().cache_all(args)
