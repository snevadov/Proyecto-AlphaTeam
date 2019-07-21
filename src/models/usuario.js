// ##### MODELO PARA EL MANEJO DE USUARIOS ##### //
//Importo mongoose y el manejo de Schema
const mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema;

//Creo el Schema Usuario
const usuarioSchema = new Schema({
    documento:{
        type: Number,
        required: true,
        trim: true,
        unique: true //Vuelve único el documento
    },
    nombre:{
        type: String,
        required: true
    },
     correo:{
        type: String,
        required: true,
        trim: true
    },
    telefono:{
        type: String,
        required: true
    },
    contrasena:{
        type: String,
        required: true
    },
    tipo: {
        type: String,
        required: true,
        enum: {values:['aspirante','docente','coordinador'], message: "El campo tipo solo permite Aspirante, Docente o Administrador"}, //Valida que solo permita algunos valores y personaliza mensaje
        default: 'aspirante'
    }
});

//Activo el uniqueValidator
usuarioSchema.plugin(uniqueValidator, { message: 'El {PATH} {VALUE} se encuentra repetido.' });

//Creo el constructor Usuario
const Usuario = mongoose.model('Usuario', usuarioSchema);

//Exporto para ser usado en otras partes
module.exports = Usuario;