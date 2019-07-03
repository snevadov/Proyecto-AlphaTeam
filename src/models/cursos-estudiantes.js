// ##### MODELO PARA EL MANEJO DE CURSOS ESTUDIANTES ##### //
//Importo mongoose y el manejo de Schema
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Creo el Schema Cursos Estudiantes
const cursosestudiantesSchema = new Schema({
    documento:{
        type: Number,
        required: true
    },
    curso:{
        type: Number,
        required: true
    }
});

//Creo el constructor Usuario
const CursoEstudiante = mongoose.model('CursoEstudiante', cursosestudiantesSchema);

//Exporto para ser usado en otras partes
module.exports = CursoEstudiante;