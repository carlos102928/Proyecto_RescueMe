import express from 'express';

import { registrarDonacion, obtenerReporteDonacionesApi } from '../controllers/donacionController.js';

const router = express.Router();


router.post('/', registrarDonacion);

router.get('/refugio/:idRefugio', obtenerReporteDonacionesApi);

export default router;