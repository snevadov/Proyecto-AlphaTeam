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
  listaCursos = [];

  Cursos.find({}).exec((err,respuestaCursos)=> {
    if(err){
      console.log("err")
    }
    listaCursos = [];
    listaCursos = respuestaCursos;

    //console.log("listaCursos: ");
    //console.log(listaCursos);

    Usuario.find({}).exec((err,respuestaUsuarios)=> {
      if(err){
        console.log("err")
      }
      listaEstudiantes = [];
      listaEstudiantes = respuestaUsuarios;

      //console.log("listaUsuarios: ");
      //console.log(listaEstudiantes);

      CursoEstudiante.find({}).exec((err,respuestaCursoEstudiante)=> {
        if(err){
          console.log("err")
        }
        listaCursosEstudiantes = [];
        listaCursosEstudiantes = respuestaCursoEstudiante;
  
        //console.log("listaCursoEstudiante: ");
        //console.log(listaCursosEstudiantes);

        res.render('listado-cursos-docente', {
          listaCursos : listaCursos,
          listaEstudiantes : listaEstudiantes,
          listaCursosEstudiantes : listaCursosEstudiantes,
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
  })
});
  
/*
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
*/

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
    console.log('CREAR CURSOOOO' + req.body.curso);
      
    Cursos.find({nombre : req.body.curso }).exec((err,respuesta)=>{  
      if ( err )
      {
        return console.log(  );
      } 
      console.log('req.session.documento :::::' + req.session.documento);
      console.log('respuesta[0].id :::::' + respuesta[0].id);
      CursoEstudiante.find( {documento:req.session.documento,curso : respuesta[0].id } ).exec((err,respuestaCurEst)=>{
        console.log('respuestaCurEst:::' + respuestaCurEst);
        console.log( 'respuestaCurEst.length:::' + respuestaCurEst.length );
        if ( respuestaCurEst.length > 0 )
        {
          console.log('YA ESTA :::::');
          res.render ('inscripcion-confirmacion',{
            mostrar : "Ya está registrado en este curso",
            texto : 'KO'
          })
        }
        else
        {
          console.log('NO ESTA :::::');
          let cursoEstudiante = new CursoEstudiante({
            documento: req.session.documento,
            curso: respuesta[0].id
          })
          
          cursoEstudiante.save( (err,resultado) => {  
              console.log('ERROOORRR::::' + err);        
              if (err)
              {
                res.render ('inscripcion-confirmacion',{
                  mostrar : err,
                  texto : 'KO'
                })
              }
              res.render ('inscripcion-confirmacion',{
                mostrar : resultado,
                texto : 'OK'
              })
          });
        }        
      });      
    });

  });
  
  app.get('/misCursos',(req, res) => {
    console.log(req.session);
    
    Cursos.find({}).exec((err,respuestaCursos)=> {
      if(err){
        console.log("err")
      }
      listaCursos = [];
      listaCursos = respuestaCursos;
  
      //console.log("listaCursos: ");
      //console.log(listaCursos);
  
      Usuario.find({}).exec((err,respuestaUsuarios)=> {
        if(err){
          console.log("err")
        }
        listaEstudiantes = [];
        listaEstudiantes = respuestaUsuarios;
  
        //console.log("listaUsuarios: ");
        //console.log(listaEstudiantes);
  
        CursoEstudiante.find({}).exec((err,respuestaCursoEstudiante)=> {
          if(err){
            console.log("err")
          }
          listaCursosEstudiantes = [];
          listaCursosEstudiantes = respuestaCursoEstudiante;
    
          //console.log("listaCursoEstudiante: ");
          //console.log(listaCursosEstudiantes);
  
          res.render('misCursos', {
            listaCursos : listaCursos,
            listaEstudiantes : listaEstudiantes,
            listaCursosEstudiantes : listaCursosEstudiantes,
            usuario : req.session.documento
          })
        })
      })
    })

    /*res.render('misCursos', {
      documentoLogin: req.session.documento
    });*/
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

//** SEBASTIÁN */
app.get('/mis-cursos-docente',(req, res) => {
  console.log(req.session);

  //Cursos.find({idDocente : req.session._id }).exec((err,misCursos)=>{
  //   if (err){
  //     console.log(err);
  //     return res.render('error',{
  //       estudiante: 'Ocurrió un error'
  //     });
  //   }

  //   misCursos.forEach(miCurso => {
  //     //Busco Estudiantes del curso
  //     cursoEstudiante.find({curso : miCurso.documento}).exec((err,estudiantes)=>{
  //       if (err){
  //         res.render ('inscripcion-confirmacion',{
  //           mostrar : err,
  //           texto : 'KO'
  //         })
  //       }
  //       //Creo array para almacenar los estudiantes
  //       miCurso.estudiante = [];

  //       //Recorro los estudiantes y busco su información en BD
  //       estudiantes.forEach(estudiante => {
  //         Usuario.findOne({documento : estudiante.documento}).exec((err,usuario)=>{
  //           miCurso.estudiante.push(usuario);
  //         })
  //       })
  //     });   
  //   });

  //   res.render('mis-cursos-docente', {
  //     listadoCursos: misCursos
  //   });
  // });
  
  //Array de prueba
  let listadoCursos = [
    {
        documento: 1,
        nombre: 'a',
        intensidad: 5,
        modalidad: 'Presencial',
        descripcion: 'Prueba 1',
        valor: 10,
        estudiantes: [
            {
                documento: 01,
                nombre: 'Pepito',
                correo: "pepito@correo.com",
                telefono: "3"
            },
            {
                documento: 02,
                nombre: 'fulanito',
                correo: "fulanito@correo.com",
                telefono: "3"
            },
            {
                documento: 03,
                nombre: 'zultanito',
                correo: "zultanito@correo.com",
                telefono: "3"
            }
        ]
    },
    {
        documento: 2,
        nombre: 'b',
        intensidad: 6,
        modalidad: 'Presencial',
        descripcion: 'Prueba 2',
        valor: 10,
        estudiantes: [
            {
                documento: 04,
                nombre: 'Pepito2',
                correo: "pepito2@correo.com",
                telefono: "3"
            },
            {
                documento: 05,
                nombre: 'fulanito2',
                correo: "fulanito2@correo.com",
                telefono: "3"
            },
            {
                documento: 06,
                nombre: 'zultanito2',
                correo: "zultanito2@correo.com",
                telefono: "3"
            }
        ]
    },
    {
        documento: 3,
        nombre: 'c',
        intensidad: 7,
        modalidad: 'Presencial',
        descripcion: 'Prueba 3',
        valor: 10,
        estudiantes: [
            {
                documento: 01,
                nombre: 'Pepito',
                correo: "pepito@correo.com",
                telefono: "3"
            },
            {
                documento: 02,
                nombre: 'fulanito',
                correo: "fulanito@correo.com",
                telefono: "3"
            },
            {
                documento: 03,
                nombre: 'zultanito',
                correo: "zultanito@correo.com",
                telefono: "3"
            }
        ]
    }
  ];
  res.render('mis-cursos-docente', {
    listadoCursos: listadoCursos
  });

});
//** FIN SEBASTIÁN */
  
app.get('*', (req, res) => {
  res.render('error',{
    estudiante: 'Error 404: La pagina no existe'
  });
});

module.exports = app