import { Router, Response, Request } from "express";
import { User } from '../models/user.model';
import bcrypt from 'bcrypt';
import Token from '../dist/class/token';
import { verificaToken } from '../middlewares/autenticacion';

const routesUser = Router();

//login usuario
routesUser.post('/login', (req: Request, res: Response) => {
    const body = req.body;
    User.findOne({ email: body.email }, (err, userDb) => {
        if (err) throw err;
        if (!userDb) {
            return res.json({
                mensaje: 'correo/password no son correctos'
            });
        }
        if (userDb.matchPassword(body.password)) {
            const tokenUser = Token.getJwtToken({
                _id: userDb._id,
                nombre: userDb.nombre,
                email: userDb.email,
                avatar: userDb.avatar
            });
            res.json({
                mensaje: 'datos correctos',
                token: tokenUser
            });
        } else {
            return res.json({
                mensaje: 'correo/password no son correctos'
            });
        }
    });
});


//crear usuario
routesUser.post('/create', (req: Request, res: Response) => {

    const user = {
        nombre: req.body.nombre,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 10),
        avatar: req.body.avatar
    };
    User.create(user).then(userDb => {
        const tokenUser = Token.getJwtToken({
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
        })
    });
});

//actualizar usuario
routesUser.put('/update', verificaToken, (req: any, res: Response) => {
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
    User.findByIdAndUpdate(req.usuario._id, user, { new: true }, (err, userDb) => {
        if (err) throw err;
        if(!userDb) {
            return res.json({
                mensaje: 'no existe el usuario'
            });
        }

        const tokenUser = Token.getJwtToken({
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

routesUser.get('/', verificaToken, (req:  any, res: Response) => {
    const usuario = req.usuario;
    res.json({
        mensaje: 'ok',
        usuario
    })
});



export default routesUser;