//Requires
const express = require('express');
const app = express ();
const path = require('path');
const hbs = require('hbs');
const Usuario = require('./../models/usuario');
//requiero filesystem
const fs = require('fs');

const dirViews = path.join(__dirname, '../../template/views');
const dirPartials = path.join(__dirname, '../../template/partials');

//Encriptación de contraseña
const bcrypt = require('bcrypt');

//Variables de sesión
const session = require('express-session');
var MemoryStore = require('memorystore')(session);

//Helpers
require('./../helpers/helpers');

//hbs
app.set('view engine', 'hbs');
app.set('views', dirViews);
hbs.registerPartials(dirPartials);

//Variables de sesión
app.use(session({
    cookie: { maxAge: 86400000 },
    store: new MemoryStore({
      checkPeriod: 86400000 // prune expired entries every 24h
    }),
    secret: 'keyboard cat'
}))

//Views
app.get('/', (req, res ) => {
	res.render('index', {
		titulo: 'Inicio'		
	})
});

  
app.post('/calculos',(req, res) => {
    console.log(req.query);
    console.log(req.body);
    res.render('calculos', {
        estudiante: req.body.nombre,
        valor: parseInt(req.body.valor),
        nota2: parseInt(req.body.nota2),
        nota3: parseInt(req.body.nota3)
    });
});
  
  //** JHON */
  app.get('/listado-cursos',(req, res) => {
    res.render('listado-cursos');
  });
  
  app.get('/listado-cursos-docente',(req, res) => {
    res.render('listado-cursos-docente');
  });
  
  app.post('/listado-cursos-docente-eliminar',(req, res) => {
    res.render('listado-cursos-docente-eliminar', {
      id: parseInt(req.body.id)
    });
  });
  
  app.post('/listado-cursos-docente-abrir',(req, res) => {
    res.render('listado-cursos-docente-abrir', {
      id: parseInt(req.body.id)
    });
  });
  
  app.get('/crear-curso',(req, res) => {
    res.render('crear-curso');
  });
  
  app.post('/crear-curso',(req, res) => {
    res.render('crear-curso-confirmacion', {
      id: parseInt(req.body.id),
      nombre: req.body.nombre,
      modalidad: req.body.modalidad,
      valor: parseInt(req.body.valor),
      descripcion: req.body.descripcion,
      intensidad: parseInt(req.body.intensidad)
    });
  });
  //** FIN */
  
  //** SEBASTIÁN */
  //Llamada para cargar formulario de creación de usuarios
  app.get('/registrar-usuario',(req, res) => {
    res.render('registrar-usuario');
  });
  
  //Llamada para cargar formulario de creación de usuarios
  app.post('/registrar-usuario',(req, res) => {
    
    //Defino variable usuario
    let usuario = new Usuario({
      documento: parseInt(req.body.documento),
      nombre: req.body.nombre,
      correo: req.body.correo,
      telefono: req.body.telefono,
      contrasena: req.body.contrasena
    });
    
    //Guarda y realiza la redirección
	usuario.save((err, resultado) => {
        let respuesta = '';
		if(err){
            respuesta = "No se fue posible registrar el usuario" + usuario.nombre + ' con documento de identidad ' + usuario.documento + '. Error: ' + err;
			return res.render('registrar-usuario-resultado', {
				mostrar: respuesta
			})
        }
        respuesta = "El usuario " + usuario.nombre + ' con documento de identidad ' + usuario.documento  + " fue creado de manera exitosa!";
		return res.render('registrar-usuario-resultado', {
			mostrar: respuesta
		})
    });
  
  });
  
  //Llamada al login cuando pulso ingresar
  app.post('/',(req, res) => {
    
    documento = parseInt(req.body.documento);
    contrasena = req.body.contrasena;
  
    let listaUsuarios = [];
    //listaUsuarios = require('./estudiantes.json');
    listaUsuarios = JSON.parse(fs.readFileSync('src/estudiantes.json'));
  
    //Obtengo el usuario basado en el documento
    let usuario = listaUsuarios.find(usr => (usr.documento === documento && usr.contrasena === contrasena));
  
    //Si no encuentro el usuario, muestro error
    if(!usuario)
      {
        res.render('index', {
          claseAlerta:'alert alert-danger col-6 col-sm-7 col-lg-4 col-xl-4',
          mensajeLogin:'El usuario y/o contraseña son incorrectos!'
        });
      }
      else
      {
          //Dependiendo del rol, redirecciono a una página
          if(usuario.tipo == 'coordinador')
          {
            res.redirect('/listado-cursos-docente');
          }
          else if(usuario.tipo == 'aspirante')
          {
            res.redirect('/misCursos?documentoLogin='+documento);
          }
          else if(usuario.tipo == 'docente')
          {
            res.redirect('/listado-cursos');
          }
      }
  
  });
  
  //Llamada para cargar el listado de usuarios
  app.get('/listado-usuarios',(req, res) => {
    res.render('listado-usuarios');
  });
  
  //Carga la edición de usuario
  app.post('/editar-usuario',(req, res) => {
    
    documento = parseInt(req.body.documento);
    console.log(documento);
  
    let listaUsuarios = [];
    //listaUsuarios = require('./estudiantes.json');
    listaUsuarios = JSON.parse(fs.readFileSync('src/estudiantes.json'));
  
    //Obtengo el usuario basado en el documento
    let usuario = listaUsuarios.find(usr => (usr.documento === documento));
  
    //Si no encuentro el usuario, muestro error
    if(!usuario)
      {
        res.render('index', {
          claseAlerta:'alert alert-danger col-6 col-sm-7 col-lg-4 col-xl-4',
          mensajeLogin:'El usuario y/o contraseña son incorrectos!'
        });
      }
      else
      {
          res.render('editar-usuario', {
            documento:parseInt(usuario.documento),
            nombre:usuario.nombre,
            correo:usuario.correo,
            telefono:usuario.telefono,
            contrasena:usuario.contrasena,
            tipo:usuario.tipo
          });
      }
  
  });
  
  //Guarda la edición de usuario
  app.post('/actualizar-usuario',(req, res) => {
    
    //Defino variable usuario
    let usuario = {
      documento: parseInt(req.body.documento),
      nombre: req.body.nombre,
      correo: req.body.correo,
      telefono: req.body.telefono,
      contrasena: req.body.contrasena,
      tipo: req.body.tipo,
    };
  
    //Realiza la redirección
    res.render('actualizar-usuario-resultado', {
      usuario: usuario
    });
  
  });
  
  //Llamada para cargar formulario de listado de cursos para estudiante
  app.get('/listado-cursos-estudiante',(req, res) => {
    res.render('listado-cursos-estudiante', {
      documentoLogin: parseInt(req.query.documentoLogin)
    });
  });
  
  //** FIN SEBASTIÁN */
  
  //** WALTER */
  app.get('/inscripcion',(req, res) => {
    res.render('inscripcion', {
      documentoLogin: req.query.documentoLogin
    });
  });
  
  app.post('/inscripcion',(req, res) => {
    res.render('inscripcion-confirmacion', {
      nombre: req.body.nombre,
      curso: req.body.modalidad
    });
  });
  
  app.post('/crearIncripcion',(req,res)=>{	
      res.render('inscripcion-confirmacion',{
          documento: req.body.documento,
          correo: req.body.correo,
          nombre: req.body.nombre,
          telefono: req.body.telefono,
          curso: req.body.curso,
          documentoLogin: req.body.documentoLogin
      });
  });
  
  app.get('/misCursos',(req, res) => {
    res.render('misCursos', {
      documentoLogin: parseInt(req.query.documentoLogin)
    });
  });
  
  app.post('/misCursos',(req, res) => {
    res.render('eliminar-confirmacion', {	
    });
  });
  
  app.post('/eliminarCurso',(req,res)=>{	
      res.render('eliminar-curso-confirmacion',{
      cursoest: req.body.cursoest,
      documentoLogin: req.body.documentoLogin
      });
  });
  
  
  app.post('/eliminarCursoDocente',(req,res)=>{	
      res.render('eliminar-curso-docente-confirmacion',{
      cursoest: req.body.cursoest,
      documentoLogin: req.body.documentoLogin
      });
  });
  
  //** FIN */
  
  app.get('*', (req, res) => {
    res.render('error',{
      estudiante: 'Error'
    });
  });
  
  module.exports = app