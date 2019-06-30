//Requires
const express = require('express');
const app = express ();
const path = require('path');
const hbs = require('hbs');
const Usuario = require('./../models/usuario');
const CursoEstudiante = require('./../models/cursos-estudiantes');
const Cursos = require('./../models/cursos');
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
  
  //Destruyo la sesión
  req.session.destroy((err) => {
		if(err) return console.log(err)
  })
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

    Cursos.find({}).exec((err,respuesta)=> {
      if(err){
        console.log("err")
      }
      console.log(respuesta)

      res.render('listado-cursos', {
        respuesta : respuesta,
        
        curso : {
                id: parseInt(req.body.id),
                nombre: req.body.nombre,
                modalidad: req.body.modalidad,
                valor: parseInt(req.body.valor),
                descripcion: req.body.descripcion,
                intensidad: parseInt(req.body.intensidad)
              }
      })
    })
  });
  
  app.get('/listado-cursos-docente',(req, res) => {
    Cursos.find({estado: 'Disponible'}).exec((err,respuestaDisponibles)=> {
      if(err){
        console.log("err")
      }
      console.log(respuestaDisponibles)

      Cursos.find({estado: 'Cerrado'}).exec((err,respuestaCerrados)=> {
        if(err){
          console.log("err")
        }
        console.log(respuestaCerrados)

        res.render('listado-cursos-docente', {
          respuestaDisponibles : respuestaDisponibles,
          respuestaCerrados : respuestaCerrados,
          curso : {
                  id: parseInt(req.body.id),
                  nombre: req.body.nombre,
                  modalidad: req.body.modalidad,
                  valor: parseInt(req.body.valor),
                  descripcion: req.body.descripcion,
                  intensidad: parseInt(req.body.intensidad)
                }
        })
      })
    })
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
    let curso = new Cursos({
      id: parseInt(req.body.id),
      nombre: req.body.nombre,
      modalidad: req.body.modalidad,
      valor: parseInt(req.body.valor),
      descripcion: req.body.descripcion,
      intensidad: parseInt(req.body.intensidad)
    })

    curso.save((err, resultado)=> {
      if(err){
        console.log("errsave")
        res.render('crear-curso-confirmacion', {
          resultado : resultado,
          err : err
        })
      }

        Cursos.find({}).exec((err,respuesta)=> {
          if(err){
            console.log("errfind")
          }
          console.log(respuesta)

          res.render('crear-curso-confirmacion', {
            resultado : resultado,
            err : err,
            respuesta : respuesta,
            curso : {
                    id: parseInt(req.body.id),
                    nombre: req.body.nombre,
                    modalidad: req.body.modalidad,
                    valor: parseInt(req.body.valor),
                    descripcion: req.body.descripcion,
                    intensidad: parseInt(req.body.intensidad)
                  }
          })
          
        });


    })		

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
      contrasena: bcrypt.hashSync(req.body.contrasena, 10)
      
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
  
    //Obtengo el usuario basado en el documento
    Usuario.findOne({documento: documento}, (err, usuario) => {
      if(err){
        return console.log(err);
      }
      
      //Si no encuentra el usuario genera error
      if(!usuario){
        return res.render('index', {
          claseAlerta:'alert alert-danger col-6 col-sm-7 col-lg-4 col-xl-4',
          mensajeLogin:'El usuario y/o contraseña son incorrectos!'
        })
      }

      //Si la contraseña no coincide genera error
      if(!bcrypt.compareSync(contrasena, usuario.contrasena)){
        return res.render('index', {
          claseAlerta:'alert alert-danger col-6 col-sm-7 col-lg-4 col-xl-4',
          mensajeLogin:'El usuario y/o contraseña son incorrectos!'
        })
      }
      
      //Seteo variables de sesión
      req.session.idusuario = usuario._id;
      req.session.nombre = usuario.nombre;
      req.session.documento = usuario.documento;
      req.session.tipo = usuario.tipo;
      req.session.coordinador = (usuario.tipo == 'coordinador');
      req.session.docente = (usuario.tipo == 'docente');
      req.session.aspirante = (usuario.tipo == 'aspirante');
  
	    console.log('Variable de sesion:' + req.session);
      // res.render('index', {
      //   mensaje : "Bienvenido " + usuario.nombre,
      //   sesion: true,
      //   nombre: req.session.nombre
      // })

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
    })
  
  });
  
  //Llamada para cargar el listado de usuarios
  app.get('/listado-usuarios',(req, res) => {
    Usuario.find({}).exec((err, respuesta) => {
      if(err){
        return console.log(err);
      }
  
      res.render('listado-usuarios', {
        listaUsuarios : respuesta
      })
    })
  });
  
  //Carga la edición de usuario
  app.post('/editar-usuario',(req, res) => {
    
    let id = req.body.id;
    console.log("Editar id: " + id);

    //Si no llega el id, saca error
    if(!id)
    {
      console.log("El campo ID está llegando vacío");
      
      return res.render('error', {
        estudiante:'Debe seleccionar un usuario a editar.'
      });
    }
    
    Usuario.findById(id, (err, usuario) => {
      if(err){
        return console.log('Error');
      }
  
      if(!usuario){
        return res.render('error', {
          estudiante:'Usuario no encontrado.'
        });
      }
  
      res.render('editar-usuario', {
        idUsuario: usuario._id,
        documento: parseInt(usuario.documento),
        nombre: usuario.nombre,
        correo: usuario.correo,
        telefono: usuario.telefono,
        contrasena: '',
        tipo: usuario.tipo
      });
    });  
  });
  
  //Guarda la edición de usuario
  app.post('/actualizar-usuario',(req, res) => {
    
    let respuesta = '';

    //Defino variable usuario
    let usuario = {
      documento: parseInt(req.body.documento),
      nombre: req.body.nombre,
      correo: req.body.correo,
      telefono: req.body.telefono,
      contrasena: (req.body.documento == '') ? req.body.oldContrasena : bcrypt.hashSync(req.body.contrasena, 10),
      tipo: req.body.tipo
    };

    Usuario.findOneAndUpdate({documento: usuario.documento}, usuario, {new: true, runValidators: true, context: 'query'}, (err, resultados) => {
      if(err){
        console.log(err);
        respuesta = "No fue posible actualizar el usuario: " + err.message;
        return res.render('actualizar-usuario-resultado', {
          respuesta: respuesta
        });
      }
      respuesta = "El usuario " + usuario.nombre + ' con documento de identidad ' + usuario.documento  + " fue actualizado de manera exitosa!";
      
      //Realiza la redirección
      res.render('actualizar-usuario-resultado', {
        respuesta: respuesta
      });      
    })
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
    console.log('INDEXXX inscripcion:::::');
    Cursos.find({}).exec((err,respuesta)=>{  
        if ( err )
        {
          return console.log( err );
        }
        console.log('INDEXXX :::::' + respuesta);
        res.render ('inscripcion',{
          listado : respuesta
        })
    });
    /*res.render('inscripcion', {
      documentoLogin: req.query.documentoLogin
    });*/
  });
  
  app.post('/inscripcion',(req, res) => {
    console.log('INDEXXX inscripcion:::::');
    Cursos.find({}).exec((err,respuesta)=>{  
        if ( err )
        {
          return console.log( err );
        }
        console.log('INDEXXX :::::' + respuesta);
        res.render ('inscripcion',{
          listado : respuesta
        })
    });
    /*res.render('inscripcion-confirmacion', {
      nombre: req.body.nombre,
      curso: req.body.modalidad
    });*/
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
    console.log(req.session);
    res.render('misCursos', {
      documentoLogin: parseInt(req.session.documento)
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
      estudiante: 'Error 404: La pagina no existe'
    });
  });
  
  module.exports = app