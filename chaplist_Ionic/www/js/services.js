angular.module('starter')

.service('servicioWeb', function($http, localStorageService){
    var key = 'userKey';    
    var result = {};
    var isAuthenticated = false;
    var username;
    var userId;    
    var authToken;
    var pattern = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    
    this.acLists = [];//listas correspondientes al suario
    
    /*Funciones de uso temporal-----------------*/
    this.updateLocalStorage = function(){
        localStorageService.set(this.key, this.listUsers);
    }
     
    /*-----------------------AREA DE USUARIOS------------------------------*/
    /*----------------------------------------------------------------------*/
    /*----------------------------------------------------------------------*/
    //función utilizada para la autenticación
    this.login = function(data, callback){
        this.initFlags();        
        var jsonData = {
                    correo : data.username,
                    pass   : data.password,
        };
        if(data.username == undefined || data.password == undefined){
            callback( {
                title : '<h1>Error</h1>',
                state : false,
                msj : 'Campos vacios!',
            });
        }else{            
            $http.post('https://chaplist-tamy-g.c9.io/login',jsonData).then(
                function(result){
                    console.log('result');
                    if(result.data[0].idusuario !== '-1'){
                        callback( {
                            title : '<h1>Bienvenido!!</h1>',
                            state : true,
                            msj : 'Hola: '+result.data[0].nick,
                            nick : result.data[0].nick
                        })
                         storeUserCredentials({nick: result.data[0].nick,
                                               id: result.data[0].idusuario});
                    }else{
                        callback( {
                            title : '<h1>Error!!</h1>',
                            state : false,
                            msj : 'Credenciales incorrectas!!',
                        })
                    }
                }, function(err){
                    console.log(err);
                    callback( {
                        title : '<h1>Error</h1>',
                        state : false,
                        msj : 'No se puede realizar la petición'
                    })
                }
            );
        }
    }
    
    //función para agregar nuevos usuarios, con sus validaciones
    this.registerUser =  function(data, callback){
        this.initFlags();
        var newUser = {};
        if (data.fecha == undefined || data.name == undefined || data.lastName == undefined
            || data.email == undefined || data.pass1 == undefined || data.pass2 == undefined
            || data.sexo == undefined){
            badMessage('No se permiten campos vacíos<br>','Error');
            callback(result);
        }else{
            if(data.pass1.length < 6){
                badMessage('La contraseña debe tener por lo menos 6 caracteres<br>','Error');
                callback(result);
            }else if(data.pass1 !== data.pass2){
                badMessage('Contraseñas no coinciden<br>','Error');
                callback(result);
            }else if(!pattern.test(data.email)){
                badMessage('Ingrese un email válido!<br>','Error');
                callback(result);
            }else{
                jsonNewUser = {
                    nombre: data.name,
                    apellido: data.lastName,
                    correo: data.email,
                    pass:data.pass1,
                    nacimiento: this.convertDate(data.fecha),
                    nick:data.username,
                    sexo: data.sexo
                }
                $http.post('https://chaplist-tamy-g.c9.io/user',jsonNewUser).then(
                    function(result){
                        if(result.data.errno)
                            callback( {
                                title : '<h1>Error</h1>',
                                state : false,
                                msj : 'Usuario o Email ya existen'
                            })                                                           
                        else
                            callback( {
                                title : '<h1>Felicidades</h1>',
                                state : true,
                                msj : 'Usuario creado con éxito'
                            })
                    }, function(err){
                            callback( {
                                title : '<h1>Error</h1>',
                                state : false,
                                msj : 'Petición no enviada'
                            })                          
                    }
                );                
            }               
        }      
    }
    
    /*-----------------------AREA DE CRUD LISTAS----------------------------*/
    /*----------------------------------------------------------------------*/
    /*----------------------------------------------------------------------*/
    
    //función para agregar una nueva lista al usuario autenticado
    this.addList = function(name, time, description, callback){
        var jsonNewLsit = {};
        if(isAuthenticated){
            jsonNewLsit = {
                name: name,
                description: description,
                date: time,
                userId: userId,
            };
            console.log(jsonNewLsit);
             $http.post('https://chaplist-tamy-g.c9.io/list',jsonNewLsit).then(
                function(result){
                    if(result.data.errno)
                        callback( {
                            title : '<h1>Error</h1>',
                            state : false,
                            msj : 'Lista ya existe'
                        })
                    else
                        callback( {
                            state : true
                        })
                }, function(err){
                        callback( {
                            title : '<h1>Error</h1>',
                            state : false,
                            msj : 'Petición no enviada'
                        })
                }
            )    
        }
    }
    
    //función que obtiene las listas correspondientes a un usuario
    this.getList = function(callback){
        var params = {};
        if(isAuthenticated){
            params = {
                userId: userId
            };
            $http.get('https://chaplist-tamy-g.c9.io/list/'+userId)
            .success(function(data) {                
                this.acLists = data;
                callback( data);
                
            })
            .error(function(data) {
                console.log(data);
            });    
        }else
            console.log('no está autenticado');
    }
    
    /*-----------------------AREA DE FUNCIONES GENERICAS--------------------*/
    /*----------------------------------------------------------------------*/
    /*----------------------------------------------------------------------*/
    
    //Guarda las credenciales del ususario (nick, id) en el almacenamiento
    //local con localStorage
    function storeUserCredentials(token) {      
        localStorage.setItem(key, token);
        useCredentials(token);
      }
    
    //funcion para setear las credenciales del usuario, en variables
    //locales para la manipulación de los demás procesos
    function useCredentials(token) {
        username = token.nick;
        isAuthenticated = true;
        userId = token.id;
        authToken = token;
    }
    
    //función para destruir una sesión
   function destroyUserCredentials() {
        authToken = undefined;
        username = '';
        isAuthenticated = false;
        userId = '';
        localStorage.removeItem(key);
      } //**********************************************************************************
    this.initFlags = function(){
        result.title = '';
        result.msj = '';
        result.state = true;
        result.nick = '';
        result.userId = 0;
    }
    
    //convertir formato de fecha dd-mm-yyyy
    this.convertDate =  function(inputFormat) {
          function pad(s) { return (s < 10) ? '0' + s : s; }
          var d = new Date(inputFormat);
          return [pad(d.getDate()), 
                  pad(d.getMonth()+1), 
                  d.getFullYear()].join('/');                    
    }
    
    function badMessage (description,title){
        result.state = false;
        result.title = '<h1>'+title+'</h1>';
        result.msj   = description;
    }
});