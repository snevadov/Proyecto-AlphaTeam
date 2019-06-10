const hbs = require('hbs');
const fs = require('fs');
listaEstudiantes = [];
listaEstudiantesCursos = [];
listaCursos = [];

hbs.registerHelper('obtenerPromedio', (valor) => {
return (valor*100)
});

hbs.registerHelper('listar', () => {
    listaEstudiantes = require('./listado.json')
    let texto = "<table class='table'> \
                    <thead class='thead-dark'> \
                    <th>Nombre </th>\
                    <th>Matamaticas </th>\
                    <th>Ingles </th>\
                    <th>programacion </th>\
                    </theader> \
                <tbody>";
    
    listaEstudiantes.forEach(estudiante => {
        texto = texto +            
            "<tr>" +
            "<td>" + estudiante.nombre + '</td>' +
            "<td>" + estudiante.matematicas + '</td>' +
            "<td>" + estudiante.ingles + '</td>' +
            "<td>" + estudiante.programacion + '</td>' +
            "<tr>"
    });
    texto = texto + "</tbody></table>"

    return texto;
});

hbs.registerHelper('listar2', () => {
    listaEstudiantes = require('./listado.json')
    let texto = '<div class="accordion" id="accordionExample">';
    i = 1;
    listaEstudiantes.forEach(estudiante => {
        texto = texto +            
            `<div class="card">
                <div class="card-header" id="heading${i}">
                <h2 class="mb-0">
                    <button class="btn btn-link" type="button" data-toggle="collapse" data-target="#collapse${i}" aria-expanded="true" aria-controls="collapse${i}">
                    ${estudiante.nombre}
                    </button>
                </h2>
                </div>        
                <div id="collapse${i}" class="collapse" aria-labelledby="heading${i}" data-parent="#accordionExample">
                <div class="card-body">
                    Tiene una nota en matematicas de ${estudiante.matematicas} <br>
                    Tiene una nota en ingles de ${estudiante.ingles} <br>
                    Tiene una nota en programacion de ${estudiante.programacion} <br>
                </div>
                </div>
            </div>`;

            i=i+1;
    });
    texto = texto + "</div>"

    return texto;
});

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