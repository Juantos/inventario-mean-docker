var app = angular.module('app', ['ui.bootstrap'])
app.controller("cuerpo", main)

function main($scope, $http, $window) {

    $scope.categoria = window.location.pathname.split("/").slice(-1)[0];
    $scope.Jcategoria = JSON.stringify({
        id: $scope.categoria
    })
    $scope.accion = {
        texto: ""
    }
    $scope.objeto = {
        nombre: "",

        campos: {
            "id": "ID",
            "nombre": "Nombre",
            "descripcion": "Descripción",
            "cantidad": "Cantidad",
            "ubicacion": "Ubicación"
        }
    }

    function lista_categoria() {
        var path = "/lista_categoria"

        $http.post(path, $scope.Jcategoria)
            .then((res) => {
                $scope.datos = res.data
            })
    }

    function nombra_categoria() {
        var path = "/nombra_categoria"

        $http.post(path, $scope.Jcategoria)
            .then((res) => {
                $scope.n_col = res.data.nombre
            })
    }

    $scope.setObjetoID = function (id, nombre) {
        $scope.objeto.nombre = nombre
        $scope.docu = {
            nombre: nombre,
            id: id,
            cat: $scope.categoria 
        }
    }

    $scope.lista_campos = function (id, nombre) {
        var path = "/lista_campos"
        var data = JSON.stringify({
            "_id": id,
            "id": $scope.categoria
        })
        $scope.objeto.nombre = nombre

        $http.post(path, data)
            .then((res) => {
                $scope.n_campos = res.data
                console.log($scope.n_campos)
            })
    }

    $scope.creaObjeto = function () {

        var resultado = {}
        var keys = Object.values($scope.objeto.campos)
        var values = Object.values($scope.objeto.nuevo)

        keys.forEach((key, i) => resultado[key] = values[i]);

        console.log(keys)
        console.log(values)

        resultado.id_cat = $scope.categoria;

        delete $scope.objeto.nuevo
        
        var path = "/creaObjeto"
        var data = JSON.stringify(resultado)

        gestionDocumentos(path, data)
        lista_categoria()
    }

    function gestionDocumentos(path, data) {
        $http.post(path, data)
            .then((res) => {
                $scope.doc = res.data
            })
    }

    $scope.cancela_accion = function () {
        delete $scope.nuevo
    }

    $scope.borraObjeto = function () {
        var data = JSON.stringify($scope.docu)
        var path = "/borraObjeto"

        gestionDocumentos(path, data)
        lista_categoria()
    }

    nombra_categoria()
    lista_categoria()
}
