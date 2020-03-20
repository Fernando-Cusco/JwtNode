import { Schema, model, Document } from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new Schema({
    nombre: {
        type: String,
        required: [ true, 'El nombre es requerido' ]
    },
    avatar: {
        type: String,
        default: 'av-1.png'
    },
    email: {
        type: String,
        unique: true,
        required: [ true, 'El correo es requerido']
    },
    password: {
        type: String,
        required: [ true, 'La contraseña es necesaria']
    }
});

userSchema.method('matchPassword', function(password: string = ''): boolean {
    if(bcrypt.compareSync(password, this.password)) {
        return true;
    } else {
        return false;
    }
});

interface IUser extends Document {
    nombre: string;
    email: string;
    password: string;
    avatar: string;

    matchPassword(password: string): boolean;
}

export const User = model<IUser>('User', userSchema);