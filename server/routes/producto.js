const express = require('express');

const Producto = require('../models/producto');

const _ = require('underscore');

const { verificaToken, verificaAdminRole } = require('../middlewares/autenticacion');

const app = express();

// ==============================
// Mostrar todos los productos
// ==============================

app.get('/producto', verificaToken, (req, res) => {
    //traer todos los productos
    //populate: usuario categoria
    //paginado
    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 10;
    limite = Number(limite);

    Producto.find({ disponible: true })
        .skip(desde)
        .limit(limite)
        .populate('categoria', 'descripcion')
        .populate('usuario', 'nombre email')
        .exec((err, productoBD) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            };
            Producto.count((err, conteo) => {
                res.json({
                    ok: true,
                    productoBD
                })
            });
        });
});

// ==============================
// Mostrar un producto por ID
// ==============================
app.get('/producto/:id', verificaToken, (req, res) => {
    //populate: usuario categoria
    let id = req.params.id;
    Producto.findById(id)
        .populate('categoria', 'descripcion')
        .populate('usuario', 'nombre email')
        .exec((err, productoBD) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            };

            if (!productoBD) {
                return res.status(500).json({
                    ok: false,
                    err: {
                        message: 'Producto no encontrado'
                    }
                })
            }
            res.json({
                ok: true,
                productoBD
            })
        });
});

// ==============================
// Buscar productos
// ==============================
app.get('/producto/buscar/:termino', verificaToken, (req, res) => {
    let termino = req.params.termino;

    let regexp = new RegExp(termino, 'i');

    Producto.find({ nombre: regexp })
        .populate('categoria', 'descripcion')
        .populate('usuario', 'nombre email')
        .exec((err, productosBD) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.status(201).json({
                ok: true,
                productosBD
            })

        });
});

// ==============================
// Crear un producto
// ==============================
app.post('/producto', verificaToken, (req, res) => {
    //grabar el usuario y la categoria
    let body = req.body;

    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria,
        usuario: req.usuario._id
    });

    producto.save((err, productoBD) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        };
        if (!productoBD) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        res.status(201).json({
            ok: true,
            productoBD
        })
    });
});

// ==============================
// Actualizar un producto
// ==============================
app.put('/producto/:id', verificaToken, (req, res) => {
    let id = req.params.id;

    let body = req.body; //_.pick(req.body, ['nombre', 'precioUni', 'descripcion', 'disponible']);

    Producto.findByIdAndUpdate(id, body, (err, productoBD) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        };

        if (!productoBD) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            productoBD
        })
    })


});

// ==============================
// Borrar un producto
// ==============================
app.delete('/producto/:id', (req, res) => {
    //Eliminar logicamente disponible false
    let id = req.params.id;

    let cambiaDisponible = {
        disponible: false
    };

    Producto.findByIdAndUpdate(id, cambiaDisponible, (err, productoBD) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        };

        if (!productoBD) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            productoBD,
            mensaje: "Producto borrado"
        })
    })
});

module.exports = app;