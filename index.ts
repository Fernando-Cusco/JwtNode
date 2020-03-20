import Server from './class/server';
import routes from './routes/userRoutes';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';

const server = new Server();

//Parsear
server.app.use(bodyParser.urlencoded({extended: true}));
server.app.use(bodyParser.json());

//middleware  --rutas
server.app.use('/api', routes)


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

