import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  // This is a placeholder for environments where the key might not be set.
  // In a real deployed environment, this should be handled more gracefully.
  console.warn("Clave de API de Gemini no encontrada. Las funciones de IA estarán deshabilitadas.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

export const getCryptoInfo = async (coinName: string): Promise<string> => {
  if (!API_KEY) {
    return "La clave de API de Gemini no está configurada. Por favor, configure su clave de API para usar esta función.";
  }

  try {
    const prompt = `Proporciona un resumen breve y fácil de entender para un principiante sobre la criptomoneda ${coinName}. Explica qué es, su propósito principal y una característica clave. Mantenlo conciso y en menos de 100 palabras. La respuesta debe estar en español.`;
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    
    return response.text;
  } catch (error) {
    console.error("Error al obtener datos de la API de Gemini:", error);
    return "Lo siento, no pude obtener la información en este momento. Por favor, inténtelo de nuevo más tarde.";
  }
};