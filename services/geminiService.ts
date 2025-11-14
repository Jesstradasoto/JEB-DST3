
import { GoogleGenAI, Type } from "@google/genai";
import { Rubrica, DiagnosticQuestion, StudentAnswer, EvaluationResult } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

const questionSchema = {
    type: Type.ARRAY,
    items: {
        type: Type.OBJECT,
        properties: {
            id: { type: Type.STRING },
            type: { type: Type.STRING, enum: ['multiple_choice', 'true_false', 'short_answer'] },
            question: { type: Type.STRING },
            options: { type: Type.ARRAY, items: { type: Type.STRING } },
        },
        required: ['id', 'type', 'question']
    }
};

const gradingSchema = {
    type: Type.OBJECT,
    properties: {
        puntajeTotal: { type: Type.NUMBER, description: "Puntaje total sobre 100" },
        nivelLogro: { type: Type.STRING, description: "Nivel de logro general (e.g., Avanzado, Intermedio)" },
        recomendacionesIA: { type: Type.STRING, description: "Recomendaciones personalizadas y plan de mejora para el estudiante." },
        resultadosPorCriterio: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    criterio: { type: Type.STRING },
                    puntaje: { type: Type.NUMBER, description: "Puntaje de 0 a 4 para este criterio." },
                    comentarioIA: { type: Type.STRING, description: "Comentario específico sobre el desempeño en este criterio." }
                },
                required: ['criterio', 'puntaje', 'comentarioIA']
            }
        }
    },
    required: ['puntajeTotal', 'nivelLogro', 'recomendacionesIA', 'resultadosPorCriterio']
};


export const generateDiagnosticTest = async (rubrica: Rubrica): Promise<DiagnosticQuestion[]> => {
  const prompt = `
    Basado en la siguiente rúbrica de evaluación de competencias digitales, genera una prueba diagnóstica de 5 preguntas.
    Rúbrica: ${rubrica.nombreRubrica}
    Dominio: ${rubrica.dominio}
    Criterios a evaluar: ${rubrica.criterios.join(', ')}
    
    Instrucciones:
    1. Crea 5 preguntas en total.
    2. Incluye una mezcla de tipos: 2 de opción múltiple, 2 de verdadero/falso y 1 de respuesta breve.
    3. Las preguntas deben ser claras, concisas y adecuadas para un estudiante de secundaria.
    4. Asegúrate de que las preguntas cubran los diferentes criterios de la rúbrica.
    5. Asigna un ID único a cada pregunta (e.g., "q1", "q2").
    6. Para opción múltiple, proporciona 4 opciones.
    7. Devuelve el resultado exclusivamente en formato JSON, siguiendo el esquema proporcionado.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-pro',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: questionSchema,
      }
    });
    
    const jsonText = response.text.trim();
    const questions = JSON.parse(jsonText);
    return questions as DiagnosticQuestion[];
  } catch (error) {
    console.error("Error generating diagnostic test:", error);
    throw new Error("No se pudo generar la prueba. Inténtalo de nuevo.");
  }
};

export const gradeDiagnosticTest = async (rubrica: Rubrica, questions: DiagnosticQuestion[], answers: StudentAnswer[]): Promise<EvaluationResult> => {
  const prompt = `
    Eres un asistente de evaluación experto en competencias digitales. Califica las respuestas de un estudiante a una prueba diagnóstica.

    Rúbrica de evaluación:
    - Nombre: ${rubrica.nombreRubrica}
    - Dominio: ${rubrica.dominio}
    - Criterios: ${rubrica.criterios.join(', ')}
    - Niveles de logro: ${rubrica.niveles.join(', ')} (de 0 a 3, donde 0 es el más bajo)

    Preguntas y respuestas del estudiante:
    ${questions.map((q, i) => `
      Pregunta ${i+1} (${q.type}): ${q.question}
      ${q.options ? `Opciones: ${q.options.join(' / ')}` : ''}
      Respuesta del estudiante: ${answers.find(a => a.questionId === q.id)?.answer}
    `).join('')}

    Instrucciones de calificación:
    1. Evalúa la corrección y profundidad de cada respuesta.
    2. Asigna un puntaje de 0 a 4 a cada criterio de la rúbrica, basándote en el desempeño general del estudiante en las preguntas relacionadas.
    3. Calcula un puntaje total sobre 100.
    4. Determina un nivel de logro general.
    5. Redacta un comentario específico y constructivo para cada criterio.
    6. Escribe una recomendación general y un plan de mejora para el estudiante, destacando fortalezas y áreas de oportunidad.
    7. Devuelve el resultado exclusivamente en formato JSON, siguiendo el esquema proporcionado.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: gradingSchema,
      }
    });

    const jsonText = response.text.trim();
    const result = JSON.parse(jsonText);
    return result as EvaluationResult;
  } catch (error) {
    console.error("Error grading diagnostic test:", error);
    throw new Error("No se pudo calificar la prueba. Inténtalo de nuevo.");
  }
};
