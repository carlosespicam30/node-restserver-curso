const express = require('express');

const Categoria = require('../models/categoria');

const { verificaToken, verificaAdminRole } = require('../middlewares/autenticacion');

const app = express();

// ==============================
// Mostrar todas las categorias
// ==============================


app.get('/categoria', verificaToken, (req, res) => {

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 10;
    limite = Number(limite);
    Categoria.find({ estado: true }, 'descripcion estado')
        .skip(desde)
        .limit(limite)
        .sort({ descripcion: '1' })
        .populate('usuario', 'nombre email') //identifica los object id por ejemplo el del usuario
        .exec((err, categoriaDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }

            Categoria.count({ estado: true }, (err, conteo) => {
                res.json({
                    ok: true,
                    categoriaDB,
                    conteo
                })
            });

        })
});

// ==============================
// Mostrar una categoria por ID
// ==============================
app.get('/categoria/:id', verificaToken, (req, res) => {
    //Categoria.findById()
    let id = req.params.id;

    Categoria.findById(id, 'descripcion estado')
        .exec((err, categoriaDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }
            if (!categoriaDB) {
                return res.status(500).json({
                    ok: false,
                    err: {
                        message: 'El id es incorrecto'
                    }
                })
            }
            res.json({
                ok: true,
                categoriaDB
            })

        })
});

// ==============================
// Crear nueva categoria
// ==============================
app.post('/categoria', verificaToken, (req, res) => {
    //regresa la nueva categoria
    //req.usuario._id
    let body = req.body;
    //console.log(verificaToken.req.id);

    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id
    });

    categoria.save((err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        };
        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        };
        //usuarioDB.password = null;
        res.json({
            ok: true,
            categoria: categoriaDB
        })
    });
});

// ==============================
// Actualizar la categorias la descripcion
// ==============================
app.put('/categoria/:id', verificaToken, (req, res) => {
    let id = req.params.id;

    let body = req.body; //_.pick(req.body, ['descripcion', 'estado']);

    let descCategoria = {
        descripcion: body.descripcion
    };

    Categoria.findByIdAndUpdate(id, descCategoria, { new: true, runValidators: true }, (err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        };
        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        };

        res.json({
            ok: true,
            categoria: categoriaDB
        });
    })
});

// ==============================
// Mostrar todas las categorias
// ==============================
app.delete('/categoria/:id', [verificaToken, verificaAdminRole], (req, res) => {
    //solo un administrador puede borrar categorias
    //Categoria.findByIdandRemove
    let id = req.params.id;
    console.log("delete categoria");

    //let body = req.body; //_.pick(req.body, ['descripcion', 'estado']);

    Categoria.findByIdAndRemove(id, (err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        };

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Categoria no encontrada'
                }
            });
        };

        res.json({
            ok: true,
            categoria: categoriaDB
        });
    })
});





module.exports = app;