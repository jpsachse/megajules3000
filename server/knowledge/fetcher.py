# -*- coding: utf-8 -*-

from SPARQLWrapper import SPARQLWrapper, JSON


class KnowledgeFetcher():

    def __init__(self):
        self.sparql = SPARQLWrapper("http://dbpedia.org/sparql")
        self.prefix = "http://dbpedia.org/resource/"
        self.sparql.setReturnFormat(JSON)


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
        self.sparql.setQuery(
        "   PREFIX dbp: <" + self.prefix + "> \
            select ?label \
            where { \
              <http://dbpedia.org/resource/" + entity + "> <http://www.w3.org/2000/01/rdf-schema#label> ?label \
              FILTER (langMatches(lang(?label),\"en\")) \
            }")
        results = self.sparql.query().convert()
        return results["results"]["bindings"][0]["label"]["value"]


print KnowledgeFetcher().get_label_for("Cottbus")