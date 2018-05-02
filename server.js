/*-------------REQUIRE-------------*/

//Inicializando express y sus plugins
const express = require('express')
const bodyParser = require('body-parser') //bodyParser permite jugar con los datos de los formularios
const app = express()

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


/*-------------FUNCIONES CRUD-------------*/

app.post('/categorias', (req, res) => {
    var usr = req.body.usr
    var pwd = req.body.pwr //devuelve undefined

    console.log("Usuario: " + usr + ", Contraseña: " + pwd)
    res.sendFile(__dirname + '/app/categorias/categorias.html')
})

app.get('/lista_categorias', (req, res) => {
    db.collection(cat).find().toArray((err, jotason) => {
        if (err) return console.log(err)
        res.status(200).json(jotason)
    })
})

//Nueva categoría
app.post('/n_cat', (req, res, next) => {
    db.collection(cat).save({
        "id": cat + "." + arreglar(req.body.nombre),
        "nombre": req.body.nombre
    }, (err, result) =>{
        if (err) return console.log(err)
    })
})

app.post('/b_cat', (req, res, next) => {
    console.log(req)
    db.collection(cat).deleteOne({
        _id: new mongodb.ObjectID(req.body._id)
    }, (err, jotason) => {
        if (err) return console.log(err)
    })
    /*db.collection('formulario1').deleteOne({_id: new mongodb.ObjectID(req.body._id)}, (err, jotason) =>{
        if (err) return console.log(err)
    })*/
})

app.post('/e_cat', (req, res, next) => {
    db.collection(cat).updateOne({
        _id: new mongodb.ObjectID(req.body._id)
    }, {"nombre": req.body.nombre, "id": arreglar(req.body.nombre)}, (err, jotason) => {
        if (err) return console.log(err)
    })
})

//C - Create / Añadir documento
app.post('/anyadirDocumento', (req, res, next) => {
    db.collection('formulario1').save(req.body, (err, result) => {
        if (err) return console.log(err)
        res.redirect('/') //para no dejar estancado al usuario
    })
})

//R - Read / Leer documento
app.post('/leerDocumento', (req, res, next) => {
    db.collection('formulario1').findOne({
        _id: new mongodb.ObjectID(req.body._id)
    }, (err, jotason) => {
        if (err) return console.log(err)
        res.status(200).json(jotason)
    })
})

//U - Update / Actualizar documento
app.post('/editarDocumento', (req, res, next) => {
    db.collection('formulario1').updateOne({
        _id: new mongodb.ObjectID(req.body._id)
    }, req.body, (err, jotason) => {
        if (err) return console.log(err)
    })
})

//D - Delete / Borrar documento
app.post('/borrarDocumento', (req, res, next) => {
    db.collection('formulario1').deleteOne({
        _id: new mongodb.ObjectID(req.body._id)
    }, (err, jotason) => {
        if (err) return console.log(err)
    })
})

function arreglar(cad) {
    return cad.toLowerCase().split(' ').join('_').replace(/[{()}]/g, '').normalize('NFD').replace(/[\u0300-\u036f]/g, "").replace(/\W/g, '')
}
