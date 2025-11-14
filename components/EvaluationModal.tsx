
import React, { useState, useCallback } from 'react';
import { Estudiante, Rubrica, DiagnosticQuestion, StudentAnswer, EvaluationResult } from '../types';
import { ESTUDIANTES_DEMO, RUBRICAS_DEMO } from '../constants';
import { generateDiagnosticTest, gradeDiagnosticTest } from '../services/geminiService';
import { CloseIcon, SparklesIcon } from './icons';

interface EvaluationModalProps {
  onClose: () => void;
}

type Step = 'select' | 'generate' | 'test' | 'grade' | 'results';

const StepIndicator: React.FC<{ currentStep: Step, step: Step, title: string }> = ({ currentStep, step, title }) => {
    const isActive = currentStep === step;
    const isCompleted = ['select', 'generate', 'test', 'grade', 'results'].indexOf(currentStep) > ['select', 'generate', 'test', 'grade', 'results'].indexOf(step);
    return (
        <div className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white ${isCompleted ? 'bg-brand-emphasis' : isActive ? 'bg-brand-primary' : 'bg-gray-500'}`}>
                {isCompleted ? '✔' : ['S', 'G', 'T', 'C', 'R'][['select', 'generate', 'test', 'grade', 'results'].indexOf(step)]}
            </div>
            <span className={`ml-2 ${isActive ? 'text-white font-bold' : 'text-gray-400'}`}>{title}</span>
        </div>
    );
};

export const EvaluationModal: React.FC<EvaluationModalProps> = ({ onClose }) => {
  const [step, setStep] = useState<Step>('select');
  const [selectedStudent, setSelectedStudent] = useState<Estudiante | null>(null);
  const [selectedRubrica, setSelectedRubrica] = useState<Rubrica | null>(null);
  const [questions, setQuestions] = useState<DiagnosticQuestion[]>([]);
  const [answers, setAnswers] = useState<StudentAnswer[]>([]);
  const [results, setResults] = useState<EvaluationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateTest = useCallback(async () => {
    if (!selectedRubrica) return;
    setIsLoading(true);
    setError(null);
    try {
      const generatedQuestions = await generateDiagnosticTest(selectedRubrica);
      setQuestions(generatedQuestions);
      // Pre-fill answers for demo purposes
      const demoAnswers = generatedQuestions.map(q => ({
          questionId: q.id,
          answer: q.type === 'multiple_choice' ? (q.options?.[0] || '') : q.type === 'true_false' ? true : 'Respuesta de ejemplo.'
      }));
      setAnswers(demoAnswers);
      setStep('test');
    } catch (e: any) {
      setError(e.message);
    } finally {
      setIsLoading(false);
    }
  }, [selectedRubrica]);

  const handleGradeTest = useCallback(async () => {
    if (!selectedRubrica || questions.length === 0 || answers.length === 0) return;
    setIsLoading(true);
    setError(null);
    try {
      const gradedResult = await gradeDiagnosticTest(selectedRubrica, questions, answers);
      setResults(gradedResult);
      setStep('results');
    } catch (e: any) {
      setError(e.message);
    } finally {
      setIsLoading(false);
    }
  }, [selectedRubrica, questions, answers]);

  const renderContent = () => {
    switch (step) {
      case 'select':
        return (
          <div>
            <h3 className="text-xl font-bold text-white mb-4">Paso 1: Seleccionar Estudiante y Rúbrica</h3>
            <div className="mb-4">
              <label className="block text-gray-300 mb-2">Seleccionar Estudiante</label>
              <select onChange={(e) => setSelectedStudent(ESTUDIANTES_DEMO.find(s => s.estudianteId === e.target.value) || null)} className="w-full bg-brand-light border border-gray-600 rounded-md p-2 text-white">
                <option>Seleccione...</option>
                {ESTUDIANTES_DEMO.map(s => <option key={s.estudianteId} value={s.estudianteId}>{s.nombre} {s.apellido}</option>)}
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-gray-300 mb-2">Seleccionar Rúbrica</label>
              <select onChange={(e) => setSelectedRubrica(RUBRICAS_DEMO.find(r => r.rubricaId === e.target.value) || null)} className="w-full bg-brand-light border border-gray-600 rounded-md p-2 text-white">
                <option>Seleccione...</option>
                {RUBRICAS_DEMO.map(r => <option key={r.rubricaId} value={r.rubricaId}>{r.nombreRubrica}</option>)}
              </select>
            </div>
            <button onClick={() => setStep('generate')} disabled={!selectedStudent || !selectedRubrica} className="w-full bg-brand-primary text-white font-bold py-2 px-4 rounded-md disabled:bg-gray-500 hover:bg-blue-600 transition-colors">Siguiente</button>
          </div>
        );
      case 'generate':
        return (
            <div>
                <h3 className="text-xl font-bold text-white mb-4">Paso 2: Generar Prueba con IA</h3>
                <p className="text-gray-300 mb-4">Se generará una prueba de 5 preguntas para <span className="font-bold">{selectedStudent?.nombre}</span> basada en la rúbrica <span className="font-bold">{selectedRubrica?.nombreRubrica}</span>.</p>
                {error && <div className="bg-red-900 text-red-200 p-3 rounded-md mb-4">{error}</div>}
                <button onClick={handleGenerateTest} disabled={isLoading} className="w-full flex items-center justify-center bg-brand-secondary text-white font-bold py-2 px-4 rounded-md hover:bg-cyan-600 transition-colors disabled:bg-gray-500">
                    {isLoading ? 'Generando...' : <><SparklesIcon className="w-5 h-5 mr-2" /> Generar Prueba</>}
                </button>
            </div>
        );
      case 'test':
        return (
            <div>
                <h3 className="text-xl font-bold text-white mb-4">Paso 3: Aplicar Prueba</h3>
                <p className="text-gray-300 mb-2">Respuestas simuladas para {selectedStudent?.nombre}:</p>
                <div className="space-y-4 max-h-80 overflow-y-auto pr-2">
                    {questions.map((q, index) => (
                        <div key={q.id} className="bg-brand-dark p-3 rounded-md">
                            <p className="font-semibold text-gray-200">{index + 1}. {q.question}</p>
                            <p className="text-brand-secondary pl-4 mt-1">R: {answers.find(a=>a.questionId === q.id)?.answer}</p>
                        </div>
                    ))}
                </div>
                 <button onClick={() => setStep('grade')} className="w-full mt-4 bg-brand-primary text-white font-bold py-2 px-4 rounded-md hover:bg-blue-600 transition-colors">Siguiente</button>
            </div>
        );
      case 'grade':
        return (
            <div>
                <h3 className="text-xl font-bold text-white mb-4">Paso 4: Calificar con IA</h3>
                <p className="text-gray-300 mb-4">La IA analizará las respuestas de <span className="font-bold">{selectedStudent?.nombre}</span> y generará una calificación y retroalimentación personalizada.</p>
                {error && <div className="bg-red-900 text-red-200 p-3 rounded-md mb-4">{error}</div>}
                <button onClick={handleGradeTest} disabled={isLoading} className="w-full flex items-center justify-center bg-brand-emphasis text-white font-bold py-2 px-4 rounded-md hover:bg-green-600 transition-colors disabled:bg-gray-500">
                    {isLoading ? 'Calificando...' : <><SparklesIcon className="w-5 h-5 mr-2" /> Calificar Ahora</>}
                </button>
            </div>
        );
      case 'results':
        return (
            <div>
                <h3 className="text-xl font-bold text-white mb-4">Resultados para {selectedStudent?.nombre}</h3>
                {results && (
                     <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
                        <div className="text-center p-4 bg-brand-dark rounded-lg">
                            <p className="text-gray-400">Puntaje Total</p>
                            <p className="text-5xl font-bold text-brand-secondary">{results.puntajeTotal}</p>
                            <p className="text-xl text-white mt-2">{results.nivelLogro}</p>
                        </div>
                         <div className="bg-brand-dark p-4 rounded-lg">
                             <h4 className="font-bold text-white mb-2">Recomendaciones de IA</h4>
                             <p className="text-gray-300 whitespace-pre-wrap">{results.recomendacionesIA}</p>
                         </div>
                         <div className="bg-brand-dark p-4 rounded-lg">
                             <h4 className="font-bold text-white mb-2">Desglose por Criterio</h4>
                             <div className="space-y-3">
                                 {results.resultadosPorCriterio.map(r => (
                                     <div key={r.criterio}>
                                         <div className="flex justify-between items-center">
                                             <p className="text-gray-200 font-semibold">{r.criterio}</p>
                                             <p className="text-brand-primary font-bold">{r.puntaje} / 4</p>
                                         </div>
                                         <p className="text-gray-400 text-sm italic">"{r.comentarioIA}"</p>
                                     </div>
                                 ))}
                             </div>
                         </div>
                     </div>
                )}
                 <button onClick={onClose} className="w-full mt-4 bg-gray-600 text-white font-bold py-2 px-4 rounded-md hover:bg-gray-700 transition-colors">Cerrar</button>
            </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50">
      <div className="bg-brand-light rounded-lg shadow-2xl w-full max-w-2xl p-6 relative border border-gray-700">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">
          <CloseIcon className="w-6 h-6" />
        </button>
        <div className="flex justify-around mb-6 border-b border-gray-700 pb-4">
            <StepIndicator currentStep={step} step="select" title="Selección"/>
            <StepIndicator currentStep={step} step="generate" title="Generar"/>
            <StepIndicator currentStep={step} step="test" title="Prueba"/>
            <StepIndicator currentStep={step} step="grade" title="Calificar"/>
            <StepIndicator currentStep={step} step="results" title="Resultados"/>
        </div>
        
        {isLoading && (
            <div className="absolute inset-0 bg-brand-light bg-opacity-80 flex flex-col items-center justify-center z-10">
                <div className="w-16 h-16 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
                <p className="text-white mt-4 text-lg">Procesando con IA...</p>
            </div>
        )}

        {renderContent()}
      </div>
    </div>
  );
};
