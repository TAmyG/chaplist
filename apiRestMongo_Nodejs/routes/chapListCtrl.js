//File: routes/tvshows.js
//module.exports = function(app) {
var TVShow = require('../models/mysqlConn.js');
var mysqlConnection = require('../models/mysqlConn.js');

/*GET-------------------------------------------------------------------------------------------------------------*/
//GET_LISTAS(IN USR INT)
exports.getLists =  function( req, res){
    var data = req.params;
    console.log('GET - /login');
    mysqlConnection.getConnection(function(err, connection){
        if (connection){
            mysqlConnection.query('CALL GET_LISTAS(?)', [data.userId], function(error, result){
                if(error)
                    res.send(error);
                else
                    res.send(result[0]);         
            });        
            
        }
        console.log('release');
        connection.release();
    });
};

//GET - Return all tvshows in the DB
exports.findAllTVShows = function(req, res) {
TVShow.find(function(err, tvshows) {
    if(!err) {
    console.log('GET /tvshows')
        res.send(tvshows);
    } else {
        console.log('ERROR: ' + err);
    }
});
};

//GET - Return a TVShow with specified ID
exports.findById = function(req, res) {
TVShow.findById(req.params.id, function(err, tvshow) {
    if(!err) {
    console.log('GET /tvshow/' + req.params.id);
        res.send(tvshow);
    } else {
        console.log('ERROR: ' + err);
    }
});
};
/*POST-------------------------------------------------------------------------------------------------------------*/
//LOGIN(IN COR VARCHAR(45),IN PASSW VARCHAR(45),NIC VARCHAR(45))
//POST - Login to action for the app
exports.login =  function( req, res){
    var data = req.body;
    console.log('POST - /login');
    mysqlConnection.getConnection(function(err, connection){
        if (connection){
            mysqlConnection.query('CALL LOGIN(?,?,?)', [data.correo, data.pass ,data.nick], function(error, result){
                if(error)
                    res.send(error);
                else
                    res.send(result[0]);         
            });        
            
        }
        console.log('release');
        connection.release();
    });
};

//POST - Insert a new user in the DB
exports.addUser = function(req, res) {
    var userData = req.body;
    console.log('POST - /user');
    mysqlConnection.getConnection(function(err, connection){
        if (connection){
            mysqlConnection.query('CALL CREAR_USUARIO(?,?,?,?,?,?,?)', 
                                  [userData.nombre,userData.correo,
                                   userData.pass,userData.nacimiento,
                                   userData.nick,userData.sexo,
                                   userData.apellido], function(error, result){
                if(error)
                    res.send(error);
                else
                    res.send(result);         
            });        
        }
        console.log('release');
        connection.release();
    });    
};
//CREATE PROCEDURE CREAR_LISTA(IN NOM VARCHAR(45),IN DES VARCHAR(100),FEC VARCHAR(45),IN USR INT)
//POST - Insert a new list in the DB
exports.addList =  function( req, res){
    var data = req.body;
    console.log('POST - /list');
    mysqlConnection.getConnection(function(err, connection){
        if (connection){
            mysqlConnection.query('CALL CREAR_LISTA(?,?,?,?)', [data.name, data.description, data.date, data.userId ], function(error, result){
                if(error)
                    res.send(error);
                else
                    res.send(result);         
            });        
            
        }
        console.log('release');
        connection.release();
    });
};

//PUT - Update a register already exists
exports.updateTVShow = function(req, res) {
    TVShow.findById(req.params.id, function(err, tvshow) {
        tvshow.title   = req.body.petId;
        tvshow.year    = req.body.year;
        tvshow.country = req.body.country;
        tvshow.poster  = req.body.poster;
        tvshow.seasons = req.body.seasons;
        tvshow.genre   = req.body.genre;
        tvshow.summary = req.body.summary;

        tvshow.save(function(err) {
            if(!err) {
                console.log('Updated');
            } else {
                console.log('ERROR: ' + err);
            }
            res.send(tvshow);
        });
    });
}

//DELETE - Delete a TVShow with specified ID
exports.deleteTVShow = function(req, res) {
    TVShow.findById(req.params.id, function(err, tvshow) {
        tvshow.remove(function(err) {
            if(!err) {
                console.log('Removed');
            } else {
                console.log('ERROR: ' + err);
            }
        })
    });
}