# -*- coding: utf-8 -*-

from SPARQLWrapper import SPARQLWrapper, JSON


class KnowledgeFetcher():

    def __init__(self):
        pass


    def get_info_for(self, entity):
        sparql = SPARQLWrapper("http://dbpedia.org/sparql")
        prefix = "http://dbpedia.org/resource/"
        sparql.setQuery("PREFIX dbp: <" + prefix + "> DESCRIBE dbp:" + entity)
        entity = prefix + entity
        sparql.setReturnFormat(JSON)
        results = sparql.query().convert()
        facts = []
        for fact in results["results"]["bindings"]:
            o, p, s = fact["o"], fact["p"], fact["s"]
            if unicode(o["value"]) == entity:
                try:
                    print unicode(s["value"]) + "  " + unicode(o["value"]) + "  " + unicode(p["value"])
                except:
                    pass


KnowledgeFetcher().get_info_for("Jules_Verne")