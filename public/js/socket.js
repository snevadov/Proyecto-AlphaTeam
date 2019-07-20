socket = io()

var param = new URLSearchParams(window.location.search);
//var usuario = req.session.nombre
var usuario = param.get('nombre')


socket.on("connect", () => {
    console.log(usuario)
    socket.emit('usuarioNuevo', usuario)
})

socket.on('nuevoUsuario', (texto) => {
    console.log("usuarioCONECTADO::"+texto)
    chat.innerHTML = chat.innerHTML + texto + '<br>'
})

socket.on('usuarioDesconectado', (texto) => {
    console.log("usuarioDESCONECTADO::"+texto)
    chat.innerHTML = chat.innerHTML + texto + '<br>'
})


formulario = document.querySelector('#formulario')
const mensaje = formulario.querySelector('#texto')
chat = document.querySelector('#chat')

formulario.addEventListener('submit', (datos) => {
    datos.preventDefault()
    console.log("que chimbada "+mensaje.value)
    socket.emit('texto', mensaje.value, () => {
            mensaje.value = ''
            mensaje.focus()
        }
    )
})

socket.on("texto", (text) => {
    console.log(text)
    chat.innerHTML = chat.innerHTML + text + '<br>'
})