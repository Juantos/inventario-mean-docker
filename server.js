/*-------------REQUIRE-------------*/

//Inicializando express y sus plugins
const express = require('express')
const bodyParser = require('body-parser') //bodyParser permite jugar con los datos de los formularios
const app = express()
var path = require('path');

app.use(bodyParser.urlencoded({
    extended: false
}))
app.use(bodyParser.json())

//El resto de cosas
var mongodb = require('mongodb')
var mongoose = require('mongoose')

/*-------------MONGODB-------------*/
const dburl = 'mongodb://localhost:27017/'
var db
var cat = 'categorias'

mongodb.connect(dburl, (err, client) => {
    if (err) return console.log(err)
    db = client.db('inventario')

    //Iniciando la escucha
    var server = app.listen(port, () => {
        console.log('Servidor a la espera en http://' + server.address().address + ':' + server.address().port)
    })
})

/*-------------CONFIGURACIÓN / ENRUTAMIENTO-------------*/
//__dirname devuelve el directorio en el que se encuentra el * servidor
var port = process.env.PORT || 3000 //puerto

//Scripts y hojas de estilo
app.use('/public', express.static(__dirname + '/public'));

//Devuelve a la página base, el login
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/app/core/login.html')
})

//Entrar en categoría
app.get('/categorias/*', (req, res) => {
    res.sendFile(__dirname + '/app/categorias/lista_categoria.html')
    //res.redirect("https://www.google.com")
})
//Login
app.post('/categorias', (req, res) => {
    var usr = req.body.usr
    var pwd = req.body.pwr //devuelve undefined

    console.log("Usuario: " + usr + ", Contraseña: " + pwd)
    res.sendFile(__dirname + '/app/categorias/categorias.html')
})


/*-------------FUNCIONES CRUD LISTA CATEGORIAS-------------*/


//Devuelve la lista de categorías
app.get('/lista_categorias', (req, res) => {
    db.collection(cat).find().toArray((err, jotason) => {
        if (err) return console.log(err)
        res.status(200).json(jotason)
    })
})

//Nueva categoría
app.post('/n_cat', (req, res, next) => {
    db.collection(cat).save({
        "id": arreglar(req.body.nombre),
        "nombre": req.body.nombre
    }, (err, result) => {
        if (err) return console.log(err)
    })
})

//Borrar categoría
app.post('/b_cat', (req, res, next) => {
    db.collection(cat).deleteOne({
        _id: new mongodb.ObjectID(req.body._id)
    }, (err, jotason) => {
        if (err) return console.log(err)
    })
    /*db.collection('formulario1').deleteOne({_id: new mongodb.ObjectID(req.body._id)}, (err, jotason) =>{
        if (err) return console.log(err)
    })*/
})

//Editar categoría
app.post('/e_cat', (req, res, next) => {
    db.collection(cat).updateOne({
        _id: new mongodb.ObjectID(req.body._id)
    }, {
        "nombre": req.body.nombre,
        "id": arreglar(req.body.nombre)
    }, (err, jotason) => {
        if (err) return console.log(err)
    })
})


/*-------------FUNCIONES CRUD LISTA CATEGORIA-------------*/


//Devuelve la lista de categorías
app.post('/lista_categoria', (req, res) => {
    db.collection(cat+"."+req.body.id).find().toArray((err, jotason) => {
        if (err) return console.log(err)
        res.status(200).json(jotason)
    })
})

//Devuelve el nombre de la categoría basándose en la URL actual de la página
app.post('/nombra_categoria', (req, res, next) => {
    db.collection(cat).findOne({
        id: req.body.id
    }, (err, jotason) => {
        if (err) return console.log(err)
        res.status(200).json(jotason)
    })
})

//Devuelve campos de la categoría seleccionada
app.post('/lista_campos', (req, res, next) => {
    db.collection(cat+"."+req.body.id).findOne({
        _id: new mongodb.ObjectID(req.body._id)
    }, {'_id': 0, 'id_cat': 0}, (err, jotason) => {
        if (err) return console.log(err)
        res.status(200).json(jotason)
    })
})

app.post('/creaObjeto', (req, res, next) => {
    db.collection(cat+"."+req.body.id_cat).save(req.body, (err, result) => {
        if (err) return console.log(err)
    })
})

app.post('/borraObjeto', (req, res, next) => {
    console.log(req.body)
     db.collection(cat+"."+req.body.cat).deleteOne({
        ID: req.body.id
    }, (err, jotason) => {
        if (err) return console.log(err)
    })
})

//Nueva categoría
/*app.post('/n_cat', (req, res, next) => {
    db.collection(cat).save({
        "id": arreglar(req.body.nombre),
        "nombre": req.body.nombre
    }, (err, result) => {
        if (err) return console.log(err)
    })
})*/

//Borrar categoría
/*app.post('/b_cat', (req, res, next) => {
    console.log(req)
    db.collection(cat).deleteOne({
        _id: new mongodb.ObjectID(req.body._id)
    }, (err, jotason) => {
        if (err) return console.log(err)
    })
})*/

//Editar categoría
/*app.post('/e_cat', (req, res, next) => {
    db.collection(cat).updateOne({
        _id: new mongodb.ObjectID(req.body._id)
    }, {
        "nombre": req.body.nombre,
        "id": arreglar(req.body.nombre)
    }, (err, jotason) => {
        if (err) return console.log(err)
    })
})*/

//R - Read / Leer documento


function arreglar(cad) {
    return cad.toLowerCase().split(' ').join('_').replace(/[{()}]/g, '').normalize('NFD').replace(/[\u0300-\u036f]/g, "").replace(/\W/g, '')
}
