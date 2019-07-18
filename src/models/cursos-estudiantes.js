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
    },
    nota:{
        type: Number,
        min: [0, 'Ingrese un número mayor a 0 en la nota'], //personaliza el mensaje cuando es inferior a 0
        max: [5, 'Ingrese un número menor o igual a 5 en nota'], //personaliza el mensaje cuando es superior a 5
        default: null
    }
});

//Creo el constructor Usuario
const CursoEstudiante = mongoose.model('CursoEstudiante', cursosestudiantesSchema);

//Exporto para ser usado en otras partes
module.exports = CursoEstudiante;