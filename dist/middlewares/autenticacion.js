"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const token_1 = __importDefault(require("../dist/class/token"));
exports.verificaToken = (req, res, next) => {
    const userToken = req.get('token') || '';
    token_1.default.comprobarToken(userToken).then((decoded) => {
        req.usuario = decoded.usuario;
        next();
    }).catch(err => {
        res.json({
            mensaje: 'Token no es valido '
        });
    });
};
