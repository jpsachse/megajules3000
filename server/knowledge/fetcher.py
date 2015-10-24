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
        "select ?label \
        where { \
          <" + entity + "> <http://www.w3.org/2000/01/rdf-schema#label> ?label \
          FILTER (langMatches(lang(?label),\"en\")) \
        }")
        results = self.sparql.query().convert()
        bindings = results["results"]["bindings"]
        if len(bindings) >= 1:
            return bindings[0]["label"]["value"]
        else:
            return entity


k = KnowledgeFetcher()
facts = k.get_info_for("Jules_Verne")
for fact in facts:
    o, p, s = fact
    print k.get_label_for(o) + " " + k.get_label_for(p) + " " + k.get_label_for(s)