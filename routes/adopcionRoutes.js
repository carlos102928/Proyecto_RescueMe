import express from 'express'

import { registrarAdopcion, actualizarEstadoAdopcion, obtenerAdopciones, getAdopcionesUsuario, eliminarAdopcion } from '../controllers/adopcionController.js';

const router = express.Router();

router.get('/', obtenerAdopciones);

router.post('/', registrarAdopcion);

router.put('/:id_adopcion', actualizarEstadoAdopcion);

router.get("/usuario/:id", getAdopcionesUsuario);
router.delete("/:id", eliminarAdopcion);

export default router;