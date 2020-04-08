require('./config/config');

const express = require('express');

const mongoose = require('mongoose');

const app = express();
const bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json());

//configuracion de routes
app.use(require('./routes/index'));


/* esto se tiene q poner si da problemas con heroku en el package.json
"engines":{
"node": "13.5.0"
}*/
//mongodb+srv://carlosespicam:Carbia20130701@cluster0-br4tg.mongodb.net/cafe
mongoose.connect(process.env.URLDB, { useNewUrlParser: true, useCreateIndex: true },
    (err, res) => {

        if (err) throw err;

        console.log('Base de datos ONLINE');
    });

app.listen(process.env.PORT, () => {
    console.log("Escuchando puerto:", process.env.PORT);
});