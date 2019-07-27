//Requires
require('./config/config');
const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require ('mongoose');

const server = require('http').createServer(app);
const io = require('socket.io')(server);

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

		res.locals.avatar = req.session.avatar
	}
	//console.log(req.session);
	next()
})

//Routes
app.use(require('./routes/index'));

//Mongoose
mongoose.connect(process.env.URLDB, {useNewUrlParser: true}, (error, resultado) => {
	if(error){
		return console.log(error)
	}
	console.log("conectado a BD");
});

const { Usuarios } = require('./clsUsuarios')
const usuarios = new Usuarios();
const usuariosNotificacion = new Usuarios();

io.on('connection', client => {

	console.log("usuario conectado por socket");

	client.on('usuarioNuevo', (usuario) => {
		let listado = usuarios.agregarUsuario(client.id, usuario)
		console.log(listado)
		let texto = 'Se ha conectado ' + usuario
		io.emit('nuevoUsuario',texto)
	})

	client.on('usuarioNuevoNotificacion', (usuario, documento) => {
		let listado = usuariosNotificacion.agregarUsuarioConDocumento(client.id, usuario, documento)
		console.log(listado)
		let texto = 'Se ha conectado ' + usuario
		io.emit('nuevoUsuarioNotificacion',texto)
	})

	client.on('disconnect',()=>{
		let usuarioBorrado = usuarios.borrarUsuario(client.id)
		let usuarioBorradoNotificacion = usuariosNotificacion.borrarUsuario(client.id)
		console.log(usuarioBorrado)
		if(usuarioBorrado){
			let texto = 'Se ha desconectado ' + usuarioBorrado.nombre
			io.emit('usuarioDesconectado', texto)

			let textoNotificacion = 'Se ha desconectado ' + (usuarioBorradoNotificacion.nombre) ? usuarioBorradoNotificacion.nombre : 'un invitado';
			io.emit('usuarioBorradoNotificacion', textoNotificacion)
		}

	})

	client.on("texto", (text, callback) => {
		let usuario = usuarios.getUsuario(client.id)
		let texto = usuario.nombre + ' : ' + text
		console.log(texto)
		io.emit("texto", (texto))
		callback()
	})

	//Recibo el texto privado
	client.on("textoPrivado", (text, callback) => {
		let usuario = usuariosNotificacion.getUsuario(client.id)
		text.estudiantesNotas.forEach(estudianteNota => {
			//let texto = `${usuario.nombre} : ${text.mensajePrivado}`
			let texto = `El curso ${text.nombreCurso} ha sido calificado por el profesor ${text.nombreProfesor}. Su nota es: ${estudianteNota.nota}`
			console.log('TEXTO PRIVADO' + texto);
			//Envío a uno
			let destinatario = usuariosNotificacion.getDestinatario(estudianteNota.documento)
			console.log('destinatario');
			console.log(destinatario);
			if(destinatario)
			{
				client.broadcast.to(destinatario.id).emit("textoPrivado", (texto));
				console.log('Finalizó el envío del mensaje');
			}
		});

		callback();
	})
})

//** JHON */
//console.log(__dirname)
server.listen(process.env.PORT, () => {
	console.log ('servidor en el puerto ' + process.env.PORT);
});