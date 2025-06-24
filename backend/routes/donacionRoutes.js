import express from 'express';

import { registrarDonacion, obtenerReporteDonacionesApi } from '../controllers/donacionController.js';

const router = express.Router();


router.post('/donaciones', registrarDonacion);

router.get('/refugio/:idRefugio/donaciones-data', obtenerReporteDonacionesApi);

export default router;