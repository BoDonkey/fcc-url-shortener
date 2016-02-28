'use strict';

module.exports = function(app, db){
    var http = require('http'),
    shortid = require('shortid'),
    validUrl = require('valid-url');

    
    app.get('/new/:url*', procURL);
    app.get('/http://:url*', longCheckDB);
    app.get('/:url', checkDB);
    
    
    function checkDB(req, res) {
        var theURL = process.env.APP_URL + (req.params.url);
        var finalParam = (req.params.url);
        if (theURL != process.env.APP_URL) {
            findURL(theURL, finalParam, db, res);
        }
    }
    
    function findURL(theURL, finalParam, db, res){
        var sites = db.collection('websites');
        var urlHolder = {};
        sites.findOne({
            "shortened": theURL
        }, function(err, result){
            if (err) throw err;
            if(result){
                res.redirect(result.fullength);
            } else {
                urlHolder = 'That site does not exist in the database';
                res.render('error', { error: urlHolder});
            }
        });
    }
    

    function longCheckDB(req, res) {
        var sites = db.collection('websites'),
        addOnOne = 'http://',
        addOnTwo = 'https://',
        theURLOne = addOnOne + req.params.url,
        theURLTwo = addOnTwo + req.params.url,
        urlHolder = {};
        sites.findOne({
            "fullength": theURLOne
        }, function(err, results) {
            if (err) throw err;
            if (results) {
                urlHolder = {
                    "fullength": theURLOne,
                    "shortened": results.shortened
                };
                res.send(urlHolder);
            }
            else {
                sites.findOne({
                    "fullength": theURLTwo
                }, function(err, results) {
                    if (err) throw err;
                    if (results) {
                        urlHolder = {
                            "fullength": theURLTwo,
                            "shortened": results.shortened
                        };
                        res.send(urlHolder);
                    } else {
                      urlHolder = "Site does not exist in the database, please prefix with '/new/' to add it" ;
                      res.render('error', { error: urlHolder});  
                  }
              });
            }
        });
    }
    
    function procURL(req, res){
        var theURL = (req.url.slice(5)).toString(),
        urlHolder={},
        sites = db.collection('websites');
        sites.findOne({
            "fullength": theURL
        }, function(err, results) {
            if (err) throw err;
            if (results) {
                var message = "This site is already in the database"; 
                res.render('error', { error: message});
            } else {
                if (validateURL(theURL)){
                    urlHolder = {
                        "fullength": theURL,
                        "shortened": process.env.APP_URL + shortName()
                    };
                    res.send(urlHolder);
                    dbUpdate(urlHolder, db);
                } else {
                    urlHolder = "No link generated-URL is invalid: " + theURL;
                    res.render('error', { error: urlHolder});
                }
            }
        });
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