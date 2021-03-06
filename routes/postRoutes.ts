import { Router, Response, Request } from 'express';
import { verificaToken } from '../middlewares/autenticacion';
import { Post } from '../models/post.model';
import { FileUpload } from '../interfaces/file-upload';
import FileSisytem from '../class/file-system';

const postRoutes = Router();
const fileSystem = new FileSisytem();

//creamos un Post
postRoutes.post('/create', verificaToken, (req: any, res: Response) => {
    const body = req.body;
    //obtenemos el usuario id del token que viene en la cabecera de la peticion
    body.user = req.usuario._id;
    const imagenes = fileSystem.imagenesTempAPost(req.usuario._id);
    body.imgs = imagenes;

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


//servicio para subir archivos
postRoutes.post('/upload', verificaToken, async (req: any, res: Response) => {
    if(!req.files) {
        return res.status(400).json({
            mensaje: 'no se subio ningun archivo'
        });
    }

    const file: FileUpload = req.files.image;
    if(!file) {
        return res.status(400).json({
            mensaje: 'no se subio ningun image'
        });
    }
    await fileSystem.guardarImagenTemporal(file, req.usuario._id);
    if(!file.mimetype.includes('image')) {
        return res.status(400).json({
            mensaje: 'el archivo seleccionado no es una imagen'
        });
    }
    
    res.json({
        mensaje: 'ok',
        file: file.mimetype
    });
});

//servicio para obtener la imagen por get
postRoutes.get('/imagen/:userid/:imgid', (req: any, res: Response) => {
    const userId = req.params.userid;
    const imgId = req.params.imgid;

    const pathImagen = fileSystem.getFotoUrl(userId, imgId);

    res.sendFile(pathImagen);
});


export default postRoutes;