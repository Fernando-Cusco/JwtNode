"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const uniqid_1 = __importDefault(require("uniqid"));
class FileSisytem {
    constructor() {
    }
    guardarImagenTemporal(file, userId) {
        return new Promise((resolve, reject) => {
            //crear carpetas
            const path = this.crearCarpetaUsuario(userId);
            //generar nombre unico del archivo
            const unico = this.generarNombre(file.name);
            //Mover el archivo al tmp
            file.mv(`${path}/${unico}`, (err) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve();
                }
            });
        });
    }
    generarNombre(nombreOriginal) {
        //extraer el formato de la imagen
        const split = nombreOriginal.split('.');
        const extension = split[split.length - 1];
        const idUnico = uniqid_1.default();
        return `${idUnico}.${extension}`;
    }
    crearCarpetaUsuario(userId) {
        const pathUser = path_1.default.resolve(__dirname, '../uploads/', userId);
        const pathUserTemp = pathUser + '/tmp';
        const existe = fs_1.default.existsSync(pathUser);
        if (!existe) {
            fs_1.default.mkdirSync(pathUser);
            fs_1.default.mkdirSync(pathUserTemp);
        }
        return pathUserTemp;
    }
    imagenesTempAPost(userId) {
        const pathTmp = path_1.default.resolve(__dirname, '../uploads/', userId, 'tmp');
        const pathPost = path_1.default.resolve(__dirname, '../uploads/', userId, 'posts');
        if (!fs_1.default.existsSync(pathTmp)) {
            return [];
        }
        if (!fs_1.default.existsSync(pathPost)) {
            fs_1.default.mkdirSync(pathPost);
        }
        const imagenesTmp = this.obtenerImagenes(userId);
        imagenesTmp.forEach(imagen => {
            fs_1.default.renameSync(`${pathTmp}/${imagen}`, `${pathPost}/${imagen}`);
        });
        return imagenesTmp;
    }
    obtenerImagenes(userId) {
        const pathTmp = path_1.default.resolve(__dirname, '../uploads/', userId, 'tmp');
        return fs_1.default.readdirSync(pathTmp) || [];
    }
    getFotoUrl(userId, imgId) {
        //crear path del post
        const pathImagen = path_1.default.resolve(__dirname, '../uploads/', userId, 'posts', imgId);
        //si la imagen existe
        const existe = fs_1.default.existsSync(pathImagen);
        if (!existe) {
            return path_1.default.resolve(__dirname, '../assets/app.jpg');
        }
        return pathImagen;
    }
}
exports.default = FileSisytem;
