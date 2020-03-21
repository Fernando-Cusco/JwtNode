import { FileUpload } from '../interfaces/file-upload';
import path from 'path';
import fs from 'fs';
import uniqid from 'uniqid';

export default class FileSisytem {
    constructor() {

    }

    guardarImagenTemporal(file: FileUpload, userId: string) {
        return new Promise((resolve, reject) => {
            //crear carpetas
            const path = this.crearCarpetaUsuario(userId);

            //generar nombre unico del archivo
            const unico = this.generarNombre(file.name);

            //Mover el archivo al tmp
            file.mv(`${path}/${unico}`, (err: any) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });

    }

    private generarNombre(nombreOriginal: string) {
        //extraer el formato de la imagen
        const split = nombreOriginal.split('.');
        const extension = split[split.length - 1];
        const idUnico = uniqid();
        return `${idUnico}.${extension}`;

    }

    private crearCarpetaUsuario(userId: string) {
        const pathUser = path.resolve(__dirname, '../uploads/', userId);
        const pathUserTemp = pathUser + '/tmp';

        const existe = fs.existsSync(pathUser);

        if (!existe) {
            fs.mkdirSync(pathUser);
            fs.mkdirSync(pathUserTemp);
        }
        return pathUserTemp;
    }

    imagenesTempAPost(userId: string) {
        const pathTmp = path.resolve(__dirname, '../uploads/', userId, 'tmp');
        const pathPost = path.resolve(__dirname, '../uploads/', userId, 'posts');
        if( !fs.existsSync(pathTmp)) {
            return [];
        }

        if( !fs.existsSync(pathPost)) {
            fs.mkdirSync(pathPost);
        }

        const imagenesTmp = this.obtenerImagenes(userId);
        
        imagenesTmp.forEach(imagen => {
            fs.renameSync(`${pathTmp}/${imagen}`, `${pathPost}/${imagen}`)
        });
        return imagenesTmp;
    }

    private obtenerImagenes(userId: string) {
        const pathTmp = path.resolve(__dirname, '../uploads/', userId, 'tmp');
        
        return fs.readdirSync(pathTmp) || [];
    }

    getFotoUrl(userId: string, imgId: string) {
        //crear path del post
        const pathImagen = path.resolve(__dirname, '../uploads/', userId, 'posts', imgId);
        //si la imagen existe
        const existe = fs.existsSync(pathImagen)
        if(!existe) {
            return path.resolve(__dirname, '../assets/app.jpg');
        }
        return pathImagen;
    }
}