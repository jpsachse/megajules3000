# -*- coding: utf-8 -*-

from SPARQLWrapper import SPARQLWrapper, JSON


class KnowledgeFetcher():

    def __init__(self):
        self.sparql = SPARQLWrapper("http://dbpedia.org/sparql")
        self.prefix = "http://dbpedia.org/resource/"
        self.sparql.setReturnFormat(JSON)
        self.label_cache = dict()


    def get_info_for(self, entity):
        self.sparql.setQuery("PREFIX dbp: <" + self.prefix + "> DESCRIBE dbp:" + entity)
        entity = self.prefix + entity
        results = self.sparql.query().convert()
        facts = []
        for fact in results["results"]["bindings"]:
            o, p, s = fact["o"], fact["p"], fact["s"]
            if unicode(o["value"]) == entity or unicode(s["value"]) == entity:
                try:
                    facts.append((s["value"], p["value"], o["value"]))
                except:
                    pass
        return facts


    def get_label_for(self, entity):
        if self.label_cache.has_key(entity):
            return self.label_cache.get(entity)
        self.sparql.setQuery(
        "select ?label \
        where { \
            <" + entity + "> <http://www.w3.org/2000/01/rdf-schema#label> ?label \
            FILTER (langMatches(lang(?label),\"en\")) \
        }")
        try:
            results = self.sparql.query().convert()
            bindings = results["results"]["bindings"]
            value = bindings[0]["label"]["value"]
            self.label_cache[entity] = value
            return value
        except:
            return entity


    def get_facts_for(self, entity):
        results = list()
        facts = self.get_info_for(entity)
        for fact in facts:
            o, p, s = fact
            try:
                olabel = self.get_label_for(o)
                plabel = self.get_label_for(p)
                slabel = self.get_label_for(s)
                results.append((olabel, plabel, slabel))
            except:
                continue
        return results


k = KnowledgeFetcher()
print k.get_facts_for("Jules_Verne")
