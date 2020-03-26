"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_model_1 = require("../models/user.model");
const bcrypt_1 = __importDefault(require("bcrypt"));
const token_1 = __importDefault(require("../dist/class/token"));
const autenticacion_1 = require("../middlewares/autenticacion");
const routesUser = express_1.Router();
//login usuario
routesUser.post('/login', (req, res) => {
    const body = req.body;
    user_model_1.User.findOne({ email: body.email }, (err, userDb) => {
        if (err)
            throw err;
        if (!userDb) {
            return res.json({
                mensaje: 'correo/password no son correctos'
            });
        }
        if (userDb.matchPassword(body.password)) {
            const tokenUser = token_1.default.getJwtToken({
                _id: userDb._id,
                nombre: userDb.nombre,
                email: userDb.email,
                avatar: userDb.avatar
            });
            res.json({
                mensaje: 'datos correctos',
                token: tokenUser
            });
        }
        else {
            return res.json({
                mensaje: 'correo/password no son correctos'
            });
        }
    });
});
//crear usuario
routesUser.post('/create', (req, res) => {
    const user = {
        nombre: req.body.nombre,
        email: req.body.email,
        password: bcrypt_1.default.hashSync(req.body.password, 10),
        avatar: req.body.avatar
    };
    user_model_1.User.create(user).then(userDb => {
        const tokenUser = token_1.default.getJwtToken({
            _id: userDb._id,
            nombre: userDb.nombre,
            email: userDb.email,
            avatar: userDb.avatar
        });
        res.json({
            mensaje: 'Correcto',
            user: tokenUser
        });
    }).catch(err => {
        res.json({
            mensaje: 'Error',
            err: err
        });
    });
});
//actualizar usuario
routesUser.put('/update', autenticacion_1.verificaToken, (req, res) => {
    console.log(req.body.nombre, req.body.email, req.body.avatar, 'llega desde el front');
    const user = {
        //si el nombre viene en null usa el nombre del token
        nombre: req.body.nombre || req.usuario.nombre,
        //si el email viene en null usa el email del token
        email: req.body.email || req.usuario.email,
        //password: bcrypt.hashSync(req.body.password, 10),
        //si el avatar viene en null usa el avatar del token
        avatar: req.body.avatar || req.usuario.avatar
    };
    user_model_1.User.findByIdAndUpdate(req.usuario._id, user, { new: true }, (err, userDb) => {
        if (err)
            throw err;
        if (!userDb) {
            return res.json({
                mensaje: 'no existe el usuario'
            });
        }
        const tokenUser = token_1.default.getJwtToken({
            _id: userDb._id,
            nombre: userDb.nombre,
            email: userDb.email,
            avatar: userDb.avatar
        });
        return res.json({
            mensaje: 'Actualizacion correcta',
            token: tokenUser
        });
    });
});
routesUser.get('/', autenticacion_1.verificaToken, (req, res) => {
    const usuario = req.usuario;
    res.json({
        mensaje: 'ok',
        usuario
    });
});
exports.default = routesUser;
