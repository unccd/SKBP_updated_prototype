var config = {
    "url": "http://81.143.99.157/solrproxy/fw",
    "collectionName": "unccd",
    "searchHandler": "select",
    "highlightsDir": "highlights",

    "autocompleteHandler": "terms",
  "sorts" : ["Relevance", "Source", "Language", "Format", "Published"],
  "sortsMap" : {"Relevance": "score desc",
    "Source": "source asc",
    "Language": "langname asc",
    "Format": "format asc",
    "Published": "published desc"},
  "rows": ["10", "20", "50", "100"],
  "partnerLogos":{
        "AGRIS":"logo-agris",
        "CSIC":"logo-csic",
        "ISRIC":"logo-isric",
        "TECA":"logo-teca",
        "WOCAT":"logo-wocat"
    },
    "multipleFacets":["source", "partnername", "langname"]
  
}
