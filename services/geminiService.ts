import { GoogleGenAI } from '@google/genai';
import { DocumentItem } from '../types';

const getAIClient = () => {
  try {
    return new GoogleGenAI({ apiKey: process.env.API_KEY });
  } catch (error) {
    console.error("Failed to initialize GoogleGenAI. Is API_KEY set?", error);
    return null;
  }
};

export const analyzeRepositoryStatus = async (documents: DocumentItem[]): Promise<string> => {
  const ai = getAIClient();
  if (!ai) {
    return "Error: Servicio de IA no configurado o no disponible.";
  }

  // Format data for the prompt focusing on versioning and review dates
  const dataSummary = documents.map(doc => {
    const isOverdue = new Date(doc.reviewerDate) < new Date();
    return `- ${doc.sku} "${doc.title}": Estado(${doc.status}), Versiones(${doc.versions.length}), Última Rev(${doc.completionDate}), Próx Rev(${doc.reviewerDate}), Vencido(${isOverdue ? 'Sí' : 'No'})`;
  }).join('\n');

  const prompt = `
    Actúa como un auditor de control documental corporativo (estilo SharePoint/BHP).
    A continuación, te presento el estado actual de los documentos del programa seleccionado.

    Datos de los documentos:
    ${dataSummary || 'No hay documentos en este programa.'}

    Por favor, proporciona un breve resumen ejecutivo (máximo 2 párrafos) indicando:
    1. El estado general de actualización (revisa si hay documentos con fechas de revisión vencidas o próximas a vencer).
    2. El nivel de versionamiento (si los documentos tienen historial o son todos versión 1.0).
    3. Si aplica, recomienda acción sobre documentos específicos que requieran revisión urgente.
    
    Responde en español de manera profesional. No uses markdown de bloques de código. Si no hay documentos, indícalo cortésmente.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    
    return response.text || "No se pudo generar un análisis.";
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return "Ocurrió un error al analizar el repositorio con IA. Por favor, intenta de nuevo más tarde.";
  }
};
