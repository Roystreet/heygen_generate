# 🤖 Generador de Videos Personalizados con HeyGen

Este proyecto contiene un script de Node.js que automatiza la creación masiva de videos personalizados utilizando la API de HeyGen. El script lee una lista de nombres desde un archivo CSV y genera un video para cada uno basándose en una plantilla predefinida.

## 📋 Flujo Detallado del Funcionamiento

El proceso está dividido en dos archivos principales que trabajan juntos: `generateVideos.js` (el orquestador) y `heygenService.js` (el ejecutor de la API).

1.  **Inicio (`generateVideos.js`)**:
    * El script principal comienza a ejecutarse.
    * Lee el archivo `alumnos.csv` de forma síncrona usando `fs.readFileSync`.
    * Utiliza la librería **Papa Parse** para convertir el texto del CSV en un array de objetos JavaScript. Cada objeto representa una fila del archivo.
    * Extrae únicamente la columna `nombre_alumno` de cada objeto y la guarda en un array llamado `students`.

2.  **Bucle de Procesamiento (`generateVideos.js`)**:
    * El script itera sobre cada `studentName` en el array `students`.
    * Para cada nombre, invoca la función `generateVideoFromTemplate`, pasándole el nombre del estudiante actual.

3.  **Comunicación con la API (`heygenService.js`)**:
    * La función `generateVideoFromTemplate` recibe el nombre del estudiante.
    * Construye la solicitud HTTP POST usando **axios**.
    * El **payload** de la solicitud incluye el nombre del estudiante, que se asigna a una variable de la plantilla de HeyGen (en este caso, la variable se llama `nombre_alumno`).
    * La **cabecera** de la solicitud incluye la `HEYGEN_API_KEY` para autenticarse con la API de HeyGen.
    * Envía la solicitud al endpoint de HeyGen, que incluye el `HEYGEN_TEMPLATE_ID`.

4.  **Registro de Resultados (`generateVideos.js`)**:
    * La API de HeyGen responde con un `video_id` si la solicitud fue exitosa.
    * El script principal recibe este `video_id`.
    * Añade un nuevo objeto `{ nombre_alumno: 'Nombre', video_id: 'ID_DEL_VIDEO' }` a un array de resultados. Si hubo un error, guarda `'ERROR_GENERATION'`.
    * Una vez que el bucle ha terminado, utiliza la librería **csv-writer** para escribir el array de resultados en el archivo `videos_generados_log.csv`.

---

## ⚙️ Configuración e Instalación

Sigue estos pasos para configurar el proyecto en tu entorno local.

**1. Instala las Dependencias**
```bash
npm install
```

**2. Prepara el Archivo de Datos de Entrada (`alumnos.csv`)**
Crea un archivo llamado `alumnos.csv` en la raíz del proyecto. El archivo **debe** tener una columna con el encabezado `nombre_alumno`.

*Ejemplo de `alumnos.csv`:*
```csv
nombre_alumno
Ana García
Pedro Martínez
```

**3. Configura las Variables de Entorno (Archivo `.env`)**
Crea un archivo `.env` en la raíz del proyecto. Este archivo contendrá tus claves secretas para que el script pueda autenticarse con la API de HeyGen.

*Contenido del archivo `.env`:*
```
HEYGEN_API_KEY="TU_API_KEY_REAL"
HEYGEN_TEMPLATE_ID="TU_TEMPLATE_ID_REAL"
```

### Explicación de las Variables de Entorno

* `HEYGEN_API_KEY`
    * **¿Qué es?** Es tu clave secreta de autenticación. Funciona como un usuario y contraseña para que la API de HeyGen sepa que eres tú quien hace la solicitud y verifique si tienes permiso y créditos.
    * **¿Por qué es necesaria?** Sin esta clave, la API rechazará cualquier solicitud por motivos de seguridad. **Nunca compartas esta clave públicamente.**
    * **¿Dónde encontrarla?** Inicia sesión en tu cuenta de HeyGen, ve a **Settings** (Ajustes) y busca la sección de **API Keys**. Allí podrás crear o copiar tu clave.

* `HEYGEN_TEMPLATE_ID`
    * **¿Qué es?** Es el identificador único de la plantilla de video que quieres usar. Cada plantilla en tu cuenta de HeyGen tiene su propio ID.
    * **¿Por qué es necesaria?** Le dice a la API exactamente qué diseño de video debe usar para generar los nuevos videos personalizados.
    * **¿Dónde encontrarla?** Ve a la sección de **Templates** (Plantillas) en HeyGen. Haz clic en la plantilla que deseas usar y mira la URL en la barra de direcciones de tu navegador. El ID estará al final de la URL, por ejemplo: `app.heygen.com/templates/1234abcd...`

---

## ▶️ Cómo Ejecutar el Script

Una vez que hayas completado la instalación y configuración, puedes ejecutar el script con el siguiente comando:

```bash
npm start
```
El script mostrará en la consola el progreso y, al finalizar, habrá creado el archivo `videos_generados_log.csv` con los resultados.