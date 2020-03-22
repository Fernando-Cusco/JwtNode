import Server from './class/server';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import fileUpload from 'express-fileupload';

import routesUser from './routes/userRoutes';
import postRoutes from './routes/postRoutes';

import cors from 'cors';

const server = new Server();

//Parsear
server.app.use(bodyParser.urlencoded({extended: true}));
server.app.use(bodyParser.json());

//FileUpload
server.app.use(fileUpload());

//configuracion de Cors
server.app.use(cors({origin: true, credentials: true}))

//middleware  --rutas
server.app.use('/user', routesUser)
server.app.use('/post', postRoutes)


//conectar con la base de datos
mongoose.connect('mongodb://localhost:27017/fotosgram', {
    useNewUrlParser: true,
    useCreateIndex: true
}, (err) => {
    if(err) throw err;
    console.log('Database conectada');
    
});


//levantamos express
server.start(() => {
    console.log('Express corriendo en el puerto '+server.port);
});

