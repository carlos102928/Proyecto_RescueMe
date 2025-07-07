import { crearDonacion, obtenerTodasLasDonaciones} from '../models/donacionModel.js';
import { pool } from '../config/db.js';
import { enviarCorreo } from '../utils/emailService.js';


export const registrarDonacion = async (req, res) => {
  try {
    const { valor, medio_pago, id_adoptante, id_refugio } = req.body;

    if (!valor || !medio_pago || !id_adoptante || !id_refugio) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }

    // Insertar donación
    const result = await crearDonacion(valor, medio_pago, id_adoptante, id_refugio);

    // Obtener datos del adoptante y refugio
    const [[usuario]] = await pool.query(
      'SELECT nombre, correo FROM usuarios WHERE id_usuario = ?',
      [id_adoptante]
    );

    const [[refugio]] = await pool.query(
      'SELECT nombre_refugio FROM refugio WHERE id_refugio = ?',
      [id_refugio]
    );

    if (!usuario || !refugio) {
      return res.status(404).json({ message: 'Usuario o refugio no encontrados para envío de correo' });
    }

    // Crear contenido del correo
    const asunto = `¡Gracias por tu donación a ${refugio.nombre_refugio}!`;
    const mensajeHTML = `
      <h2>Hola ${usuario.nombre},</h2>
      <p>Hemos recibido tu donación por un valor de <strong>${Number(valor).toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}</strong>.</p>
      <p>Medio de pago: <strong>${medio_pago}</strong></p>
      <p>Refugio beneficiado: <strong>${refugio.nombre_refugio}</strong></p>
      <br>
      <p>¡Gracias por apoyar a los animales que más lo necesitan!</p>
      <p><strong>Rescue Me</strong></p>
    `;

    // Enviar el correo
    await enviarCorreo({
      to: usuario.correo,
      subject: asunto,
      html: mensajeHTML
    });

    res.status(201).json({
      message: 'Donación registrada y correo enviado con éxito',
      id_donacion: result.insertId
    });

  } catch (error) {
    console.error("Error al registrar la donación:", error);
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
