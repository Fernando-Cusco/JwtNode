"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const routes = express_1.Router();
//ruta de prueba
routes.get('/prueba', (req, res) => {
    res.json({
        mensaje: 'Correcto',
        ok: true
    });
});
