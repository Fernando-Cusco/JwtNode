"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const autenticacion_1 = require("../middlewares/autenticacion");
const post_model_1 = require("../models/post.model");
const file_system_1 = __importDefault(require("../class/file-system"));
const postRoutes = express_1.Router();
const fileSystem = new file_system_1.default();
//creamos un Post
postRoutes.post('/create', autenticacion_1.verificaToken, (req, res) => {
    const body = req.body;
    //obtenemos el usuario id del token que viene en la cabecera de la peticion
    body.user = req.usuario._id;
    const imagenes = fileSystem.imagenesTempAPost(req.usuario._id);
    body.imgs = imagenes;
    post_model_1.Post.create(body).then((postDB) => __awaiter(void 0, void 0, void 0, function* () {
        //obtiene la relacion que tiene el Post con User y saca toda la informacion del usuario y omite mostrar la password
        yield postDB.populate('user', '-password').execPopulate();
        res.json({
            mensaje: 'post ok',
            post: postDB
        });
    })).catch(err => {
        res.json({
            mensaje: 'error',
            err
        });
    });
});
//obtenemos los Post de manera paginada
postRoutes.get('/posts', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let pagina = Number(req.query.pagina) || 1;
    let skip = pagina - 1;
    skip = skip * 10;
    const posts = yield post_model_1.Post.find()
        .sort({ _id: -1 })
        .skip(skip)
        .limit(10)
        .populate('user', '-password')
        .exec();
    res.json({
        mensaje: 'ok',
        pagina,
        posts
    });
}));
//servicio para subir archivos
postRoutes.post('/upload', autenticacion_1.verificaToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.files) {
        return res.status(400).json({
            mensaje: 'no se subio ningun archivo'
        });
    }
    const file = req.files.image;
    if (!file) {
        return res.status(400).json({
            mensaje: 'no se subio ningun image'
        });
    }
    yield fileSystem.guardarImagenTemporal(file, req.usuario._id);
    if (!file.mimetype.includes('image')) {
        return res.status(400).json({
            mensaje: 'el archivo seleccionado no es una imagen'
        });
    }
    res.json({
        mensaje: 'ok',
        file: file.mimetype
    });
}));
exports.default = postRoutes;
