'use strict';

const PORT = process.env.PORT || 3001;
const dbUrl = "mongodb://localhost:27017/";
const dbName = "localDB";

const express = require("express");
const MongoClient = require("mongodb").MongoClient;

const app = express();
const mongoClient = new MongoClient(dbUrl);

const bodyParser = require('body-parser');
const cors = require('cors');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.options('*', cors());

app.get("/", (request, response) => {
  response.end("Hello. It is valid route "/" working");
});

app.get("/inn", (request, response) => {
  console.log('On this route we see a list of inn')
  mongoClient.connect((error, client) => {
    if (!error) {
      const db = client.db(dbName);
      const collection = db.collection("inn");

      collection.find({ "name": "inn" }).toArray((error, results) => {
        if (error) {
	  console.error('Smth wrong', error)
          return;
        }

        response.send(results);
        response.sendStatus(200);
        client.close();
      });
    } else {
      console.error('Smth wrong. Error', error)

      response.sendStatus(500);
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server is on ${PORT} port`);
});
