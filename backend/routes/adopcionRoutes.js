import express from 'express'

import { registrarAdopcion, actualizarEstadoAdopcion, obtenerAdopciones } from '../controllers/adopcionController.js';

const router = express.Router();

router.get('/', obtenerAdopciones)

router.post('/', registrarAdopcion);

router.put('/:id_adopcion', actualizarEstadoAdopcion)

export default router;