import cors from 'cors';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import authRoutes from './routes/authRoutes.js';
import animalRoutes from './routes/animalRoutes.js';
import adopcionRoutes from './routes/adopcionRoutes.js';
import userRoutes from './routes/mostrarNombreRoutes.js';
import refugioRoutes from './routes/refugioRoutes.js';
import donacionRoutes from './routes/donacionRoutes.js';
import adoptanteRoutes from './routes/adoptanteRoutes.js';
import authRefugioRoutes from './routes/authRefugioRoutes.js'

const app = express();
app.use(cors());
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, '../frontend')));
app.use('/api/adopciones', adopcionRoutes);
app.use('/api/animales', animalRoutes);
app.use('/api', userRoutes);
app.use('/api/refugio', refugioRoutes);
app.use('/api', donacionRoutes);
app.use('/api', adoptanteRoutes);
app.use('/api', authRefugioRoutes)
app.use('/api', authRoutes);

app.get('/', (req, res) =>{
    res.sendFile(path.join(__dirname, '../frontend/Inicio.html'));
})

app.listen(3000, () =>{
    console.log('Servidor corriendo en http://localhost:3000');
});

