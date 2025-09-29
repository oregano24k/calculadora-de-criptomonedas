import { GoogleGenAI } from "@google/genai";
import type { PriceHistoryPoint } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  // This is a placeholder for environments where the key might not be set.
  // In a real deployed environment, this should be handled more gracefully.
  console.warn("Clave de API de Gemini no encontrada. Las funciones de IA estarán deshabilitadas.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

// FIX: Add missing getCryptoInfo function to resolve import error.
export const getCryptoInfo = async (coinName: string): Promise<string> => {
  if (!API_KEY) {
    return "La clave de API de Gemini no está configurada. Por favor, configure su clave de API para usar esta función.";
  }

  try {
    const prompt = `
      Explica qué es ${coinName} de una manera sencilla para un principiante. La respuesta debe:
      1. Ser en español.
      2. Describir su propósito principal y tecnología subyacente de forma simple.
      3. Mencionar brevemente su historia o un dato interesante.
      4. Mantener un tono amigable y educativo.
      5. Estar contenida en un solo párrafo.
    `;
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    
    return response.text;
  } catch (error) {
    console.error(`Error al obtener información sobre ${coinName} de la API de Gemini:`, error);
    return `Lo siento, no pude obtener información sobre ${coinName} en este momento. Por favor, inténtelo de nuevo más tarde.`;
  }
};

export const getMarketTrend = async (coinName: string, history: PriceHistoryPoint[]): Promise<string> => {
  if (!API_KEY) {
    return "La clave de API de Gemini no está configurada. Por favor, configure su clave de API para usar esta función.";
  }

  try {
    const simplifiedHistory = history.map(p => 
      `Fecha: ${new Date(p.timestamp).toLocaleDateString()}, Precio: $${p.price.toFixed(2)}`
    ).join('\n');

    const prompt = `
      Basado en los siguientes datos históricos de precios de los últimos 30 días para ${coinName}:
      ${simplifiedHistory}

      Analiza esta información y proporciona una predicción de tendencia para los próximos días. La respuesta debe:
      1. Ser en español.
      2. Indicar si la tendencia probable es alcista, bajista o estable.
      3. Dar una breve justificación para tu predicción basada en los datos.
      4. Mantener la respuesta concisa y fácil de entender para un principiante.
      5. Incluir una advertencia de que los mercados de criptomonedas son volátiles y esto no es un consejo financiero.
    `;
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    
    return response.text;
  } catch (error) {
    console.error("Error al obtener datos de la API de Gemini:", error);
    return "Lo siento, no pude obtener la predicción en este momento. Por favor, inténtelo de nuevo más tarde.";
  }
};
