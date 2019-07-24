socket = io()

// var param = new URLSearchParams(window.location.search);
// //var usuario = req.session.nombre
// var usuario = param.get('nombre')
// var usuario = param.get('documento')
var usuario = (document.querySelector('#usuario').value) ? document.querySelector('#usuario').value : null;
var documentoUsuario = (document.querySelector('#documentoUsuario').value) ? document.querySelector('#documentoUsuario').value : null;


socket.on("connect", () => {
    console.log('usuario')
    console.log(usuario)
    // console.log('res.locals');
    // console.log(res.locals);
    socket.emit('usuarioNuevoNotificacion', usuario, documentoUsuario)
})

socket.on('nuevoUsuarioNotificacion', (texto) => {
    console.log("usuarioCONECTADO::"+texto)
    //chat.innerHTML = chat.innerHTML + texto + '<br>'
    //chatPrivado.innerHTML = chatPrivado.innerHTML + `<div class="alert alert-success" role="alert">` + texto + `</div>`
})

socket.on('usuarioDesconectado', (texto) => {
    console.log("usuarioDESCONECTADO::"+texto)
    //chatPrivado.innerHTML = chatPrivado.innerHTML + texto + '<br>'
    chatPrivado.innerHTML = chatPrivado.innerHTML + `<div class="alert alert-danger" role="alert">` + texto + `</div>`
})


//Chat privado
const formularioPrivado = document.querySelector('#formularioPrivado')
//const mensajePrivado = formularioPrivado.querySelector('#textoPrivado')
//const destinatario = null //formularioPrivado.querySelector('#destinatario')
const chatPrivado = document.querySelector('#chatPrivado')


formularioPrivado.addEventListener('submit', (datos) => {
    //Evito recarga del html
    //datos.preventDefault()

    const idCurso = (document.querySelector('#idCurso').value) ? document.querySelector('#idCurso').value : null;
    const nombreProfesor = (document.querySelector('#nombreProfesor').value) ? document.querySelector('#nombreProfesor').value : null;
    const nombreCurso = (document.querySelector('#nombreCurso').value) ? document.querySelector('#nombreCurso').value : null;
    let i = 1;
    let estudiantesNotas = []
    while(document.querySelector('#estudiante'+i)){
        estudiantesNotas.push(
            {
                documento: document.querySelector('#estudiante'+i).name,
                nota: document.querySelector('#estudiante'+i).value
            }
        )
        i++
    }

    //Envío el valor del input texto
    socket.emit("textoPrivado", {
        estudiantesNotas: estudiantesNotas,
        idCurso: idCurso,
        nombreProfesor: nombreProfesor,
        nombreCurso: nombreCurso
    }, () => {
        chatPrivado.innerHTML = chatPrivado.innerHTML + ''
            //console.log('FIN')
    })

    //datos.currentTarget.submit();
})

socket.on("textoPrivado", (text) =>{
    console.log('Socket.on::::::::::::::::::::::');
    console.log(text);
    chatPrivado.innerHTML = chatPrivado.innerHTML + `<div class="alert alert-success alert-dismissible fade show" role="alert">
    <strong>Actualización de notas!</strong><br>` + text + `.
    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
      <span aria-hidden="true">&times;</span>
    </button>
  </div>`
})