import { getRefugios } from '../models/refugioModel.js';

export const obtenerRefugios = async (req, res) => {
    try {
        const resultado = await getRefugios();
        res.json(resultado);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


export const getRefugio = async (req, res) =>{
    const refugios = await getRefugio()
    res.status(200).json({message: 'Refugios encontrados', refugios});
}


export const obtenerRefugiosPorId = async (req, res) =>{
    try{
        const { id} = req.params;
        const refugio = await obtenerRefugios(Number(id));
        console.log('Resultado obtenido:', refugio);

        if (!refugio){
            return res.status(404).json()({mensaje: 'Refugio no encontrado'});
        }
        res.json({refugio});
    }  catch(error) {
        console.error('Error al obtener refugio:', error);
        res.status(500).json({mensaje: 'Error delservidor'})
    }
}