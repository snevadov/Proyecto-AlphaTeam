const hbs = require('hbs');
//requiero filesystem
const fs = require('fs');

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

//** FIN SEBASTIÁN */