var express         = require("express"),
    app             = express(),
    bodyParser      = require("body-parser"),
    methodOverride  = require("method-override");

// Middlewares
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(methodOverride());

app.get('/', function(req, res) {
  res.send("Hello world!");
});

var routes = require('./routes/chapListCtrl');//(app)

app.get('/tvshow', routes.findAllTVShows);
app.get('/tvshow/:id', routes.findById);
app.get('/list/:userId', routes.getLists);
/*POST*/
app.post('/user', routes.addUser);
app.post('/login', routes.login);
app.post('/list', routes.addList);
/*PUT*/
app.put('/tvshow/:id', routes.updateTVShow);
/*DELETE*/
app.delete('/tvshow/:id', routes.deleteTVShow);

// Start server
app.listen(3000, function() {
  console.log("Node server running on http://localhost:3000");
});