class Usuarios{

    constructor(){
        this.usuarios = [];
    }

    agregarUsuario(id, nombre){
        let usuario = {id, nombre}
        this.usuarios.push(usuario)
        return this.usuarios;
    }

    agregarUsuarioConDocumento(id, nombre, documento){
        let usuario = {id, nombre, documento}
        this.usuarios.push(usuario)
        return this.usuarios;
    }

    getUsuarios(){
        return this.usuarios
    }

    getUsuario(id){
        let usuario = this.usuarios.filter (user => user.id == id)[0]
        return usuario
    }

    borrarUsuario(id){
        let usuarioBorrado = this.getUsuario(id)
        this.usuarios = this.usuarios.filter( user => user.id != id)
        return usuarioBorrado
    }

    getDestinatario(documento){
        let destinatario = this.usuarios.filter( user => user.documento == documento)[0]
        return destinatario
    }
}

module.exports = {
    Usuarios
}