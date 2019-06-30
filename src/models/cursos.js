// ##### MODELO PARA EL MANEJO DE CURSOS ##### //
//Importo mongoose y el manejo de Schema
const mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema;

//Creo el Schema Cursos
const cursosSchema = new Schema({
    id:{
        type: Number,
        required: true,
        trim: true,
        unique: true //Vuelve único el documento
    },
    nombre:{
        type: String,
        required: true
    },
    modalidad:{
        type: String,
        enum: {values:['Virtual','Presencial'], message: "El campo tipo solo permite Virtual o Presencial"}, //Valida que solo permita algunos valores y personaliza mensaje
    },
    valor:{
        type: Number,
        required: true
    },
    descripcion:{
        type: String,
        required: true
    },
    intensidad: {
        type: Number
        //enum: {values:['aspirante','docente','administrador'], message: "El campo tipo solo permite Aspirante, Docente o Administrador"}, //Valida que solo permita algunos valores y personaliza mensaje
        //default: 'aspirante'
    },
    estado:{
        type: String,
        required: true,
        default: 'Disponible'
    },
});

//Activo el uniqueValidator
cursosSchema.plugin(uniqueValidator, { message: 'El {PATH} {VALUE} se encuentra repetido.' });

//Creo el constructor Cursos
const Cursos = mongoose.model('Cursos', cursosSchema);

//Exporto para ser usado en otras partes
module.exports = Cursos;