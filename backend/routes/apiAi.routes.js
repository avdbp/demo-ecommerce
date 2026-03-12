const express = require('express');
const axios = require('axios');
const router = express.Router();

// Soporta Google AI Studio (Gemini) o OpenAI
// Google: GEMINI_API_KEY en .env (obtener en https://aistudio.google.com/app/apikey)
// OpenAI: APIKEY_AI_SECRET en .env
router.get('/info-planta', (req, res) => {
  const { prompt } = req.query;
  const geminiKey = process.env.GEMINI_API_KEY;
  const openaiKey = process.env.APIKEY_AI_SECRET;

  if (!prompt) {
    return res.status(400).json({ error: 'Debes proporcionar una planta (prompt)' });
  }

  const userPrompt = `Dame información sobre la planta: ${prompt}. Incluye: Nombre común, nombre científico, características, cuidados, cantidad de agua, si es de sol o sombra. Responde en español.`;

  // Prioridad: Google Gemini si tiene la key
  // Modelos: gemini-2.0-flash, gemini-2.5-flash, gemini-flash-latest, gemini-pro
  if (geminiKey) {
    const geminiModel = process.env.GEMINI_MODEL || 'gemini-flash-latest';
    return axios
      .post(
        `https://generativelanguage.googleapis.com/v1beta/models/${geminiModel}:generateContent?key=${geminiKey}`,
        {
          contents: [{ parts: [{ text: userPrompt }] }],
          generationConfig: {
            maxOutputTokens: 2000,
            temperature: 0.7,
          },
        },
        { headers: { 'Content-Type': 'application/json' } }
      )
      .then((response) => {
        const text = response.data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || '';
        res.json({ planta: text });
      })
      .catch((error) => {
        const errData = error.response?.data;
        const errMsg = errData?.error?.message || errData?.message || error.message;
        console.error('Error Gemini:', errMsg || errData);
        res.status(500).json({ error: errMsg || 'Error al generar la información.' });
      });
  }

  // Fallback: OpenAI
  if (openaiKey) {
    return axios
      .post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-3.5-turbo',
          messages: [
            { role: 'system', content: 'Responde en español sobre plantas.' },
            { role: 'user', content: userPrompt },
          ],
          max_tokens: 2000,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${openaiKey}`,
          },
        }
      )
      .then((response) => {
        const planta = response.data.choices[0]?.message?.content?.trim() || '';
        res.json({ planta });
      })
      .catch((error) => {
        const errData = error.response?.data;
        const errMsg = errData?.error?.message || errData?.message || error.message;
        console.error('Error OpenAI:', errMsg || errData);
        res.status(500).json({ error: errMsg || 'Error al generar la información.' });
      });
  }

  res.status(500).json({
    error: 'API de IA no configurada. Añade GEMINI_API_KEY o APIKEY_AI_SECRET en .env',
  });
});

module.exports = router;
