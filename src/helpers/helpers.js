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
hbs.registerHelper('listar-cursos', (respuesta, err) => {
    //listaCursos = require('./bd-cursos.json');
    //listaCursos = JSON.parse(fs.readFileSync('src/bd-cursos.json', 'utf8'));

    if(err){
        console.log("err")
        return console.log(err)
    }

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
    
    respuesta.forEach(curso => {
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

hbs.registerHelper('listar-cursos-disponibles', (respuesta, err) => {

    console.log("listar-cursos-disponibles")
    let texto = "";
    console.log(err)
		if(err){
            console.log("err")
			return console.log(err)
		}
        console.log("Objeto respuesta::::::::::." + respuesta);
        if (respuesta.length == 0){
            console.log('No existen cursos disponibles');
            texto = '<div class="alert alert-danger" role="alert">' +
                        'No existen cursos disponibles' +
                    '</div>';
        }
        else {

            console.log('cursos disponibles antes del for');

            texto = `<div class="accordion" id="accordionExample"> 
                            <div class="row">`;
            i = 1;
            respuesta.forEach(curso => {
                console.log('cursos disponibles dentro del for');
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
    //let msg = texto;
    console.log("QUE PASA");
    //console.log("texto R " + texto);
    return texto;   
        
 

});
        


hbs.registerHelper('listar-cursos-docente-disponibles', (listaCursos, listaEstudiantes, listaCursosEstudiantes, listaDocentes) => {
    let texto = "";
    //listaCursos = [];
    //listaEstudiantes = [];
    //listadoCursosEstudiantes = [];
    //listaCursos = JSON.parse(fs.readFileSync('src/bd-cursos.json', 'utf8'));
    //listaEstudiantes = JSON.parse(fs.readFileSync('src/estudiantes.json', 'utf8'));
    //listadoCursosEstudiantes = JSON.parse(fs.readFileSync('src/cursos-estudiantes.json', 'utf8'));

    //console.log("listaUsuarios ADENTRO: ");
    //console.log(listaCursos);

    //console.log("listaEstudiantes ADENTRO: ");
    //console.log(listaEstudiantes);

    //console.log("listaCursosEstudiantes ADENTRO: ");
    //console.log(listaCursosEstudiantes);

    //console.log("listaDocentes ADENTRO: ");
    //console.log(listaDocentes);
    

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
                                                
                                                <button class="btn btn-outline-danger" name="idCurso" value="${curso.id}">Cerrar Curso</button>

                                                <div class="form-group">
                                                    <select class="form-control" name="docente" required>
                                                        <option value="" selected>Seleccionar docente</option>`
                                                        
                                                        listaDocentes.forEach(docente => {
                                                        texto = texto + 
                                                        `<option value="${docente.documento}">${docente.nombre}</option>`
                                                        }); 

                                                    texto = texto +
                                                    `</select>
                                                </div>                                                        
                                            </form>                                        
                                        </button>                                                                        
                                    </h2>
                                    </div>        
                                    <div id="collapseD${i}" class="collapse" aria-labelledby="headingD${i}" data-parent="#accordionExampleD">
                                    <div class="card""-body">`
                                        console.log("curso.nombre> " + curso.nombre);
                                        cursosEstudiantes = listaCursosEstudiantes.filter(buscar => buscar.curso == curso.id);

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
                                                    var fecha= new Date();
                                                    tablaEstudiante = 
                                                    `<table class="table table-striped${fecha}">
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
                                                <td>
                                                    <form action="/eliminarCursoDocente" method="POST">
                                                        <button  class="btn btn-danger" name="cursoest" value="` + est.documento + "|" +  curso.id +`">Eliminar</button>
                                                    </form>
                                                </td>
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

hbs.registerHelper('listar-cursos-docente-cerrados', (listaCursos, listaEstudiantes, listaCursoEstudiante) => {
    let texto = "";
    //listaEstudiantes = [];
    //listaCursos = JSON.parse(fs.readFileSync('src/bd-cursos.json', 'utf8'));
    //listaEstudiantes = JSON.parse(fs.readFileSync('src/estudiantes.json', 'utf8'));
    //listadoCursosEstudiantes = JSON.parse(fs.readFileSync('src/cursos-estudiantes.json', 'utf8'));

    

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
                                                <button class="btn btn-outline-success" name="idCurso" value="${curso.id}">Abrir Curso</button>
                                            </form>
                                        </button>
                                        
                                        
                                    </h2>
                                    </div>        
                                    <div id="collapse${i}" class="collapse" aria-labelledby="heading${i}" data-parent="#accordionExample">
                                    <div class="card-body">`
                                        cursosEstudiantes = listaCursoEstudiante.filter(buscar => buscar.curso == curso.id);

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

hbs.registerHelper('crearCurso', (resultado, err) => {
    console.log("err " + err)
    if (err){
        texto = '<div class="alert alert-danger" role="alert">' +
                    'ERROR al crear un Curso - ' + err +
                '</div>';        
    }
    else{
        texto = `<div  class="alert alert-success" role="alert">
                    Curso creado con Exito
                </div>`;
    }

    return texto;

});

hbs.registerHelper('cerrarCurso', (id, respuestaActualizar, err) => {

    console.log("err " + err)
    if (err){
        texto = `<div  class="alert alert-danger" role="alert">
                    Error cambiando estado del curso a Cerrado
                </div>`;     
    }
    else{
        texto = `<div  class="alert alert-success" role="alert">
                    Curso cerrado con Exito
                </div>`;
    }

    return texto;

});

hbs.registerHelper('abrirCurso', (id, respuestaActualizar, err) => {

    console.log("err " + err)
    if (err){
        texto = `<div  class="alert alert-danger" role="alert">
                    Error cambiando estado del curso a Disponible
                </div>`;     
    }
    else{
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
    listaUsuarios = JSON.parse(fs.readFileSync('src/estudiantes.json'));
    //listaUsuarios = require('./estudiantes.json');

    let respuesta = '';

    //Armo el objeto de curso
    let nuevoUsuario = {
        documento: usuario.documento,
        nombre: usuario.nombre,
        correo: usuario.correo,
        telefono: usuario.telefono,
        contrasena: usuario.contrasena,
        tipo: usuario.tipo
    };

    //Valido que no permita guardar duplicados
    let duplicado = listaUsuarios.find(usr => usr.documento === nuevoUsuario.documento);
    if(!duplicado)
    {
        listaUsuarios.push(nuevoUsuario);
        let datos = JSON.stringify(listaUsuarios);
        fs.writeFileSync('src/estudiantes.json', datos, (err)=>{
            if(err) console.log(err);
            console.log('Archivo creado con éxito');
        });

        respuesta = "El usuario " + nuevoUsuario.nombre + ' con documento de identidad ' + nuevoUsuario.documento  + " fue creado de manera exitosa!";
    }
    else
    {
        respuesta = "No se fue posible registrar el usuario" + nuevoUsuario.nombre + ' con documento de identidad ' + nuevoUsuario.documento + '. Ya existe otro usuario con es documento.';
    }

    return respuesta;
});

// listado de usuarios
hbs.registerHelper('listarUsuarios', (listaUsuarios) => {

    let texto = "<table class='table'> \
                    <thead class='thead-dark'> \
                    <th>Documento de identidad </th>\
                    <th>Nombre </th>\
                    <th>Correo </th>\
                    <th>Teléfono </th>\
                    <th>Rol </th>\
                    <th></th>\
                    </theader> \
                <tbody>";
    
    listaUsuarios.forEach(usuario => {
        texto = texto +            
            "<tr>" +
            "<td>" + usuario.documento + '</td>' +
            "<td>" + usuario.nombre + '</td>' +
            "<td>" + usuario.correo + '</td>' +
            "<td>" + usuario.telefono + '</td>' +
            "<td>" + usuario.tipo + '</td>' +
            '<td>' + '<button class="btn btn-primary" name="id" value="' + usuario._id +'">Actualizar</button>' + '</td>' +
            "<tr>"
    });
    texto = texto + "</tbody></table>"

    return texto;
});

// listado de usuarios en select
hbs.registerHelper('listarUsuariosSelect', () => {
    let listaUsuarios = [];
    //listaUsuarios = require('./estudiantes.json');
    listaUsuarios = JSON.parse(fs.readFileSync('src/estudiantes.json'));

    let texto = '<select class="form-control" name="documento" required><option value="">Usuarios...</option>'
    
    listaUsuarios.forEach(usuario => {
        texto = texto + '<option value="' + usuario.documento + '">' + usuario.documento + ' | ' + usuario.nombre + '</option>';
    });

    texto = texto + "</select>";

    return texto;
});

// listado de roles en select o si es administrador no permite cambiarlo
hbs.registerHelper('listarRolesUsuarios', (tipo) => {

    let texto = '';
    let campoTipo = '';
    if(tipo == 'coordinador')
    {
        texto = texto + '<select class="form-control" name="tipoNoLeer" readonly disabled> \
        <option value="coordinador" selected>Coordinador</option> \
        <option value="aspirante">Aspirante</option> \
        <option value="docente">Docente</option> \
        </select> \
        <input type="hidden"  class="form-control" name="tipo" value="coordinador">';
    }
    else if(tipo == 'docente')
    {
        texto = texto + '<select class="form-control" name="tipo"> \
            <option value="aspirante">Aspirante</option> \
            <option value="docente" selected>Docente</option> \
            </select>';
    }
    else if(tipo == 'aspirante')
    {
        texto = texto + '<select class="form-control" name="tipo"> \
        <option value="aspirante" selected>Aspirante</option> \
        <option value="docente">Docente</option> \
        </select>';
    };

    return texto;
});

// Actaulización de usuarios
hbs.registerHelper('actualizarUsuario', (respuesta) => {
    return respuesta;
});

//** FIN SEBASTIÁN */

/* Walter */
hbs.registerHelper('listarCursos',(listado)=>{
    //listaCursos=require('./bd-cursos.json');
    //listaCursos = JSON.parse(fs.readFileSync('src/bd-cursos.json', 'utf8'));
    console.log('LISTADOOOO' + listado);
    let texto = "<label for='curso'>Cursos disponibles</label> \
                    <select class='form-control' name='curso' required>";
    listado.forEach(curso => {
        if ( curso.estado == "Disponible")
        {
            texto = texto + 
            '<option value="'+ curso.id + '">' + curso.nombre + '</option>';
        }       
    });
    
    texto = texto + '</select>' ;
    return texto;
});

hbs.registerHelper('incripcionCursos',(mostrar, texto)=>{	
	console.log('texto::::' + texto);
    if ( texto == "OK" )
    {
        label =  "<h2> Estudiante  inscrito con exito en el curso </h2>"
    }
    else
    {
        label =  "<div class='alert alert-danger' role='alert'> Ya está registrado en este curso</div>" 
    }
    return label;
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
    fs.writeFileSync('./src/estudiantes.json',datos,(err)=>{
        if(err)throw (err);
        console.log('Archivo creado con exito');
    })
}

const listarEstd = () => {
    try {
        //listaEstudiantes = require('./estudiantes.json');
		listaEstudiantes = JSON.parse(fs.readFileSync('src/estudiantes.json', 'utf8'));
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
        //listaEstudiantesCursos = require('./cursos-estudiantes.json');
		listaEstudiantesCursos = JSON.parse(fs.readFileSync('src/cursos-estudiantes.json', 'utf8'));
        //Esta funcion se utiliza para procesos asincronos
        //listaEstudiantes = JSON.parse(fs.readFileSync('listado.json'));
    }
    catch(error){
        listaEstudiantesCursos = [];
    }   
}
const listarCursos = () => {
    try {
        //listaCursos = require('./bd-cursos.json');
		listaCursos = JSON.parse(fs.readFileSync('src/bd-cursos.json', 'utf8'));
        //Esta funcion se utiliza para procesos asincronos
        //listaEstudiantes = JSON.parse(fs.readFileSync('listado.json'));
    }
    catch(error){
        listaCursos = [];
    }   
}

hbs.registerHelper('listarMisCursos',(listaCursos, listaEstudiantes ,listaCursosEstudiantes, usuario)=>{
	
    let texto = "";
    console.log("listaCursos.length:::" + listaCursos);
    console.log("listaEstudiantes.length:::" + listaEstudiantes);
    console.log("listaCursosEstudiantes.length:::" + listaCursosEstudiantes);
    console.log("usuario.length:::" + usuario);
    if( listaCursosEstudiantes.length >= 1 )
    {
		
        console.log("PAOS crear table::::" + listaCursosEstudiantes.length);
        texto = "<table class='table'> \
                    <thead class='thead-dark'> \
                        <tr> \
                            <th scope='documento'>Documento</th>\
                            <th scope='nombre'>Estudiante</th>\
                            <th scope='idCurso'>idCurso</th>\
                            <th scope='curso'>Curso</th>\
                            <th scope='curso'>Nota</th>\
                            <th scope='eliminar'>Eliminar</th>\
                        </tr>\
                    </thead> \
                    <tbody>";
            listaCursosEstudiantes.forEach(curso => {
			if ( usuario == curso.documento)
			{
				let listCurso = listaCursos.find(cur=>cur.id==curso.curso);
                let listEstudiante = listaEstudiantes.find(est=>est.documento==curso.documento);
                let nota = (curso.nota) ? curso.nota : '-';
				texto = texto + '<tr>';
				texto = texto + '<td>' + curso.documento + '</td>';
				texto = texto + '<td>' + listEstudiante.nombre + '</td>';
				texto = texto + '<td>' + curso.curso + '</td>';
                texto = texto + '<td>' + listCurso.nombre + '</td>';
                texto = texto + '<td>' + nota + '</td>';
				texto = texto + '<td>' + '<button class="btn btn-primary" name="cursoest" value="' +  curso.curso +'">Eliminar</button>' + '</td>';
				texto = texto + '</tr>';
			}
            
        });
        
        texto = texto + '</tbody> </table>' ;
    }
    
    return texto;
});

hbs.registerHelper('eliminarCursoEst',(texto, mostrar)=>{
    let label = "";    
    console.log('texto::::' + texto);
    if ( texto == "OK" )
    {
        label =  "<h2> Estudiante  eliminado del curso exitosamente </h2>"
    }
    else
    {
        label =  "<div class='alert alert-danger' role='alert'> " + mostrar + "</div>" 
    }
    return label;    
});

const eliminarCursoEst=(cursoest)=>{
    listaCursosEstudiantes();   
    console.log("Curso a eliminar :::" + cursoest);
    let nuevo = listaEstudiantesCursos.filter( bus => bus.documento.toString() + bus.curso.toString() != cursoest); 
    listaEstudiantesCursos = nuevo
    guardarEstudianteCursos();
    return true;
}

const guardarEstudianteCursos=()=>{
    console.log("Guardar listaEstudiantesCursos :::" + listaEstudiantesCursos.length);
    let datos = JSON.stringify(listaEstudiantesCursos);
    console.log("datos:::::" + datos);
    fs.writeFileSync('./src/cursos-estudiantes.json',datos,(err)=>{
        if(err)throw (err);
        console.log('Archivo creado con exito');
    })
}

const listaCursosEstudiantes = () => {
    try {
        //listaEstudiantesCursos = require('./cursos-estudiantes.json');
		listaEstudiantesCursos = JSON.parse(fs.readFileSync('src/cursos-estudiantes.json', 'utf8'));
    }
    catch(error){
        listaEstudiantesCursos = [];
    }   
}
/* Fin Walter */

/* SEBASTIÁN */
//Cargo el listado de usuarios
const cargarListaUsuarios = () => {
    try {
        listaUsuarios = JSON.parse(fs.readFileSync('src/estudiantes.json'));
    }
    catch(error){
        listaUsuarios = [];
    }

    return listaUsuarios;
}

//Guardo listado de usuarios
const guardarUsuarios = () => {
    let datos = JSON.stringify(listaUsuarios);
    fs.writeFileSync('src/estudiantes.json', datos, (err)=>{
        if(err)throw (err);
        console.log('Archivo creado con exito');
    })
}

//Busco usuario por documento listado de usuarios
const buscarUsuario = (documento) => {
	console.log("%%%%%%%%%%buscarUsuario- documento:::::::::" + documento);
    let listaUsuarios = cargarListaUsuarios();
    let usuario = listaUsuarios.find(usr => (usr.documento == documento));
    return usuario;
}

//Busco usuario por documento y contraseña listado de usuarios
const validarLogin = (documento, contrasena) => {
    let listaUsuarios = cargarListaUsuarios();
    //Obtengo el usuario basado en el documento
    let usuario = listaUsuarios.find(usr => (usr.documento == documento && usr.contrasena === contrasena));

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

//Se arma el HTML del listado de los cursos de los docentes
hbs.registerHelper('listarMisCursosDocente', (listaCursos, listaEstudiantes, listaCursosEstudiantes) => {
    
    let texto = "";
    if (listaCursos.length == 0){
        console.log('No existen cursos asignados');
        texto = '<div class="alert alert-danger" role="alert">' +
                    'No existen cursos asignados' +
                '</div>';
    }
    else {
        texto = `<div class="accordion" id="accordionExample"> 
                        <div class="row">`;
        i = 1;
        
        listaCursos.forEach(curso => {
            texto = texto +            
                            `<div class="col">            
                                <div class="card">
                                    <div class="card-header" id="heading${i}">
                                        <h2 class="mb-0">
                                            <form class="form-inline" action="/calificar-curso" method="POST">  
                                                <button class="btn btn-link" type="button" data-toggle="collapse" data-target="#collapse${i}" aria-expanded="true" aria-controls="collapse${i}">
                                                    <b>ID:</b> ${curso.id} - <b>Nombre:</b> ${curso.nombre}
                                                </button>`;
                                                
            if(curso.estado == 'Cerrado'){
                texto = texto +`<button class="btn btn-outline-success" name="idCurso" value="${curso.id}">Calificar</button>`;
            }
            
            texto = texto +`
                                                
                                            </form>
                                        </h2>
                                    </div>        
                                    <div id="collapse${i}" class="collapse" aria-labelledby="heading${i}" data-parent="#accordionExample">
                                        <div class="card-body">
                                            <div class="row">
                                                <div class="col">
                                                    <b>Descripción</b>: ${curso.descripcion}
                                                </div>
                                            </div>
                                            <div class="row">
                                                <div class="col">
                                                    <b>Modalidad</b>: ${curso.modalidad}
                                                </div>
                                                <div class="col">
                                                    <b>Valor</b>: ${curso.valor}
                                                </div>
                                                <div class="col">
                                                    <b>Intensidad</b>: ${curso.intensidad}
                                                </div>
                                                <div class="col">
                                                    <b>Estado</b>: ${curso.estado}
                                                </div>
                                            </div>`;
            
            let listadoEstudiantes = []
            let cursosEstudiante = listaCursosEstudiantes.filter(buscar => buscar.curso == curso.id);
            cursosEstudiante.forEach(cursoEstudiante => {
                let estudiante = listaEstudiantes.find(est=>est.documento==cursoEstudiante.documento);
                let miEstudiante = {
                    tipo: estudiante.tipo,
                    _id: estudiante._id,
                    nombre: estudiante.nombre,
                    documento: estudiante.documento,
                    correo: estudiante.correo,
                    telefono: estudiante.telefono,
                    contrasena: estudiante.contrasena,
                    nota: (cursoEstudiante.nota) ? cursoEstudiante.nota : '-'
                };
                listadoEstudiantes.push(miEstudiante);
            });

            //Si tiene estudiantes, construyo la tabla de estudiantes
            if( listadoEstudiantes && listadoEstudiantes.length >= 1 )
            {
                texto = texto + `
                                            <div class="dropdown-divider"></div>
                                            <h3 align="center">Listado de estudiantes</h3>
                                            <div class="dropdown-divider"></div>
                                            <table class='table'>
                                                <thead class='thead-dark'>
                                                    <tr>
                                                        <th scope='documento'>Documento</th>
                                                        <th scope='nombre'>Estudiante</th>
                                                        <th scope='correo'>Correo</th>
                                                        <th scope='telefono'>Teléfono</th>
                                                        <th scope='nota'>Nota</th>
                                                    </tr>
                                                </thead>
                                                <tbody>`;
                
                //Recorro los estudiantes
                listadoEstudiantes.forEach(estudiante => {
                    texto = texto + `               <tr>
                                                        <td>${estudiante.documento}</td>
                                                        <td>${estudiante.nombre}</td>
                                                        <td>${estudiante.correo}</td>
                                                        <td>${estudiante.telefono}</td>
                                                        <td>${estudiante.nota}</td>
                                                    </tr>`;                    
                });
                
                texto = texto + `
                                                </tbody> 
                                            </table>`;
            }

            texto = texto + `
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

//Armo el listado de estudiantes
hbs.registerHelper('listar-estudiantes-calificar', (listaEstudiantes) => {
    
    //Defino la variable a retornar
    let texto = '';

    //Si tiene estudiantes, construyo la tabla de estudiantes
    let i = 0;
    if( listaEstudiantes && listaEstudiantes.length >= 1 )
    {
        texto = texto + `<table class='table'>
                            <thead class='thead-dark'>
                                <tr>
                                    <th scope='documento'>Documento</th>
                                    <th scope='nombre'>Estudiante</th>
                                    <th scope='correo'>Correo</th>
                                    <th scope='telefono'>Teléfono</th>
                                    <th scope='nota'>Nota</th>
                                </tr>
                            </thead>
                            <tbody>`;
        
        //Recorro los estudiantes
        listaEstudiantes.forEach(estudiante => {
            i++
            texto = texto + `               <tr>
                                                <td>${estudiante.documento}</td>
                                                <td>${estudiante.nombre}</td>
                                                <td>${estudiante.correo}</td>
                                                <td>${estudiante.telefono}</td>
                                                <td><input type="number" id="estudiante${i}" class="form-control" name="${estudiante.documento}" placeholder="Nota" step=".01" required></td>
                                                
                                            </tr>`;                    
        });
        
        texto = texto + `
                                        </tbody> 
                                    </table>`;
    }

    return texto;
});

/*FIN SEBASTIÁN */