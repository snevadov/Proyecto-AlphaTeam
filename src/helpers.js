const hbs = require('hbs');
//requiero filesystem
const fs = require('fs');
listaEstudiantes = [];
listaEstudiantesCursos = [];
listaCursos = [];
/*
//Comentario pendiente de corregir
let listaUsuarios = [];

*/

hbs.registerHelper('obtenerPromedio', (valor) => {
return (valor*100)
});

//** JHON */
hbs.registerHelper('listar-cursos', () => {
    listaCursos = require('./bd-cursos.json')
    let texto = "<table class='table'> \
                    <thead class='thead-dark'> \
                    <th>ID </th>\
                    <th>Nombre </th>\
                    <th>Descripcion </th> \
                    <th>Modalidad </th> \
                    <th>Valor </th> \
                    <th>Intensidad </th> \
                    <th>Estado </th> \
                    </thead> \
                <tbody>";
    
    listaCursos.forEach(curso => {
        texto = texto +            
            "<tr>" +
            "<td>" + curso.id + '</td>' +
            "<td>" + curso.nombre + '</td>' +
            "<td>" + curso.descripcion + '</td>' +            
            "<td>" + curso.modalidad + '</td>' +
            "<td>" + curso.valor + '</td>' +
            "<td>" + curso.intensidad + '</td>' +
            "<td>" + curso.estado + '</td>' +            
            "<tr>"
    });
    texto = texto + "</tbody></table>"

    return texto;
});

hbs.registerHelper('listar-cursos-disponibles', () => {
    let texto = "";
    listaCursos = require('./bd-cursos.json')



    let cursos = listaCursos.filter(buscar => buscar.estado == "Disponible");
    if (cursos.length == 0){
        console.log('No existen cursos disponibles');
        texto = '<div class="alert alert-danger" role="alert">' +
                    'No existen cursos disponibles' +
                '</div>';
    }
    else {



        texto = `<div class="accordion" id="accordionExample"> 
                        <div class="row">`;
        i = 1;
        cursos.forEach(curso => {
            texto = texto +            
                            `<div class="col">            
                                <div class="card">
                                    <div class="card-header" id="heading${i}">
                                    <h2 class="mb-0">
                                        <button class="btn btn-link" type="button" data-toggle="collapse" data-target="#collapse${i}" aria-expanded="true" aria-controls="collapse${i}">
                                            Curso: ${curso.nombre} - Valor: ${curso.valor} <br>
                                            Descripcio: ${curso.descripcion}
                                        </button>
                                    </h2>
                                    </div>        
                                    <div id="collapse${i}" class="collapse" aria-labelledby="heading${i}" data-parent="#accordionExample">
                                    <div class="card-body">
                                        <strong>ID: </strong>${curso.id}<br><br>
                                        <strong>Nombre Curso: </strong>${curso.nombre}<br><br>
                                        <strong>Descripcion: </strong>${curso.descripcion}<br><br>                    
                                        <strong>Modalidad: </strong>${curso.modalidad}<br><br>
                                        <strong>Valor: </strong>${curso.valor}<br><br>
                                        <strong>Intensidad: </strong>${curso.intensidad}<br><br>
                                        <strong>Estado: </strong>${curso.estado}
                                    </div>
                                    </div>
                                </div>                    
                            </div>`;
                i=i+1;
        });
        texto = texto + `</div>
                    </div>`;

    }

    return texto;
}); 

hbs.registerHelper('listar-cursos-docente-disponibles', () => {
    let texto = "";
    listaEstudiantes = [];
    listaCursos = require('./bd-cursos.json')
    listaEstudiantes = require('./estudiantes.json')
    listadoCursosEstudiantes = require('./cursos-estudiantes.json')

    let cursos = listaCursos.filter(buscar => buscar.estado == "Disponible");    
    if (cursos.length == 0){
        console.log('No existen cursos disponibles');
        texto = '<div class="alert alert-danger" role="alert">' +
                    'No existen cursos disponibles' +
                '</div>';
    }
    else {
        texto = `<div class="accordion" id="accordionExampleD">`;
        i = 1;
        cursosEstudiantes = [];
        cursos.forEach(curso => {
            if(i % 2 != 0){
                texto = texto + 
                    '<div class="row">'
            }
            texto = texto +            
                            `<div class="col">            
                                <div class="card">
                                    <div class="card-header text-center id="headingD${i}">
                                    <h2 class="mb-0">
                                        <button class="btn btn-link" type="button" data-toggle="collapse" data-target="#collapseD${i}" aria-expanded="true" aria-controls="collapseD${i}">
                                            Curso: ${curso.nombre} - (id: ${curso.id}) - 
                                            <form class="form-inline" action="/listado-cursos-docente-eliminar" method="POST">                                           
                                                <button class="btn btn-outline-danger" name="id" value="${curso.id}">Cerrar Curso</button>
                                            </form>
                                        </button>

                                        
                                        
                                    </h2>
                                    </div>        
                                    <div id="collapseD${i}" class="collapse" aria-labelledby="headingD${i}" data-parent="#accordionExampleD">
                                    <div class="card-body">`
                                        cursosEstudiantes = listadoCursosEstudiantes.filter(buscar => buscar.curso == curso.id);

                                        if (cursosEstudiantes.length == 0){
                                            texto = texto +                       
                                            `<strong>EL CURSO NO TIENE ESTUDIANTES</strong>`
                                        }
                                        
                                        let tablaEstudiante = "";
                                        cursosEstudiantes.forEach(curEstudiante => {
                                            let est = listaEstudiantes.find(buscar => buscar.documento == curEstudiante.documento);
                                            if (!est){

                                            }
                                            else {

                                                if(tablaEstudiante == ""){
                                                    tablaEstudiante = 
                                                    `<table class="table table-striped">
                                                        <thead>
                                                            <tr>
                                                            <th scope="col">Documento</th>
                                                            <th scope="col">Nombre</th>
                                                            <th scope="col">Correo</th>
                                                            <th scope="col">Telefono</th>
                                                            <th scope="col">Eliminar</th>
                                                            </tr>
                                                        </thead>
                                                    <tbody>`;
                                                }

                                                tablaEstudiante = tablaEstudiante +
                                                `<tr>
                                                <th scope="row">${est.documento}</th>
                                                <td>${est.nombre}</td>  
                                                <td>${est.correo}</td>                
                                                <td>${est.telefono}</td>
                                                <td><button type="button" class="btn btn-danger">Eliminar</button></td>
                                                </tr>`
                                            }     
                                        });
                                        
                                        if(tablaEstudiante != ""){
                                            tablaEstudiante = tablaEstudiante +
                                            `  </tbody>
                                            </table>`;
                                            texto = texto + tablaEstudiante;
                                        }
            texto = texto +
                                    `</div>
                                    </div>
                                </div>                    
                            </div>`;
            if(i % 2 == 0){
                texto = texto + 
                    '</div>'
            }
            i=i+1;
        });
        texto = texto + 
                `</div></div>`;

    }
    return texto;
});

hbs.registerHelper('listar-cursos-docente-cerrados', () => {
    let texto = "";
    listaEstudiantes = [];
    listaCursos = require('./bd-cursos.json')
    listaEstudiantes = require('./estudiantes.json')
    listadoCursosEstudiantes = require('./cursos-estudiantes.json')

    let cursos = listaCursos.filter(buscar => buscar.estado == "Cerrado");    
    if (cursos.length == 0){
        console.log('No existen cursos disponibles');
        texto = '<div class="alert alert-danger" role="alert">' +
                    'No existen cursos disponibles' +
                '</div>';
    }
    else {
        texto = `<div class="accordion" id="accordionExample">`;
        i = 1;
        cursosEstudiantes = [];
        cursos.forEach(curso => {
            if(i % 2 != 0){
                texto = texto + 
                    '<div class="row">'
            }
            texto = texto +            
                            `<div class="col">            
                                <div class="card">
                                    <div class="card-header text-center id="heading${i}">
                                    <h2 class="mb-0">
                                        <button class="btn btn-link" type="button" data-toggle="collapse" data-target="#collapse${i}" aria-expanded="true" aria-controls="collapse${i}">
                                            Curso: ${curso.nombre} - (id: ${curso.id}) - 
                                            <form class="form-inline" action="/listado-cursos-docente-abrir" method="POST">                                           
                                                <button class="btn btn-outline-success" name="id" value="${curso.id}">Abrir Curso</button>
                                            </form>
                                        </button>

                                        
                                        
                                    </h2>
                                    </div>        
                                    <div id="collapse${i}" class="collapse" aria-labelledby="heading${i}" data-parent="#accordionExample">
                                    <div class="card-body">`
                                        cursosEstudiantes = listadoCursosEstudiantes.filter(buscar => buscar.curso == curso.id);

                                        if (cursosEstudiantes.length == 0){
                                            texto = texto +                       
                                            `<strong>EL CURSO NO TIENE ESTUDIANTES</strong>`
                                        }
                                        
                                        let tablaEstudiante = "";
                                        cursosEstudiantes.forEach(curEstudiante => {
                                            let est = listaEstudiantes.find(buscar => buscar.documento == curEstudiante.documento);
                                            if (!est){

                                            }
                                            else {

                                                if(tablaEstudiante == ""){
                                                    tablaEstudiante = 
                                                    `<table class="table table-striped">
                                                        <thead>
                                                            <tr>
                                                            <th scope="col">Documento</th>
                                                            <th scope="col">Nombre</th>
                                                            <th scope="col">Correo</th>
                                                            <th scope="col">Telefono</th>
                                                            <th scope="col">Eliminar</th>
                                                            </tr>
                                                        </thead>
                                                    <tbody>`;
                                                }

                                                tablaEstudiante = tablaEstudiante +
                                                `<tr>
                                                <th scope="row">${est.documento}</th>
                                                <td>${est.nombre}</td>  
                                                <td>${est.correo}</td>                
                                                <td>${est.telefono}</td>
                                                <td><button type="button" class="btn btn-danger">Eliminar</button></td>
                                                </tr>`
                                            }     
                                        });
                                        
                                        if(tablaEstudiante != ""){
                                            tablaEstudiante = tablaEstudiante +
                                            `  </tbody>
                                            </table>`;
                                            texto = texto + tablaEstudiante;
                                        }
            texto = texto +
                                    `</div>
                                    </div>
                                </div>                    
                            </div>`;
            if(i % 2 == 0){
                texto = texto + 
                    '</div>'
            }
            i=i+1;
        });
        texto = texto + 
                `</div></div>`;

    }
    return texto;
});

hbs.registerHelper('crearCurso', (id, nombre, modalidad, valor, descripcion, intensidad) => {

    const fs = require('fs');
    listaCursos = [];
    texto = '';

    //Listar
    listaCursos = require('./bd-cursos.json');

    console.log(modalidad);
    console.log(descripcion);

    let cur = {
        id: id,
        nombre: nombre,
        modalidad: modalidad,
        valor: valor,
        descripcion: descripcion,
        intensidad: intensidad,
        estado: 'Disponible'        
    };
    let duplicado = listaCursos.find(curso => curso.id == id);
    if (!duplicado){

        listaCursos.push(cur);
        //Guardar
        let datos = JSON.stringify (listaCursos);
        fs.writeFile('./src/bd-cursos.json', datos, function (err) {
            if (err) throw err;
        });
        texto = `<div  class="alert alert-success" role="alert">
                    Curso creado con Exito
                </div>`;

    }
    else{
        texto = '<div class="alert alert-danger" role="alert">' +
                    'Ya existe un Curso con el ID ' +  id +
                '</div>';
    }

    return texto;

});

hbs.registerHelper('cerrarCurso', (id) => {

    listaCursos = [];
    estado = "estado";
    texto = '';
    //Listar
    listaCursos = require('./bd-cursos.json');
    let encontrado = listaCursos.find(buscar => buscar.id == id);
    if (!encontrado){
        texto = `<div  class="alert alert-danger" role="alert">
                    Error cambiando estado del curso a Cerrado
                </div>`;
    }
    else {
        encontrado[estado] = "Cerrado";

        let datos = JSON.stringify (listaCursos);
        fs.writeFile('./src/bd-cursos.json', datos, function (err) {
            if (err) throw err;
        });
        texto = `<div  class="alert alert-success" role="alert">
                    Curso cerrado con Exito
                </div>`;
    }

    return texto;

});

hbs.registerHelper('abrirCurso', (id) => {

    listaCursos = [];
    estado = "estado";
    texto = '';
    //Listar
    listaCursos = require('./bd-cursos.json');
    let encontrado = listaCursos.find(buscar => buscar.id == id);
    if (!encontrado){
        texto = `<div  class="alert alert-danger" role="alert">
                    Error cambiando estado del curso a Disponible
                </div>`;
    }
    else {
        encontrado[estado] = "Disponible";

        let datos = JSON.stringify (listaCursos);
        fs.writeFile('./src/bd-cursos.json', datos, function (err) {
            if (err) throw err;
        });
        texto = `<div  class="alert alert-success" role="alert">
                    Curso abierto con Exito
                </div>`;
    }

    return texto;

});
//** FIN */


//** SEBASTIÁN */
// Registro de usuarios
hbs.registerHelper('registrarUsuario', (usuario) => {
    let listaUsuarios = [];
    listaUsuarios = require('./usuario.json');

    let respuesta = '';

    //Armo el objeto de curso
    let nuevoUsuario = {
        id: usuario.id,
        nombre: usuario.nombre,
        correo: usuario.correo,
        telefono: usuario.telefono,
        contrasena: usuario.contrasena,
        tipo: usuario.tipo
    };

    //Valido que no permita guardar duplicados
    let duplicado = listaUsuarios.find(usr => usr.id === nuevoUsuario.id);
    if(!duplicado)
    {
        listaUsuarios.push(nuevoUsuario);
        let datos = JSON.stringify(listaUsuarios);
        fs.writeFile('src/usuario.json', datos, (err)=>{
            if(err) console.log(err);
            console.log('Archivo creado con éxito');
        });

        respuesta = "El usuario " + nuevoUsuario.nombre + ' con documento de identidad ' + nuevoUsuario.id  + " fue creado de manera exitosa!";
    }
    else
    {
        respuesta = "No se fue posible registrar el usuario" + nuevoUsuario.nombre + ' con documento de identidad ' + nuevoUsuario.id + '. Ya existe otro usuario con es documento.';
    }

    return respuesta;
});

// listado de usuarios
hbs.registerHelper('listarUsuarios', () => {
    let listaUsuarios = [];
    listaUsuarios = require('./usuario.json');

    let texto = "<table class='table'> \
                    <thead class='thead-dark'> \
                    <th>Documento de identidad </th>\
                    <th>Nombre </th>\
                    <th>Correo </th>\
                    <th>Teléfono </th>\
                    <th>Rol </th>\
                    </theader> \
                <tbody>";
    
    listaUsuarios.forEach(usuario => {
        texto = texto +            
            "<tr>" +
            "<td>" + usuario.id + '</td>' +
            "<td>" + usuario.nombre + '</td>' +
            "<td>" + usuario.correo + '</td>' +
            "<td>" + usuario.telefono + '</td>' +
            "<td>" + usuario.tipo + '</td>' +
            "<tr>"
    });
    texto = texto + "</tbody></table>"

    return texto;
});

// listado de usuarios en select
hbs.registerHelper('listarUsuariosSelect', () => {
    let listaUsuarios = [];
    listaUsuarios = require('./usuario.json');

    let texto = '<select class="form-control" name="id"><option value="">Usuarios...</option>'
    
    listaUsuarios.forEach(usuario => {
        texto = texto + '<option value="' + usuario.id + '">' + usuario.id + ' | ' + usuario.nombre + '</option>';
    });

    texto = texto + "</select>";

    return texto;
});

// listado de roles en select o si es administrador no permite cambiarlo
hbs.registerHelper('listarRolesUsuarios', (id) => {
    let listaUsuarios = [];
    listaUsuarios = require('./usuario.json');

    //Obtengo el usuario basado en el id
    let usuario = listaUsuarios.find(usr => (usr.id === id));
    console.log(usuario);

    let texto = '<select class="form-control" name="tipo" ';
    if(usuario.tipo == 'administrador')
    {
        texto = texto + 'readonly disabled> \
        <option value="administrador" selected>Administrador</option> \
        <option value="aspirante">Aspirante</option> \
        <option value="docente">Docente</option>';
    }
    else if(usuario.tipo == 'docente')
    {
        texto = texto + '><option value="aspirante">Aspirante</option><option value="docente" selected>Docente</option>'
    }
    else if(usuario.tipo == 'aspirante')
    {
        texto = texto + '><option value="aspirante" selected>Aspirante</option><option value="docente">Docente</option>'
    };

    texto = texto + "</select>";

    return texto;
});

// Actaulización de usuarios
hbs.registerHelper('actualizarUsuario', (usuario) => {
    let listaUsuarios = [];
    listaUsuarios = require('./usuario.json');

    let respuesta = '';

    //Valido que no permita guardar duplicados
    let encontrado = listaUsuarios.find(usr => usr.id === usuario.id);
    if(encontrado)
    {
        encontrado['id'] = usuario.id;
        encontrado['nombre'] = usuario.nombre;
        encontrado['correo'] = usuario.correo;
        encontrado['telefono'] = usuario.telefono;
        encontrado['contrasena'] = usuario.contrasena;
        encontrado['tipo'] = usuario.tipo;

        let datos = JSON.stringify(listaUsuarios);
        fs.writeFile('src/usuario.json', datos, (err)=>{
            if(err) console.log(err);
            console.log('Archivo creado con éxito');
        });

        respuesta = "El usuario " + usuario.nombre + ' con documento de identidad ' + usuario.id  + " fue actualizado de manera exitosa!";
    }
    else
    {
        respuesta = "No se fue posible actualizar el usuario" + usuario.nombre + ' con documento de identidad ' + usuario.id + '. No existe usuario con ese documento.';
    }

    return respuesta;
});

//** FIN SEBASTIÁN */

/* Walter */
hbs.registerHelper('listarCursos',()=>{
	listaCursos=require('./bd-cursos.json');
	let texto = "<label for='curso'>Cursos disponibles</label> \
					<select class='form-control' name='curso' required>";
	listaCursos.forEach(curso => {
		if ( curso.estado == "Disponible")
		{
			texto = texto + 
			'<option>' + curso.nombre + '</option>';
		}		
	});
	
	texto = texto + '</select>' ;
	return texto;
});



hbs.registerHelper('incripcionCursos',(documento,nombre,correo,telefono,curso)=>{
	console.log('PASO.');
	let est = crearEstudiante(documento,nombre,correo,telefono,curso);
	let result = crearEstudianteCurso(documento,curso);
	let texto = "";
	if ( result )
	{
		texto =  "<h2> Estudiante  " + est.nombre + " inscrito con exito en el curso " + curso + "</h2>"
	}
	else
	{
		texto =  "<div class='alert alert-danger' role='alert'> Ya está registrado en este curso</div>" 
	}
	return texto;
});

const crearEstudiante = (documento,nombre,correo,telefono,curso)=>{
	listarEstd();
	console.log("LISTARRRR::: " + listaEstudiantes);
	let est = {
		documento: documento,
		nombre: nombre,
		correo: correo,
		telefono: telefono
	};
	let duplicado = listaEstudiantes.find(doc=>doc.documento==documento);
	if(!duplicado)
	{
		listaEstudiantes.push(est);
		console.log(listaEstudiantes);
		guardarEstudiante();
		console.log('Guardado.');
	}
	else
	{
		console.log('Ya existe otro estudiante con ese documento.' + duplicado.documento);
	}
	return est;
	
}

const guardarEstudiante=()=>{
	let datos = JSON.stringify(listaEstudiantes);
	fs.writeFile('./src/estudiantes.json',datos,(err)=>{
		if(err)throw (err);
		console.log('Archivo creado con exito');
	})
}

const listarEstd = () => {
	try {
		listaEstudiantes = require('./estudiantes.json');
		//Esta funcion se utiliza para procesos asincronos
		//listaEstudiantes = JSON.parse(fs.readFileSync('listado.json'));
	}
	catch(error){
		listaEstudiantes = [];
	}	
}

const crearEstudianteCurso = (documento,curso)=>{
	listarEstudiantesCursos();
	listarCursos();
	console.log("Cursosprimero::: " + listaCursos);
	let cursoSelec = listaCursos.find(cur=>cur.nombre==curso);	
	console.log("Cursos::: " + cursoSelec);
	let estCurso = {
		documento: documento,
		curso: cursoSelec.id
	};
	console.log("curso seleccionado : " + cursoSelec.nombre + " - id::" + cursoSelec.id);
	let duplicado = listaEstudiantesCursos.find(doc=>doc.documento + doc.curso == documento + cursoSelec.id);
	if(!duplicado)
	{
		listaEstudiantesCursos.push(estCurso);
		console.log(listaEstudiantesCursos);
		guardarEstudianteCursos();
		console.log('Guardado.');
	}
	else
	{
		return false;
	}	
	return true;
}


const listarEstudiantesCursos = () => {
	try {
		listaEstudiantesCursos = require('./cursos-estudiantes.json');
		//Esta funcion se utiliza para procesos asincronos
		//listaEstudiantes = JSON.parse(fs.readFileSync('listado.json'));
	}
	catch(error){
		listaEstudiantesCursos = [];
	}	
}
const listarCursos = () => {
	try {
		listaCursos = require('./bd-cursos.json');
		//Esta funcion se utiliza para procesos asincronos
		//listaEstudiantes = JSON.parse(fs.readFileSync('listado.json'));
	}
	catch(error){
		listaCursos = [];
	}	
}

hbs.registerHelper('listarMisCursos',()=>{
	//listarCursosEstudiantes=require('./cursos-estudiantes.json');	
	listaEstudiantesCursos = [];
	console.log("PAOS listarMisCursos::::" + listaEstudiantesCursos.length);
	
	listaCursosEstudiantes();
	listaCursos=require('./bd-cursos.json');
	listaEstudiantes = require('./estudiantes.json');
	let texto = "";
	console.log("listaEstudiantesCursos.length:::" + listaEstudiantesCursos.length);
	if( listaEstudiantesCursos.length >= 1 )
	{
		console.log("PAOS crear table::::" + listaEstudiantesCursos.length);
		texto = "<table class='table'> \
					<thead class='thead-dark'> \
						<tr> \
							<th scope='documento'>Documento</th>\
							<th scope='nombre'>Estudiante</th>\
							<th scope='idCurso'>idCurso</th>\
							<th scope='curso'>Curso</th>\
							<th scope='eliminar'>Eliminar</th>\
						</tr>\
					</thead> \
					<tbody>";
		listaEstudiantesCursos.forEach(curso => {
			let listCurso = listaCursos.find(cur=>cur.id==curso.curso);
			let listEstudiante = listaEstudiantes.find(est=>est.documento==curso.documento);
			texto = texto + '<tr>';
			texto = texto + '<td>' + curso.documento + '</td>';
			texto = texto + '<td>' + listEstudiante.nombre + '</td>';
			texto = texto + '<td>' + curso.curso + '</td>';
			texto = texto + '<td>' + listCurso.nombre + '</td>';
			texto = texto + '<td>' + '<button class="btn btn-primary" name="cursoest" value="' + curso.documento + curso.curso +'">Eliminar</button>' + '</td>';
			texto = texto + '</tr>';
		});
		
		texto = texto + '</tbody> </table>' ;
	}
	
	return texto;
});

hbs.registerHelper('eliminarCursoEst',(cursoest)=>{
	eliminarCursoEst(cursoest);
	let result = eliminarCursoEst(cursoest);
	let texto = "";
	if ( result )
	{
		texto =  "<h2> Curso  elminado exitosamente</h2>"
	}
	else
	{
		texto =  "<div class='alert alert-danger' role='alert'> Ya está registrado en este curso</div>" 
	}
	return texto;
	
});

const eliminarCursoEst=(cursoest)=>{
	listaCursosEstudiantes();	
	console.log("Curso a eliminar :::" + cursoest);
	let nuevo = listaEstudiantesCursos.filter(bus=> bus.documento + bus.curso != cursoest);
	console.log("nuevo::::" + nuevo.length + " --- viejo::::" + listaEstudiantesCursos.length);
	listaEstudiantesCursos = nuevo
	guardarEstudianteCursos();
	return true;
}

const guardarEstudianteCursos=()=>{
	console.log("Guardar listaEstudiantesCursos :::" + listaEstudiantesCursos.length);
	let datos = JSON.stringify(listaEstudiantesCursos);
	fs.writeFile('./src/cursos-estudiantes.json',datos,(err)=>{
		if(err)throw (err);
		console.log('Archivo creado con exito');
	})
}

const listaCursosEstudiantes = () => {
	try {
		listaEstudiantesCursos = require('./cursos-estudiantes.json');
	}
	catch(error){
		listaEstudiantesCursos = [];
	}	
}
/* Fin Walter */

/* SEBASTIÁN */
//Cargo el listado de usuarios
const listaUsuarios = () => {
    try {
        listaUsuarios = require('./cursos-estudiantes.json');
    }
    catch(error){
        listaUsuarios = [];
    }   
}

//Guardo listado de usuarios
const guardarUsuarios = () => {
    let datos = JSON.stringify(listaUsuarios);
    fs.writeFile('src/usuario.json', datos, (err)=>{
        if(err)throw (err);
        console.log('Archivo creado con exito');
    })
}

//Busco usuario por id listado de usuarios
const buscarUsuario = (id) => {
    let usuario = listaUsuarios.find(usr => (usr.id === id));

    return usuario;
}

//Busco usuario por id y contraseña listado de usuarios
const validarLogin = (id, contrasena) => {
    //Obtengo el usuario basado en el id
    let usuario = listaUsuarios.find(usr => (usr.id === id && usr.contrasena === contrasena));

    //Si no encuentro el usuario, muestro error
    if(!usuario)
    {
        console.log('El usuario y/o contraseña son incorrectos!');
        return false;
    }
    else
    {
        console.log('El usuario y contraseña correctos!');
        return true;
    }
}
/*FIN SEBASTIÁN */