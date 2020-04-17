const { Client } = require('@elastic/elasticsearch');
const client = new Client({ node: 'http://localhost:9200' });


module.exports={  
    searchByDate: async function (query, page) {
        const { body: response } = await client.search({
            index: 'news',
            body: {
                "from":(page-1)*10,
                "query":{
                  "multi_match":{
                    "query": query,
                    "fuzziness": "auto", 
                    "fields": ["title", "content"]
                  }
                },
                "highlight":{
                  "pre_tags":["<strong>"],
                  "post_tags":["</strong>"],
                  "fields": {
                    "content":{}
                  }
                },
                  "sort":[
                  {"date":"desc"},
                  {"_score": { "order": "desc" }}
                  ]
              
              }
        });
        return response.hits.hits
    }, 
    searchByRel: async function (query, page) {
        const { body: response } = await client.search({
            index: 'news',
            body: {
              "from":(page-1)*10,
              "query":{
                "multi_match":{
                  "query":query,
                  "fuzziness": "auto", 
                  "fields": ["title", "content"]
                }
              },
              "highlight":{
                "pre_tags":["<strong>"],
                "post_tags":["</strong>"],
                "fields": {
                  "content":{}
                }
              },
              "sort":[
                {"_score": { "order": "desc" }},
                {"date":"desc"}
              
              ]
            }
        });
        return response.hits.hits
    }, 
    searchByTag: async function (query, page) {
        const { body: response } = await client.search({
            index: 'news',
            body: {
              "from":(page-1)*10,
                "query":{
                  "match":{
                    "tags":{
                      "query":query
                      
                    }
                  }
                },
                "highlight":{
                  "pre_tags":["<strong>"],
                  "post_tags":["</strong>"],
                  "fields": {
                    "content":{}
                  }
                },
                  "sort":[
                    {"date":"desc"},
                    {"_score": { "order": "desc" }}
                    ]
              }
        });
        return response.hits.hits
    }, 
    searchTeam: async function (query) {
      const { body: response } = await client.search({
        index: 'teams',
        body: {
          "size":3,
          "query":{
            "multi_match":{
              "query":query,
              
              "fields": ["name", "abbr"]
            }
          }
        }
        
    });
    return response.hits.hits

    },
    searchAllTeam: async function (query) {
      const { body: response } = await client.search({
        index: 'teams',
        body: {
          "size":50,
          "query":{
            "multi_match":{
              "query":query,
              
              "fields": ["name", "abbr"]
            }
          }
        }
        
    });
    return response.hits.hits

    },
    
    searchPlayer: async function (query){
      const { body: response } = await client.search({
        index: 'players',
        body: {
          "size":3,
          "query":{
            "multi_match":{
              "query" : query,
              "fields": ["name", "last_name", "club"]
            }
          }
        }
    });
    return response.hits.hits
    },
    searchPlayerAll: async function (query){
      const { body: response } = await client.search({
        index: 'players',
        body: {
          "size":50,
          "query":{
            "multi_match":{
              "query" : query,
              
              "fields": ["name", "last_name", "club"]
            }
          }
        }
        
    });
    return response.hits.hits
    },
    autoCompleteTeam: async function(query){
      const { body: response} = await client.search({
        index: 'teams',
        body: {
          "size":5,
          "query": {
            "match_phrase_prefix": {
              "name":{
                "query":  query,
                "slop":10
              }
            }
          }
        }
    })
      return response.hits.hits
    
    }, 
    autoCompletePlayer: async function (query){
      const { body: response } = await client.search({
        index: 'players',
        body: {
          "size":5,
          "query": {
            "match_phrase_prefix": {
              "name":{
                "query": query,
                "slop":10
              }
            }
          }
        }
    })
    return response.hits.hits
  },

  auto: async function(query){
    var n1=[]
    var n2=[]
    n1= await this.autoCompletePlayer(query)
    
    n2= await this.autoCompleteTeam(query)
    
    var r=[]
    while(n1.length!==0&&n2.length!==0){
      if(n1[0]._score>n2[0]._score){
        r.push(n1[0]._source.last_name)
        n1.shift()
      }else{
        r.push(n2[0]._source.name)
        n2.shift()
      }
    }
    
    while(n1.length!==0||n2.length!==0){
      if(n1.length!==0){
        r.push(n1[0]._source.last_name)
        n1.shift()
      }else{
        r.push(n2[0]._source.name)
        n2.shift()
      }
    }
    
    
    
    Array.from(new Set(r))
    return Array.from(new Set(r))
  }


    
    
  
}

// var res
// searchTitles('guardola').then((result)=>result)
// console.log(res)
// console.log(searchTitles().catch(console.log))
// searchTitles().catch(console.log);

