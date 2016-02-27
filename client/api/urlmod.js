'use strict';

module.exports = function(app, db){
    var http = require('http'),
        shortid = require('shortid'),
        validUrl = require('valid-url');

    app.route('/:url').get(checkDB);
    
    app.get('/new/:url*', procURL);
    
    function checkDB(req, res) {
        var theURL = process.env.APP_URL + req.params.url;
        if (theURL != process.env.APP_URL) {
            findURL(theURL, db, res);
        }
    }
    
    function findURL(theURL, db, res){
        var sites = db.collection('websites');
        sites.findOne({
            "shortened": theURL
        }, function(err, result){
            if (err) throw err;
            if(result){
                res.redirect(result.fullength);
            } else {
                res.send('That site does not exist in the database');
            }
        });
    }
    
    function procURL(req, res){
        var theURL = req.url.slice(5);
        var urlHolder={};
        if (validateURL(theURL)){
            urlHolder = {
                "fullength": theURL,
                "shortened": process.env.APP_URL + shortName()
            };
            res.send(urlHolder);
            dbUpdate(urlHolder, db);
            } else {
                urlHolder = {
                    "error": "No link generated-URL is invalid: " + theURL
                };
                res.send(urlHolder);
            }
        }
        
    function dbUpdate (urlHolder, db) {
        var sites = db.collection('websites');
        sites.save(urlHolder, function(err, result){
            if (err) throw err;
        });
    }    
    
    function validateURL(theURL){
       if(validUrl.isUri(theURL)){
           return true;
       } else {
           return false;
       }
     }
       
       function shortName(){
           var tempID = shortid.generate();
           return tempID;
       }
    
    
};