//Requires
require('./config/config');
const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require ('mongoose');

//Variables de sesión
const session = require('express-session');
var MemoryStore = require('memorystore')(session);

app.use(bodyParser.urlencoded({extended: false}));

//Paths
const dirPublic = path.join(__dirname, "../public");
app.use(express.static(dirPublic));

//**bootstrap */
const dirNode_modules = path.join(__dirname , '../node_modules')

app.use('/css', express.static(dirNode_modules + '/bootstrap/dist/css'));
app.use('/js', express.static(dirNode_modules + '/jquery/dist'));
app.use('/js', express.static(dirNode_modules + '/popper.js/dist'));

app.use('/js', express.static(dirNode_modules + '/bootstrap/dist/js'));
//**bootstrap */

//Variables de sesión
app.use(session({
  cookie: { maxAge: 86400000 },
  store: new MemoryStore({
    checkPeriod: 86400000 // prune expired entries every 24h
  }),
  secret: 'keyboard cat'
}))

app.use((req, res, next) => {
	if(req.session.documento){
		res.locals.sesion = true
		res.locals.nombre = req.session.nombre
		res.locals.nombreLogin = req.session.nombre
		res.locals.tipo = req.session.tipo
		res.locals.tipoLogin = req.session.tipo
		res.locals.idusuario = req.session.idusuario
		res.locals.documento = req.session.documento
		res.locals.coordinador = (req.session.tipo == 'coordinador')
		res.locals.docente = (req.session.tipo == 'docente')
		res.locals.aspirante = (req.session.tipo == 'aspirante')
	}
	console.log(req.session);
	next()
})

//Routes
app.use(require('./routes/index'));

//Mongoose
mongoose.connect(process.env.URLDB, {useNewUrlParser: true}, (error, resultado) => {
	if(error){
		return console.log(error)
	}
	console.log("conectado");
});


//** JHON */
console.log(__dirname)
app.listen(process.env.PORT, () => {
	console.log ('servidor en el puerto ' + process.env.PORT);
});