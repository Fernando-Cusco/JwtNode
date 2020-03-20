import {Response, Request, NextFunction} from 'express';
import Token from '../dist/class/token';
export const verificaToken = (req: any, res: Response, next: NextFunction) => {
    const userToken = req.get('token') || '';
    Token.comprobarToken(userToken).then((decoded: any) => {
        console.log('Decoded', decoded);
        req.usuario = decoded.usuario;
        next();
    }).catch(err => {
        res.json({
            mensaje: 'Token no es valido '
        })
    });
};