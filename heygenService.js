const axios = require('axios');
require('dotenv').config(); // Carga las variables del archivo .env

const TEMPLATE_ID = process.env.HEYGEN_TEMPLATE_ID;
const API_URL = `https://api.heygen.com/v2/template/${TEMPLATE_ID}/generate`;
const API_KEY = process.env.HEYGEN_API_KEY;

/**
 * Genera un video a partir de una plantilla de HeyGen para un nombre de estudiante dado.
 * @param {string} studentName El nombre del estudiante para quien se generará el video.
 * @returns {Promise<string|null>} Una promesa que resuelve con el video_id si es exitoso, o null en caso de error.
 */
async function generateVideoFromTemplate(studentName) {
    if (!API_KEY || !TEMPLATE_ID) {
        console.error("Error: Por favor, configura HEYGEN_API_KEY y HEYGEN_TEMPLATE_ID en el archivo .env");
        return null;
    }

    const headers = {
        'X-Api-Key': API_KEY,
        'Content-Type': 'application/json',
    };

    const payload = {
        caption: false,
        dimension: {
            width: 1280,
            height: 720
        },
        include_gif: false,
        title: `Mensaje para ${studentName}`,
        variables: {
            nombre_alumno: {
                name: "nombre_alumno",
                type: "text",
                properties: {
                    content: studentName
                }
            },
        },
    };

    console.log(`Generando video para ${studentName}...`);

    try {
        const response = await axios.post(API_URL, payload, { headers: headers });

        if (response.data && response.data.data && response.data.data.video_id) {
            console.log(`✅ Solicitud exitosa para ${studentName}. El video se está procesando.`);
            console.log("Video ID:", response.data.data.video_id);
            return response.data.data.video_id;
        } else {
            console.log("Respuesta inesperada de HeyGen:", response.data);
            return null;
        }

    } catch (error) {
        console.error(`❌ Error al solicitar la generación del video para ${studentName}.`);
        if (error.response) {
            console.error("Status:", error.response.status);
            console.error("Data:", error.response.data);
        } else {
            console.error("Error message:", error.message);
        }
        return null;
    }
}

module.exports = {
    generateVideoFromTemplate
};