//Requires
const express = require('express');
const app = express ();
const path = require('path');
const hbs = require('hbs');
const Usuario = require('./../models/usuario');
const CursoEstudiante = require('./../models/cursos-estudiantes');
const Cursos = require('./../models/cursos');
const multer = require('multer');
var upload = multer({ })

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

  Cursos.find({estado: 'Disponible'}).exec((err,respuesta)=> {
    if(err){
      console.log("err")
    }
    //console.log(respuesta)

    res.render('listado-cursos-estudiante', {
      respuesta : respuesta,
      sesion: false,
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

//Views
app.get('/login', (req, res ) => {
  
  //Destruyo la sesión
  req.session.destroy((err) => {
		if(err) return console.log(err)
  })
	res.render('login', {
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
app.get('/chat',(req, res) => {
  res.render('chat');
});

app.get('/listado-cursos',(req, res) => {

    Cursos.find({}).exec((err,respuestaTodos)=> {
      if(err){
        console.log("err")
      }
      console.log(respuestaTodos)

      Cursos.find({estado: 'Disponible'}).exec((err,respuestaDisponibles)=> {
        if(err){
          console.log("err")
        }
        console.log('respuestaDisponibles')
        console.log(respuestaDisponibles)

        res.render('listado-cursos', {
          respuestaTodos : respuestaTodos,
          respuestaDisponibles : respuestaDisponibles,
          
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
  
app.get('/listado-cursos-docente',(req, res) => {
 
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

        Usuario.find({tipo: 'docente'}).exec((err,respuestaDocente)=> {
          if(err){
            console.log("err")
          }
          listaDocentes = [];
          listaDocentes = respuestaDocente;

          res.render('listado-cursos-docente', {
            listaCursos : listaCursos,
            listaEstudiantes : listaEstudiantes,
            listaCursosEstudiantes : listaCursosEstudiantes,
            listaDocentes : listaDocentes,
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
  })
});


  app.post('/listado-cursos-docente-eliminar',(req, res) => {

    console.log('curso: '+req.body.idCurso)
    console.log('docente: '+req.body.docente)

    Cursos.findOneAndUpdate({id: req.body.idCurso},{estado: 'Cerrado', docente: req.body.docente}, {new : true}, (err,respuestaActualizar)=> {
      if(err){
        console.log("err")
      }
  
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
  
          Usuario.find({tipo: 'docente'}).exec((err,respuestaDocente)=> {
            if(err){
              console.log("err")
            }
            listaDocentes = [];
            listaDocentes = respuestaDocente;

            Cursos.find({}).exec((err,respuestaCursos)=> {
              if(err){
                console.log("err")
              }
              listaCursos = [];
              listaCursos = respuestaCursos;
            


              res.render('listado-cursos-docente-eliminar', {
                listaCursos : listaCursos,
                listaEstudiantes : listaEstudiantes,
                listaCursosEstudiantes : listaCursosEstudiantes,
                listaDocentes : listaDocentes,
                idCurso: parseInt(req.body.idCurso),
                idDocente: parseInt(req.body.docente),
                respuestaActualizar : respuestaActualizar,
                err : err
              })
            })
          })
        })
      })
    })
  });
  
  app.post('/listado-cursos-docente-abrir',(req, res) => {

    console.log('curso: '+req.body.idCurso)
    console.log('docente: '+req.body.docente)

    Cursos.findOneAndUpdate({id: req.body.idCurso},{estado: 'Disponible'}, {new : true}, (err,respuestaActualizar)=> {
      if(err){
        console.log("err")
      }
  
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
  
          Usuario.find({tipo: 'docente'}).exec((err,respuestaDocente)=> {
            if(err){
              console.log("err")
            }
            listaDocentes = [];
            listaDocentes = respuestaDocente;

            Cursos.find({}).exec((err,respuestaCursos)=> {
              if(err){
                console.log("err")
              }
              listaCursos = [];
              listaCursos = respuestaCursos;
            


              res.render('listado-cursos-docente-abrir', {
                listaCursos : listaCursos,
                listaEstudiantes : listaEstudiantes,
                listaCursosEstudiantes : listaCursosEstudiantes,
                listaDocentes : listaDocentes,
                idCurso: parseInt(req.body.idCurso),
                idDocente: parseInt(req.body.docente),
                respuestaActualizar : respuestaActualizar,
                err : err
              })
            })
          })
        })
      })
    })
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
  app.post('/registrar-usuario',upload.single('archivo'),(req, res) => {
    
    //Defino variable usuario
    let usuario = new Usuario({
      documento: parseInt(req.body.documento),
      nombre: req.body.nombre,
      correo: req.body.correo,
      telefono: req.body.telefono,
      contrasena: bcrypt.hashSync(req.body.contrasena, 10),
      avatar: req.file.buffer
      
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

      console.log(usuario.avatar);
      if(usuario.avatar){
        req.session.avatar = usuario.avatar.toString('base64');
      }
      
  
	    //console.log('Variable de sesion:' + req.session);

      //Dependiendo del rol, redirecciono a una página
      if(usuario.tipo == 'coordinador')
      {
        res.redirect('/listado-cursos-docente');
      }
      else if(usuario.tipo == 'aspirante')
      {
        res.redirect('/misCursos');
      }
      else if(usuario.tipo == 'docente')
      {
        res.redirect('/mis-cursos-docente');
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
        oldContrasena: usuario.contrasena,
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
      contrasena: (req.body.contrasena == '') ? req.body.oldContrasena : bcrypt.hashSync(req.body.contrasena, 10),
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
    Cursos.find({estado: 'Disponible'}).exec((err,respuesta)=> {
      if(err){
        console.log("err")
      }
      console.log(respuesta)

      res.render('listado-cursos-estudiante', {
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
      
    Cursos.findOne({id : req.body.curso }).exec((err,respuesta)=>{  
      if ( err )
      {
        return console.log(  );
      }
      console.log("req.session");
      //console.log(req.session);
      console.log('req.session.documento :::::' + req.session.documento);
      console.log('respuesta.id :::::' + respuesta.id);
      CursoEstudiante.find( {documento:req.session.documento,curso : respuesta.id } ).exec((err,respuestaCurEst)=>{
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
            curso: respuesta.id
          })

          console.log("cursoEstudiante");
          console.log(cursoEstudiante);
          
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
    //console.log(req.session);
    
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
    console.log('req.body.cursoest ::: ' + req.body.cursoest);
    console.log('req.body.documentoLogin ::: ' + req.session.documento);
    

   CursoEstudiante.remove({documento: req.session.documento , curso : req.body.cursoest}).exec((err,respuesta)=> {
      if(err){
        res.render ('eliminar-curso-confirmacion',{
          mostrar : err,
          texto : 'KO'
        })
      }
      res.render ('eliminar-curso-confirmacion',{
        mostrar : respuesta,
        texto : 'OK'
      })
    })
  });
  
  
  app.post('/eliminarCursoDocente',(req,res)=>{	
    console.log('req.body.cursoest ::: ' + req.body.cursoest);
    console.log('req.body.documentoLogin ::: ' + req.session.documento);
    
    let campos = req.body.cursoest.split("|");
    console.log("Campos::::" + campos[0]);
    console.log("Campos::::" + campos[1]);
   CursoEstudiante.remove({documento: campos[0], curso : campos[1]}).exec((err,respuesta)=> {
      if(err){
        res.render ('eliminar-curso-docente-confirmacion',{
          mostrar : err,
          texto : 'KO'
        })
      }
      res.render ('eliminar-curso-docente-confirmacion',{
        mostrar : respuesta,
        texto : 'OK'
      })
    })

      /*res.render('eliminar-curso-docente-confirmacion',{
      cursoest: req.body.cursoest,
      documentoLogin: req.body.documentoLogin
      });*/
  });
  
  //** FIN */

//** SEBASTIÁN */
app.get('/mis-cursos-docente',(req, res) => {

  let mensaje = ''

  //Si viene con parámetro de éxito, muestro mensaje
  if(req.query.exito)
  {
    mensaje = ` <div class="alert alert-success alert-dismissible fade show" role="alert">
                  <strong>Proceso exitoso!</strong><br>Las notas fueron almacenadas correctamente.
                  <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>`;
  }
  
  //Busco mis cursos como docente
  Cursos.find({docente: req.session.documento}).exec((err,respuestaCursos)=> {
    if(err){
      console.log("err")
    }
    listaCursos = [];
    listaCursos = respuestaCursos;
    
    //Busco todos los usuarios
    Usuario.find({}).exec((err,respuestaUsuarios)=> {
      if(err){
        console.log("err")
      }
      listaEstudiantes = [];
      listaEstudiantes = respuestaUsuarios;
      
      //Busco todos los curso por estudiante
      CursoEstudiante.find({}).exec((err,respuestaCursoEstudiante)=> {
        if(err){
          console.log("err")
        }
        listaCursosEstudiantes = [];
        listaCursosEstudiantes = respuestaCursoEstudiante;

        res.render('mis-cursos-docente', {
          listaCursos : listaCursos,
          listaEstudiantes : listaEstudiantes,
          listaCursosEstudiantes : listaCursosEstudiantes,
          mensaje: mensaje
        })
      })
    })
  })
});

//Carga la calificación de un curso
app.post('/calificar-curso',(req, res) => {

  //Defino variable usuario
  let idCurso = req.body.idCurso;

  //Busco mis cursos como docente
  Cursos.findOne({id: idCurso}).exec((err,respuestaCurso)=> {
    if(err){
      console.log("Error consultando los cursos");
      return console.log(err);
    }

    //Curso que calificaré
    let miCurso = respuestaCurso;
    
    //Busco todos los curso por estudiante
    CursoEstudiante.find({curso: idCurso}).exec((err,respuestaCursoEstudiante)=> {
      if(err){
        console.log('Ocurrió un error al consultar los estudiantes por curso');
        console.log(err);
      }
      
      listaCursosEstudiantes = [];
      listaCursosEstudiantes = respuestaCursoEstudiante;

      //let listadoEst = respuestaCursoEstudiante.find({}).select('documento');
      let listadoEst = respuestaCursoEstudiante.map(cursoEstudiante => cursoEstudiante.documento);

      //Busco todos los usuarios
      Usuario.find({documento: {"$in" : respuestaCursoEstudiante.map(cursoEstudiante => cursoEstudiante.documento)} }).exec((err,respuestaUsuarios)=> {
        if(err){
          console.log("err")
        }
        listaEstudiantes = [];
        listaEstudiantes = respuestaUsuarios;

        res.render('calificar-curso', {
          miCurso : miCurso,
          listaEstudiantes : listaEstudiantes
        })
      })
    })
  })
});

//Guarda las calificaciones de un curso
app.post('/guardar-calificaciones-curso',(req, res) => {

  console.log('req.body');
  console.log(req.body);
  
  let respuesta = '';
  let idCurso = req.body.idCurso;

  //Busco todos los curso por estudiante
  CursoEstudiante.find({curso: idCurso}).exec((err,respuestaCursoEstudiante)=> {
    if(err){
      console.log('Ocurrió un error al consultar los estudiantes por curso');
      console.log(err);
    }

    //Obtengo los documentos de los estudiantes y excluyo el campo idCurso del req.body
    listaIdsEstudiante = Object.keys(req.body).filter(campo => campo != 'idCurso');

    let listaEstudiante = [];
    let mensaje = '';
    let exito = false;

    var notasValidadas = 0;

    listaIdsEstudiante.forEach(documentoEstudiante => {
      notasValidadas++;
      //Si tiene nota y está entre 0 y 5
      if(req.body[documentoEstudiante] && req.body[documentoEstudiante] >= 0 && req.body[documentoEstudiante] <=5) {
        let estudianteNota = {
          documento: documentoEstudiante,
          nota: parseFloat(req.body[documentoEstudiante]).toFixed(1)
        }
        listaEstudiante.push(estudianteNota);
      }
      else{
        mensaje = mensaje + 'El estudiante con documento ' + documentoEstudiante + ' no tiene una nota ingresada.';
        console.log(mensaje);
      }

      //Si todos los elementos fueron procesados
      if(notasValidadas === listaIdsEstudiante.length) {
        
        //Si todos los estudiantes están calificados, procedo a actualizar
        if(listaEstudiante.length == respuestaCursoEstudiante.length){
          //Recorro la lista de estudiantes y actualizo nota
          let estudiantesListos = 0;
          listaEstudiante.forEach(estudiante => {
            CursoEstudiante.findOneAndUpdate({documento: estudiante.documento}, {nota: estudiante.nota}, (err,respuestaActualizar)=> {
              estudiantesListos++;
              if(err){
                console.log('Ocurrió un error en la actualización de la nota');
                console.log(err);
              }

              if(estudiantesListos === listaEstudiante.length){
                Cursos.findOneAndUpdate({id: idCurso}, {estado: 'Finalizado'}, (err,respuestaActualizarCurso)=> {
                  if(err){
                    console.log('Ocurrió un error en la actualización del curso');
                    console.log(err);
                  }
                  mensaje = 'Notas actualizadas correctamente';
                  console.log(mensaje);
                  exito = true;
                  return res.redirect('/mis-cursos-docente?exito=' + exito);
                })                
              }              
            })
          })
        }
        else{
          mensaje = 'Existen estudiantes que no tiene una nota ingresada. Por favor valide.';
          console.log(mensaje);
          return res.redirect('/mis-cursos-docente?exito=' + exito);
        }
      }
    });
  })
});
//** FIN SEBASTIÁN */
  
app.get('*', (req, res) => {
  res.render('error',{
    estudiante: 'Error 404: La pagina no existe'
  });
});

module.exports = app