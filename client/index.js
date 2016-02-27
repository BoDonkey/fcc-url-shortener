'use strict'

module.exports = function (app, db) {
app.route("/")
.get(function (req, res) {
    res.sendfile('views/index.html');
});

app.route("/new")
.get(function (req, res) {
  res.render('error', { error: 'You need to include a valid URL to be shortened'});
});
};


