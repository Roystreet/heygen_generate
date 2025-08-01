const fs = require('fs');
const path = require('path');
const Papa = require('papaparse'); // 1. Importa Papa Parse
const { createObjectCsvWriter } = require('csv-writer');
const { generateVideoFromTemplate } = require('./heygenService');

async function main() {
    const inputCsvPath = path.resolve(__dirname, 'alumnos.csv');
    const outputCsvPath = path.resolve(__dirname, 'videos_generados_log.csv');

    // --- Leer el archivo CSV de estudiantes con Papa Parse ---
    console.log(`Leyendo estudiantes desde: ${inputCsvPath}`);
    let students = [];
    try {
        const fileContent = fs.readFileSync(inputCsvPath, 'utf8');

        // 2. Usa Papa.parse en lugar del stream
        const results = Papa.parse(fileContent, {
            header: true,             // Usa la primera fila como encabezados
            skipEmptyLines: true,     // Salta líneas vacías
            dynamicTyping: true       // Similar a 'cast', convierte tipos de datos
        });

        // Extrae solo el nombre del alumno de cada fila
        students = results.data.map(row => row.nombre_alumno);

        console.log(`Se encontraron ${students.length} estudiantes.`);

    } catch (error) {
        console.error(`Error al leer o parsear el archivo CSV:`, error);
        process.exit(1);
    }

    // --- El resto de tu lógica para generar videos no necesita cambios ---
    const videoResults = [];

    for (const studentName of students) {
        console.log(`Iniciando procesamiento para: ${studentName}`);
        const videoId = await generateVideoFromTemplate(studentName);
        if (videoId) {
            videoResults.push({
                nombre_alumno: studentName,
                video_id: videoId
            });
            console.log(`Registro añadido: ${studentName}, ${videoId}`);
        } else {
            console.warn(`No se pudo generar el video para ${studentName}.`);
            videoResults.push({
                nombre_alumno: studentName,
                video_id: 'ERROR_GENERATION'
            });
        }
    }

    // --- Escribir los resultados en el nuevo CSV (sin cambios) ---
    if (videoResults.length > 0) {
        console.log(`\nEscribiendo resultados en: ${outputCsvPath}`);
        const csvWriter = createObjectCsvWriter({
            path: outputCsvPath,
            header: [
                { id: 'nombre_alumno', title: 'NOMBRE_ALUMNO' },
                { id: 'video_id', title: 'VIDEO_ID' }
            ]
        });
        await csvWriter.writeRecords(videoResults);
        console.log('✅ Archivo de resultados generado exitosamente.');
    } else {
        console.log('No se generaron videos para registrar.');
    }

    console.log('\nProceso de generación de videos completado.');
}

// Ejecuta la función principal
main();