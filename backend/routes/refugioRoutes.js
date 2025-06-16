import express from 'express';
import { obtenerRefugios, obtenerRefugiosPorId } from '../controllers/refugioController.js';
const router = express.Router();

router.get('/', obtenerRefugios);

router.get('/:id', obtenerRefugiosPorId);
export default router;