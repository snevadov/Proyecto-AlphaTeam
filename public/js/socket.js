socket = io()

var param = new URLSearchParams(window.location.search)
var usuario = param.get('nombre')

socket.on("connect", () => {
    console.log(usuario)
    socket.emit('usuarioNuevo', usuario)
})

socket.on('nuevoUsuario', (texto) => {
    console.log(texto)
    chat.innerHTML = chat.innerHTML + texto + '<br>'
})

const formulario = document.querySelector('#formulario')
const mensaje = formulario.querySelector('#texto')
const chat = document.querySelector('#chat')

formulario.addEventListener('submit', (datos) => {
    datos.preventDefault()
    const texto = datos.target.elements.texto.value
    const nombre = datos.target.elements.nombre.value
    socket.emit('texto', {
        nombre: nombre,
        mensaje: texto}, () => {
            mensaje.value = ''
            mensaje.focus()
        }
    )
})

socket.on("texto", (text) => {
    console.log(text)
    chat.innerHTML = chat.innerHTML + text.nombre + ':' + text.mensaje + '<br>'
})