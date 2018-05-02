var app = angular.module('app', ['ui.bootstrap'])
app.controller("cuerpo", main)
app.$inject = [ '$scope', '$http'];

function main($scope, $http) {

    $scope.categoria
    
    $scope.accion = {
        texto: ""
    }
    
    function lista_categorias() {
        $http.get("/lista_categorias")
            .then((res) => {
                $scope.datos = res.data
            })
    }
    lista_categorias()

    function gestionDocumentos(path, data) {
        $http.post(path, data)
            .then((res) => {
                $scope.doc = res.data
            })
    }
    
    $scope.setCatID = function (catNombre, catID) {
        $scope.categoria = {
            nombre: catNombre,
            _id: catID
        }
    }
    
    $scope.editCat = function (catNombre, catID) {
        $scope.nuevo = {
            nombre: catNombre,
            _id: catID
        }
        
        $scope.accion.texto = "Editar"
    }
    
    $scope.creaCat = function (){
        $scope.accion.texto = "Añadir"
    }

    $scope.accion_cat = function () {
        console.log($scope.nuevo)
        var data = JSON.stringify($scope.nuevo)
        var path = $scope.accion.texto == "Añadir" ? "/n_cat" : "/e_cat"
        delete $scope.nuevo

        gestionDocumentos(path, data)
        lista_categorias()
    }
    
    $scope.borra_cat = function(){
        var data = JSON.stringify($scope.categoria)
        var path = "/b_cat"

        gestionDocumentos(path, data)
        lista_categorias()
    }
    
    $scope.cancela_accion = function() {
        delete $scope.nuevo
    }



//Acciones por defecto
/*$scope.accion = {
    texto: "Añadir",
    cancelar: false
}
    
/*-------------GESTION CRUD-------------*/

/*function gestionDocumentos(path, data){
    $http.post(path, data)
        .then((res) => {
            $scope.doc = res.data
        })
}

/*-------------FUNCIONES CRUD-------------*/

/*$scope.anyadirDocumento = function(){
    var data = $scope.nuevo
    var path = "/anyadirDocumento"
    $scope.accion.texto = "Añadir"
    delete $scope.nuevo
    
    gestionDocumentos(path, data)
    listarCRUD()
}
    
$scope.editarDocumento = function(){
    var data = $scope.nuevo
    var path = "/editarDocumento"
    $scope.accion.texto = "Modificar"
    $scope.accion.cancelar = true
    delete $scope.nuevo
    
    gestionDocumentos(path, data)
    listarCRUD()
}
    
$scope.borrarDocumento = function(){
    var data = JSON.stringify({_id: this.d._id})
    console.log(data)
    var path = "/borrarDocumento"
    
    gestionDocumentos(path, data)
    listarCRUD()
}
    
$scope.cancelarEdicion = function(){
    $scope.accion.cancelar = false
    $scope.accion.texto = "Añadir"
    delete $scope.nuevo
}*/
}
