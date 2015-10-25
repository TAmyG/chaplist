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
/*------------------------------------------------------------------------------------*/
.controller('DashCtrl', function() {})
/*------------------------------------------------------------------------------------*/
.controller('LoginCtrl', function($scope, $state, 
                                  $http, $ionicPopup,
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
                                  $http, $ionicPopup,
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
                                  $http, $ionicPopup,
                                 servicioWeb) {
    
    $scope.data = {};
    $scope.arrayListas = [];    
    servicioWeb.getList(function(e){
        $scope.arrayListas = e;
    });
    
    $scope.newList = function(){
        popUpNewList($scope,$ionicPopup, function(res){
            if(res){
                servicioWeb.addList(res.n,res.t,res.d, function(res2){
                if(!res2.state)
                    popUp(res2.title, res2.msj, $ionicPopup);   
                });
            }            
        });
    };
    
    
    
    $scope.delete = function($index){       
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