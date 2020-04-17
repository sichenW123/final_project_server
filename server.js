const express=require('express')
const app=express()
const index=require('./index')
const { Client } = require('@elastic/elasticsearch');
const client = new Client({ node: 'http://localhost:9200' });

// async function searchTitles() {
//     const { body: response } = await client.search({
//         index: 'news',
//         body: {
//             "query":{
//               "multi_match":{
//                 "query": 'guardola',
//                 "fuzziness": "auto", 
//                 "fields": ["title", "content"]
//               }
//             },
//               "sort":[
//               {"date":"desc"},
//               {"_score": { "order": "desc" }}
//               ]
          
//           }
//     });
//     return response.hits.hits
// }
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
  });
  

app.get('/api/search/date', (req, res) => {

    index.searchByDate(req.query.q, req.query.p).then((result)=>res.json(result))
    // res.json(customers);
  });

  app.get('/api/search/rel', (req, res) => {

    index.searchByRel(req.query.q, req.query.p).then((result)=>res.json(result))
    // res.json(customers);
  });
  app.get('/api/search/tag', (req, res) => {

    index.searchByTag(req.query.q, req.query.p).then((result)=>res.json(result))
    // res.json(customers);
  });
  app.get('/api/search/team', (req, res) => {

    index.searchTeam(req.query.q).then((result)=>res.json(result))
    // res.json(customers);
  });
  app.get('/api/search/team/all', (req, res) => {

    index.searchAllTeam(req.query.q).then((result)=>res.json(result))
    // res.json(customers);
  });
  app.get('/api/search/player', (req, res) => {

    index.searchPlayer(req.query.q).then((result)=>res.json(result))
    // res.json(customers);
  });
  app.get('/api/search/player/all', (req, res) => {

    index.searchPlayerAll(req.query.q).then((result)=>res.json(result))
    // res.json(customers);
  });
  app.get('/api/search/completion', (req, res) => {

    index.auto(req.query.q).then((result)=>res.json(result))
    // res.json(customers);
  });



  const port = 5000;
  console.log('started')
  app.listen(port, () => `Server running on port ${port}`);