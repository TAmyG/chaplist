angular.module('starter')

.service('servicioWeb', function($http, $q, localStorageService){
    var key = 'userKey';    
    var listKey = 'listKey';    
    var result = {};
    var isAuthenticated = false;
    var isList = false;
    var listName;
    var listDescription;
    var listId;
    var username;
    var userId;   
    var pattern = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    var deferred = $q.defer();//retorna la promesa de la respuesta
    this.acList = [];//listas correspondientes al suario
    this.resultPromise;
    
    
    
    
    /*Funciones de uso temporal-----------------*/
     function updateLocalStorage(){
        localStorageService.set(key, this.acList);
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
                    if(result.data[0]){
                        if(result.data[0].idusuario !== '-1'){
                            storeUserCredentials({nick: result.data[0].nick,
                                                   id: result.data[0].idusuario});
                            callback( {
                                title : '<h1>Bienvenido!!</h1>',
                                state : true,
                                msj : 'Hola: '+result.data[0].nick,
                                nick : result.data[0].nick
                            })                             
                        }else{
                            callback( {
                                title : '<h1>Error!!</h1>',
                                state : false,
                                msj : 'Credenciales incorrectas!!',
                            })
                        }
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
                            msj : 'Error al agregar la lista'
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
            );
        }
    }
 
    
    //función que obtiene las listas correspondientes a un usuario desde la API0
    this.getListDB = function(tipo, callback){
        var params = {};
        var link = '';
        console.log(tipo);
        if(isAuthenticated){
            if(tipo == 1) //mis listas
                link= 'https://chaplist-tamy-g.c9.io/list/'+userId;            
            else if(tipo == 2)//compartidas conmigo
                link= 'https://chaplist-tamy-g.c9.io/shareList/'+userId;
            
            $http.get(link)
            .success(function(data) {
               callback(data);
            })
            .error(function(data) {
                console.log(data,'Error getListDB');
            });                
        }else
            console.log('no está autenticado');
    }
    
    //función para eliminar las listas de un usuario
    this.deleteListDB = function(data, callback){
        data.listId,data.userId
        if(isAuthenticated){
            $http.delete('https://chaplist-tamy-g.c9.io/list/'+data.idlistas+'/user/'+userId).then(
                function(result){
                    console.log(result);
                    callback(result);
                },function(err){                    
                    console.log(err);
                    callback(err);
                }
            );            
        }else
            console.log('no auth deleteListDB');
    }
    
    //función que permite compartir la lista actual con un usuario cualquiera
    this.shareListDB = function(data,callback){
        var jsonShare = {};
        if(isAuthenticated && isList){
            jsonShare = {
                user: data.n,
                idList: listId                
            };
            $http.post('https://chaplist-tamy-g.c9.io/shareList',jsonShare).then(
                function(result){
                    //1062 dup entry
                    //1452 no existe
                    if(result.data.errno){
                        if(result.data.errno == 1452)
                            callback( {
                                title : '<h1>Error</h1>',
                                msj : 'Lista no compartida, puede que no exista el usuario o sus datos sean incorrectos'
                            })
                        else if(result.data.errno == 1062)
                            callback( {
                                title : '<h1>Error</h1>',
                                msj : 'Ya se encuentra compartida con el usuario: <h1>'+data.n+'</h1>'
                            })                        
                    }else
                        callback( {
                            title : '<h1>Hecho</h1>',
                            msj : 'Lista compartida con: <h1>'+data.n+'</h1>'
                        })
                },function(err){                    
                    callback( {
                            title : '<h1>Error</h1>',
                            msj : 'Petición no procesada'
                        });
                }
            );         
        }else
            console.log('shareListDB Error');
    }
    
    this.getListName = function(){
        return listName;
    }
    
    this.getListDescription = function(){
        return listDescription;
    }
    /*-----------------------AREA DE PRODUCTOS--------------------*/    
    /*----------------------------------------------------------------------*/
    /*----------------------------------------------------------------------*/
    this.getAllProductDB = function(callback){
        if(isAuthenticated && isList){
            $http.get('https://chaplist-tamy-g.c9.io/product/0').then(
                function(result){
                    if(result.data)
                        callback(result.data);
                    else
                        callback([]);                    
                },function(err){
                    callback([]);
                    console.log(err);
                }
            );  
        }else
            console.log('getProductDB, no auth o islis',isAuthenticated,isList);
    }  
    
    
    /*-----------------------AREA DE FUNCIONES GENERICAS--------------------*/
    /*----------------------------------------------------------------------*/
    /*----------------------------------------------------------------------*/
    
    //Guarda las credenciales del ususario (nick, id) en el almacenamiento
    //local con localStorage
    function storeUserCredentials(token) {           
        localStorageService.set(key, token);
        useCredentials(token);
      }
    
    //Guarda las credenciales de una lista en el almacenamiento
    //local con localStorage
    this.storeListCredentials = function(list) {      
        localStorageService.set(listKey, list);
        listCredentials(list);
    }
    //funcion para setear las credenciales de la lista actual, en variables
    //locales para la manipulación de los demás procesos
    function listCredentials(list) {
        isList = true;
        listName = list.nombre;
        listDescription = list.descripcion;
        listId = list.idlistas;
    }
    
    //funcion para setear las credenciales del usuario, en variables
    //locales para la manipulación de los demás procesos
    function useCredentials(token) {
        username = token.nick;
        isAuthenticated = true;
        userId = token.id;
    }
    
    //función para destruir una sesión
   this.destroyUserCredentials = function() {
        username = '';
        isAuthenticated = false;
        userId = '';
        isList = false;
        listName = '';
        listId = '';
        localStorageService.remove(key);
        localStorageService.remove(listKey);
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