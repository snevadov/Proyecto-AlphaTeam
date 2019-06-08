const express = require('express');
const app = express();
const path = require('path');
const hbs = require('hbs');
const bodyParser = require('body-parser');
require('./helpers');

const directoriopublico = path.join(__dirname, '../public');
const directoriopartials = path.join(__dirname, '../partials');
app.use(express.static(directoriopublico));
hbs.registerPartials(directoriopartials);
app.use(bodyParser.urlencoded({extended: false}));

//**bootstrap */
const dirNode_modules = path.join(__dirname , '../node_modules')

app.use('/css', express.static(dirNode_modules + '/bootstrap/dist/css'));
app.use('/js', express.static(dirNode_modules + '/jquery/dist'));
app.use('/js', express.static(dirNode_modules + '/popper.js/dist'));

app.use('/js', express.static(dirNode_modules + '/bootstrap/dist/js'));
//**bootstrap */

app.set('view engine','hbs');

app.get('/',(req, res) => {
  res.render('index', {
    estudiante: 'Jhon Marin'
  });
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

app.get('/listado-cursos',(req, res) => {
  res.render('listado-cursos');
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

//** SEBASTIÁN */
//Llamada para cargar formulario de creación de usuarios
app.get('/registrar-usuario',(req, res) => {
  res.render('registrar-usuario');
});

//Llamada para cargar formulario de creación de usuarios
app.post('/registrar-usuario',(req, res) => {
  
  //Defino variable usuario
  let usuario = {
    id: parseInt(req.body.id),
    nombre: req.body.nombre,
    correo: req.body.correo,
    telefono: req.body.telefono,
    contrasena: req.body.contrasena,
    tipo: 'aspirante'
  };

  //Realiza la redirección
  res.render('registrar-usuario-resultado', {
    usuario: usuario
  });
});
//** FIN SEBASTIÁN */

app.get('*', (req, res) => {
  res.render('error',{
    estudiante: 'error'
  });
});


//** JHON */
console.log(__dirname)
console.log(directoriopublico)

app.listen(3000, () => {
  console.log('Escuchando por el puerto 3000');
});
//** FIN */