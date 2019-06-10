const hbs = require('hbs');

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

hbs.registerHelper('listar-cursos-docente', () => {
    let texto = "";
    listaEstudiantes = [];
    listaCursos = require('./bd-cursos.json')
    listaEstudiantes = require('./estudiantes.json')
    listaCursosEstudiantes = require('./cursos-estudiantes.json')

    let cursos = listaCursos.filter(buscar => buscar.estado == "Disponible");    
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
                                            Curso: ${curso.nombre} - (id: ${curso.id}) <button type="button" class="btn btn-outline-danger">Cerrar Curso</button>
                                        </button>
                                    </h2>
                                    </div>        
                                    <div id="collapse${i}" class="collapse" aria-labelledby="heading${i}" data-parent="#accordionExample">
                                    <div class="card-body">`
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
//** FIN */