var express         = require("express"),
    app             = express(),
    bodyParser      = require("body-parser"),
    methodOverride  = require("method-override"),
    mongoose        = require('mongoose');

// Connection to DB
mongoose.connect('mongodb://localhost/tvshows', function(err, res) {
  if(err) throw err;
  console.log('Connected to Database');
});

// Middlewares
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(methodOverride());

app.get('/', function(req, res) {
  res.send("Hello world!");
});

var routes = require('./routes/tvshows');//(app);

app.get('/tvshow', routes.findAllTVShows);
app.get('/tvshow/:id', routes.findById);
app.post('/tvshow', routes.addTVShow);
app.put('/tvshow/:id', routes.updateTVShow);
app.delete('/tvshow/:id', routes.deleteTVShow);

// Start server
app.listen(3000, function() {
  console.log("Node server running on http://localhost:3000");
});