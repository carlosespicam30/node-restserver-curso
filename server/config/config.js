//===================================
//         Puerto
//===================================

process.env.PORT = process.env.PORT || 3000;

//==============================
//          Entorno
//==============================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//==============================
//      Vencimiento del Token
//==============================
//60 segundos
//60 minutos
//24 horas
//30 dias
process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;

//==============================
//      SEED de autenticación
//==============================
process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo';

//==============================
//          Base de Datos
//==============================

let urlDB;
//console.log(process.env.NODE_ENV);
if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = process.env.MONGO_URI; //'mongodb+srv://user:pass@cluster0-br4tg.mongodb.net/cafe';
}

process.env.URLDB = urlDB;

//==============================
//          Google Client ID
//==============================

process.env.CLIENT_ID = process.env.CLIENT_ID || '420671206603-s5vvrbq6jgfm9gsrg412phrkjaifl75r.apps.googleusercontent.com';