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


    def get_formatted_facts_for(self, entity, label):
        facts = list()
        raw_facts = self.get_facts_for(entity)
        for raw_fact in raw_facts:
            fact = "%s %s %s" % raw_fact
            fact = fact.replace(label, "").strip()
            facts.append(fact)
        return facts


    @staticmethod
    def accepts(fact):
        return len(fact) > 10 and \
            len(fact.split("/")) < 3 and \
            not ("influences" in fact) and \
            not ("abstract" in fact)


    def get_filtered_facts_for(self, entity):
        try:
            label = self.get_label_for(self.prefix + entity)
        except:
            return
        facts = list()
        for raw_fact in self.get_formatted_facts_for(entity, label):
            if KnowledgeFetcher.accepts(raw_fact):
                facts.append(raw_fact)
        return facts

