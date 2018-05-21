var app = angular.module('app', ['ui.bootstrap'])
app.controller("cuerpo", main)

function main($scope, $http, $window) {

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

    $scope.irCat = function (catNombre, catID, catRowID) {
        var path = "/categorias/" + catRowID
        var data = JSON.stringify({
            "nombre": catNombre,
            "_id": catID,
            "id": catRowID
        })

        $window.location.href = path
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

    $scope.creaCat = function () {
        $scope.accion.texto = "Añadir"
    }

    $scope.accion_cat = function () {
        var data = JSON.stringify($scope.nuevo)
        var path = $scope.accion.texto == "Añadir" ? "/n_cat" : "/e_cat"
        delete $scope.nuevo

        gestionDocumentos(path, data)
        lista_categorias()
    }

    $scope.borra_cat = function () {
        var data = JSON.stringify($scope.categoria)
        var path = "/b_cat"

        gestionDocumentos(path, data)
        lista_categorias()
    }

    $scope.cancela_accion = function () {
        delete $scope.nuevo
    }
}