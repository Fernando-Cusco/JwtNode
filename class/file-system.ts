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
            file.mv(`${path}.${unico}`, (err: any) => {
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

}