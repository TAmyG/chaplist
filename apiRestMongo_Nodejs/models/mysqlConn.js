//llamamos al paquete mysql que hemos instalado
var mysql = require('mysql'),
//creamos la conexion a nuestra base de datos con los datos de acceso de cada uno
connection = mysql.createPool(
    { 
        host: 'localhost', 
        user: 'root',  
        password: 'root', 
        database: 'ChapList_DB'
    }
);

module.exports = connection;