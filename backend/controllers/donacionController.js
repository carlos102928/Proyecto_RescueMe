import { crearDonacion, obtenerTodasLasDonaciones} from '../models/donacionModel.js';
import { pool } from '../config/db.js'

export const registrarDonacion = async (req, res) => {
    try {
        const { valor, medio_pago, id_adoptante, id_refugio } = req.body;

        if (!valor || !medio_pago || !id_adoptante || !id_refugio) {
            return res.status(400).json({ message: 'Todos los campos son obligatorios' });
        }

        const result = await crearDonacion(valor, medio_pago, id_adoptante, id_refugio);
        res.status(201).json({ message: 'Donación registrada con éxito', id_donacion: result.insertId });
    } catch (error) {
        res.status(500).json({ message: 'Error al registrar la donación', error: error.message });
    }
};

export const obtenerDonacion = (req, res) =>{
    obtenerDonacionModel((err, donaciones) =>{
        if (err) return res.status(500).json({error: err.message});
        res.json(donaciones);
    });
};

export const obtenerReporteDonacionesApi = async (req, res) => {
    try {
        const idRefugio = req.params.idRefugio;

        if (!idRefugio) {
            return res.status(400).json({ message: 'ID de refugio no proporcionado.' });
        }

        let nombreRefugio = 'Refugio Desconocido';
        try {
            const [refugioRows] = await pool.query('SELECT nombre_refugio FROM refugio WHERE id_refugio = ?', [idRefugio]);
            if (refugioRows.length > 0) {
                nombreRefugio = refugioRows[0].nombre_refugio;
            }
        } catch (dbError) {
            console.error('Error al obtener el nombre del refugio:', dbError);
        }

        const donaciones = await obtenerTodasLasDonaciones(idRefugio);

        const donacionesFormateadas = donaciones.map(donacion => {
            const fecha = new Date(donacion.fecha_transaccion).toLocaleDateString('es-CO', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });

            return {
                usuario: donacion.nombre_adoptante,
                valor: donacion.valor.toLocaleString('es-CO', {
                    style: 'currency',
                    currency: 'COP',
                    minimumFractionDigits: 0
                }),
                fecha: fecha
            };
        });

        res.json({
            nombreRefugio: nombreRefugio,
            donaciones: donacionesFormateadas
        });

    } catch (error) {
        console.error('Error en obtenerReporteDonacionesApi:', error);
        res.status(500).json({ message: 'Error interno del servidor al obtener el reporte de donaciones.', error: error.message });
    }
};
