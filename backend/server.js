const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();

// Configuración de CORS para permitir acceso desde los orígenes de Go Live
app.use(cors({
  origin: ['http://127.0.0.1:5500', 'http://localhost:5500'], // Permitir ambos orígenes
  methods: ['GET', 'POST', 'OPTIONS'], // Métodos permitidos
  allowedHeaders: ['Content-Type', 'Authorization'] // Encabezados permitidos
}));

app.use(express.json());

// Configuración para manejar solicitudes OPTIONS en /bot2
app.options('/bot2', cors());

const HUGGING_FACE_API_KEY = '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'; // Reemplaza con tu API Key

// Definición de la ruta POST /bot2
app.post('/bot2', async (req, res) => {
  const userMessage = req.body.message;

  try {
    // Solicitud a la API de Hugging Face
    const response = await axios.post(
      'https://api-inference.huggingface.co/models/EleutherAI/gpt-neo-2.7B',
      { inputs: userMessage },
      {
        headers: {
          'Authorization': `Bearer ${HUGGING_FACE_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    // Verificar si la respuesta contiene el texto generado
    const botResponse = response.data?.generated_text;
    if (!botResponse) {
      throw new Error("La API no devolvió un texto generado.");
    }

    // Enviar la respuesta del bot al cliente
    res.json({ response: botResponse });
  } catch (error) {
    console.error("Error al conectar con Hugging Face:", error.response ? error.response.data : error.message);
    res.status(500).json({ error: "Hubo un problema al generar la respuesta." });
  }
});

// Iniciar el servidor en el puerto 3000
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Bot de IA escuchando en el puerto ${PORT}`);
});
