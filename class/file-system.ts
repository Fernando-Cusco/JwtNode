import { FileUpload } from '../interfaces/file-upload';
import path from 'path';
import fs from 'fs';


export default class FileSisytem {
    constructor(){

    }

    guardarImagenTemporal(file: FileUpload, userId: string) {
        const path = this.crearCarpetaUsuario(userId);
        console.log(path);
        
    }

    private crearCarpetaUsuario(userId: string) {
        const pathUser = path.resolve(__dirname, '../uploads/', userId);
        const pathUserTemp = pathUser+'/tmp';
        
        const existe = fs.existsSync(pathUser);

        if(!existe) {
            fs.mkdirSync(pathUser);
            fs.mkdirSync(pathUserTemp);
        }
        return pathUserTemp;
    }

}