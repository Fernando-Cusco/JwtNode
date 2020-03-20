"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = __importDefault(require("./class/server"));
const mongoose_1 = __importDefault(require("mongoose"));
const body_parser_1 = __importDefault(require("body-parser"));
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const postRoutes_1 = __importDefault(require("./routes/postRoutes"));
const server = new server_1.default();
//Parsear
server.app.use(body_parser_1.default.urlencoded({ extended: true }));
server.app.use(body_parser_1.default.json());
//FileUpload
server.app.use(express_fileupload_1.default());
//middleware  --rutas
server.app.use('/user', userRoutes_1.default);
server.app.use('/post', postRoutes_1.default);
//conectar con la base de datos
mongoose_1.default.connect('mongodb://localhost:27017/fotosgram', {
    useNewUrlParser: true,
    useCreateIndex: true
}, (err) => {
    if (err)
        throw err;
    console.log('Database conectada');
});
//levantamos express
server.start(() => {
    console.log('Express corriendo en el puerto ' + server.port);
});
