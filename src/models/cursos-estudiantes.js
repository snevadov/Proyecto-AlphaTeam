// ##### MODELO PARA EL MANEJO DE CURSOS ESTUDIANTES ##### //
//Importo mongoose y el manejo de Schema
const mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema;

//Creo el Schema Cursos Estudiantes
const cursosestudiantesSchema = new Schema({
    documento:{
        type: Number,
        required: true,
		unique: true //Vuelve único el documento
    },
    curso:{
        type: Number,
        required: true,
		unique: true //Vuelve único el documento
    }
});

//Activo el uniqueValidator
cursosestudiantesSchema.plugin(uniqueValidator, { message: 'El {PATH} {VALUE} se encuentra repetido.' });

//Creo el constructor Usuario
const CursoEstudiante = mongoose.model('CursoEstudiante', cursosestudiantesSchema);

//Exporto para ser usado en otras partes
module.exports = CursoEstudiante;