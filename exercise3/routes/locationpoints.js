var express = require('express');
var router = express.Router();
const mongoClient = require('mongodb').MongoClient;


router.get('/read/:name', function (request, response, next) {
  mongoClient.connect('mongodb://127.0.0.1:27017/lab8', (err, client) => {
    if (err) throw err;
    const db = client.db('lab8');
    db.collection('Location').findOne({ 'name': request.params.name }, (err, doc) => {
      if (err) throw err;
      response.send(doc);
    });
  });
});

const getAll = function (response) {
  mongoClient.connect('mongodb://127.0.0.1:27017/lab8', (err, client) => {
    if (err) throw err;
    const db = client.db('lab8');
    let docs = [];
    let cursor = db.collection('Location').find({});
    cursor.each((err, doc) => {
      if (err) throw err;
      if (doc) {
        console.log(doc);
        docs.push(doc);
      } else {
        response.send(docs);
      }
    });
  });
}

router.get('/read', function (request, response, next) {
  getAll(response);
});

router.post('/create', function (request, response, next) {
  mongoClient.connect('mongodb://127.0.0.1:27017/lab8', (err, client) => {
    if (err) throw err;
    const db = client.db('lab8');
    db.collection('Location').insertOne(request.body, function (err, res) {
      if (err) throw err;
      console.log("1 document inserted");
      getAll(response);
    });
  });
});

router.put('/update/:name', function (request, response, next) {
  mongoClient.connect('mongodb://127.0.0.1:27017/lab8', (err, client) => {
    if (err) throw err;
    const db = client.db('lab8');
    const query = { name: request.params.name };

    db.collection('Location').updateOne(query, request.body, function (err, res) {
      if (err) throw err;
      console.log("1 document updated");
      getAll(response);
    });
  });
});

router.delete('/delete/:name', function (request, response, next) {
  mongoClient.connect('mongodb://127.0.0.1:27017/lab8', (err, client) => {
    if (err) throw err;
    const db = client.db('lab8');
    const query = { name: request.params.name };
    db.collection('Location').deleteOne(query, request.body, function (err, res) {
      if (err) throw err;
      console.log("1 document deleted");
      getAll(response);
    });
  });
});


router.get('/nearest', function (request, response, next) {
  mongoClient.connect('mongodb://127.0.0.1:27017/lab8', (err, client) => {
    if (err) throw err;
    const db = client.db('lab8');
    let docs = [];
    let cursor = db.collection('Location').find({ location: { '$near': [-91.9673635, 41.0177226] } }).limit(3);
    cursor.each((err, doc) => {
      if (err) throw err;
      if (doc) {
        console.log(doc);
        docs.push(doc);
      } else {
        response.send(docs);
      }
    });
  });
});


module.exports = router;
