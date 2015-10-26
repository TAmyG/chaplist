var arrayUser=[{
        username: 'usuario',
        password: '1234',
        list: [{
                    n:'testList',
                    d: 'Productos varios',
                    t: '16/10/2015'
               }]
    }]

var userActual

angular.module('starter')

/*------------------------------------------------------------------------------------*/
.controller('AppCtrl', function() {})

.controller('ListCtrl', function($scope, $state, 
                                   $ionicPopup,
                                  servicioWeb) {
    $scope.myLists = function(){
        $state.go('init',{}, {reload: true});
    }

})
/*------------------------------------------------------------------------------------*/
.controller('DashCtrl', function($scope, $state, 
                                   $ionicPopup,
                                  servicioWeb) {
    $scope.data = {};
    $scope.listName = servicioWeb.getListName();
    $scope.listDescription = servicioWeb.getListDescription();
    $scope.shareList = function(){
         popUpShareList($scope,$ionicPopup, function(res){
             if(res)
                 servicioWeb.shareListDB(res,function(res){
                     popUp(res.title, res.msj, $ionicPopup);
                 });
         } )  
    }
    
    $scope.myLists = function(){
        $state.go('init',{}, {reload: true});
    }
})
/*------------------------------------------------------------------------------------*/
.controller('PublicCtrl', function($scope, $state, 
                                   $ionicPopup,
                                  servicioWeb) {
    $scope.arrayProduct = [];
    $scope.myContent = '';
    var count = 0;
    servicioWeb.getAllProductDB(function(res){
        $scope.arrayProduct = res;
        console.log(res);
    });
    
    $scope.myLists = function(){
        $state.go('init',{}, {reload: true});
    }
    
})

/*------------------------------------------------------------------------------------*/
.controller('LoginCtrl', function($scope, $state, 
                                   $ionicPopup,
                                  servicioWeb) {
    $scope.data = {};
    $scope.login = function (data){
        servicioWeb.login(data, function(res){
            popUp(res.title, res.msj, $ionicPopup);
            
       if(res)
           if(res.state){
               $state.go('init',{}, {reload: true});
                $scope.data = {};
           }
        });
    }
    
    $scope.registro = function(){
        $state.go('registro',{}, {reload: true});
    };
})

/*------------------------------------------------------------------------------------*/
.controller('RegistroCtrl', function($scope, $state, 
                                   $ionicPopup,
                                      servicioWeb) {
    $scope.data = {};
    $scope.addUser = function(data){ 
        if(data.sexo == 'Femenino')
            data.sexo = 0;
        else
            (data.sexo == 'Masculino') ? data.sexo = 1:data.sexo = 2;    
        servicioWeb.registerUser(data,function(result){
            popUp(result.title, result.msj, $ionicPopup);
            if(result.state){
                $state.go('login',{}, {reload: true});
                $scope.data = {};
            }
        });        
    };   
})

/*------------------------------------------------------------------------------------*/
.controller('InitCtrl', function($scope, $state, 
                                  $ionicPopup,
                                 servicioWeb) {
    
    $scope.shouldShowDelete = false;
    $scope.shouldShowReorder = false;
    $scope.listCanSwipe = true
    
    $scope.data = {};
    $scope.arrayListas = [];
    $scope.arrayShareList = [];
    getListas();
    $scope.newList = function(){
        popUpNewList($scope,$ionicPopup, function(res){
            if(res){
                servicioWeb.addList(res.n,res.t,res.d, function(res2){
                    if(!res2.state)
                        popUp(res2.title, res2.msj, $ionicPopup);                         
                    else{//tipo , callback
                       getListas();
                    }                        
                });
            }            
        });
    };
    
    $scope.logout = function(){
        servicioWeb.destroyUserCredentials();
         $state.go('login',{}, {reload: true});
    }
    
    //función que llama las listas tanto compartidas como propias de un usuario logueado
    function getListas(){
        servicioWeb.getListDB(1, function(res){
            if(res){
                $scope.arrayListas = res;//mis listas
                servicioWeb.getListDB(2, function(res2){
                    if(res2){
                        $scope.arrayShareList = res2;//mis listas compartidas
                        console.log(res2);
                    }else popUp('<h1>Error</h1>', 'No se procesaron listas',$ionicPopup);
                });                             
            }else popUp('<h1>Error</h1>', 'No se procesaron listas',$ionicPopup);
        });  
    }
    
    $scope.edit = function(list){
        servicioWeb.storeListCredentials(list);
         $state.go('main.public',{}, {reload: true});
        
    }
    
    $scope.delete = function(list){ 
        servicioWeb.deleteListDB(list,function(res){
            servicioWeb.getListDB(function(res){        
                $scope.arrayListas = res;
            });
        });        
    };
})



/*FUNCIONES-----------------------------------------------------------------*/
//función para crear nuevs listas
var popUpNewList = function($scope, $ionicPopup, callback){
    var myPopup = $ionicPopup.show({
        template: '<input type="text" placeholder="nombre" ng-model="data.name">'+
                   '<textarea rows="4" placeholder="descripcion" ng-model="data.description" cols="50"></textarea>',
        title: 'Nueva lista',
        subTitle: 'Please use normal things',
        scope: $scope,
        buttons: [
          { text: 'Cancel' },
          {
            text: '<b>Save</b>',
            type: 'button-positive',
            onTap: function(e) {
              if (!$scope.data.name || !$scope.data.description ) 
                //don't allow the user to close unless he enters wifi password
                e.preventDefault();
               else
                return {
                    n:$scope.data.name,
                    d:$scope.data.description,
                    t: tiempo()
               }
            }
          }
        ]
      });
      myPopup.then(function(res) {
          callback(res);
      });   
}

//función para compartir las nuevas listas
var popUpShareList = function($scope, $ionicPopup, callback){
    var myPopup = $ionicPopup.show({
        template: '<input type="text" placeholder="nombre" ng-model="data.username">',
        title: 'Comparte tu lista',
        subTitle: 'Comparte con tus conocidos',
        scope: $scope,
        buttons: [
          { text: 'Cancel' },
          {
            text: '<b>Save</b>',
            type: 'button-positive',
            onTap: function(e) {
              if (!$scope.data.username )
                e.preventDefault();
               else
                return {
                    n:$scope.data.username
               }
            }
          }
        ]
      });
      myPopup.then(function(res) {
          callback(res);
      });   
}

//función que retorna la fecha actual, útil para la creación de las listas
var tiempo = function(){
    var currentdate = new Date();
    return currentdate.getDate() + "/"+(currentdate.getMonth()+1)
            + "/" + currentdate.getFullYear()
}


var popUp = function(title, msj,$ionicPopup){
     var alertPopup = $ionicPopup.alert({
     title: title,
     template: msj
   });
};