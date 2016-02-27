'use strict';

var express = require('express'),
    errorHandler = require('errorhandler'),
    path = require('path'),
    http = require('http'),
    mongo = require('mongodb'),
    shortid = require('shortid'),
    routes = require('./client/routes/index.js'),
    api = require('./client/api/urlmod.js'),
    app = express();
   
require('dotenv').config({
  silent: true
});

mongo.MongoClient.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/url-shortener', function(err, db) {

  if (err) {
    throw new Error('Database failed to connect!');
  } else {
    console.log('Successfully connected to MongoDB on port 27017.');
  }

app.set('view engine', 'ejs');  
app.set('views', path.join(__dirname, 'views'));

app.use(errorHandler({
  dumpExceptions: true,
  showStack: true
}));

routes(app, db);
api(app, db);

var port = process.env.PORT || 8080;
app.listen(port,  function () {
	console.log('Node.js listening on port ' + port + '...');
});
});


