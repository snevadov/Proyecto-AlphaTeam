process.env.PORT = process.env.PORT || 3000;

process.env.NODE_ENV = process.env.NODE_ENV || 'local';

let urlDB
if (process.env.NODE_ENV === 'local'){
	urlDB = 'mongodb://localhost:27017/asignaturas';
}
else {
	urlDB = 'mongodb+srv://admin:12345@cursonodejstdea-3gfx5.mongodb.net/asignaturas?retryWrites=true&w=majority'
}

process.env.URLDB = urlDB