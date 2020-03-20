import { Router, Response } from 'express';
import { verificaToken } from '../middlewares/autenticacion';
import { Post } from '../models/post.model';

const postRoutes = Router();


//creamos un Post
postRoutes.post('/create', verificaToken, (req: any, res: Response) => {
    const body = req.body;
    //obtenemos el usuario id del token que viene en la cabecera de la peticion
    body.user = req.usuario._id;
    Post.create(body).then(async postDB => {
        //obtiene la relacion que tiene el Post con User y saca toda la informacion del usuario y omite mostrar la password
        await postDB.populate('user', '-password').execPopulate();
        res.json({
            mensaje: 'post ok',
            post: postDB
        });
    }).catch(err => {
        res.json({
            mensaje: 'error',
            err
        });
    });
});

//obtenemos los Post de manera paginada
postRoutes.get('/posts', async (req: any, res: Response) => {
    let pagina = Number(req.query.pagina) || 1;
    let skip = pagina - 1;
    skip = skip * 10;
    const posts = await Post.find()
                            .sort({_id: -1})
                            .skip(skip)
                            .limit(10)
                            .populate('user', '-password')
                            .exec();
    res.json({
        mensaje: 'ok',
        pagina,
        posts
    })
});



export default postRoutes;