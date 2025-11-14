
import React, { useState } from 'react';
import { User, UserRole, Estudiante } from './types';
import { DOCENTE_DEMO, ESTUDIANTE_DEMO, ESTUDIANTES_DEMO } from './constants';
import { PsychologyIcon, ChecklistIcon, InsightsIcon, ChevronLeftIcon } from './components/icons';
import { EvaluationModal } from './components/EvaluationModal';

const LandingPage: React.FC<{ onStart: () => void }> = ({ onStart }) => (
    <div className="h-screen w-screen flex flex-col items-center justify-center bg-brand-dark text-white p-4 text-center" style={{backgroundImage: 'url(https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)', backgroundSize: 'cover', backgroundPosition: 'center'}}>
        <div className="absolute inset-0 bg-brand-dark bg-opacity-80"></div>
        <div className="relative z-10">
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-4 animate-fade-in-down">
                JUICIO EDUCATIVO
            </h1>
            <p className="text-lg md:text-xl text-gray-300 mb-8 animate-fade-in-up">
                ¿Estás listo para llevar tu aprendizaje al siguiente nivel?
            </p>
            <button
                onClick={onStart}
                className="bg-brand-primary hover:bg-blue-600 text-white font-bold py-3 px-8 rounded-full text-lg transition-transform transform hover:scale-105 animate-bounce"
            >
                INICIA
            </button>
        </div>
    </div>
);

const ActionCard: React.FC<{ icon: React.ReactNode; title: string; description: string; onClick: () => void; }> = ({ icon, title, description, onClick }) => (
    <button onClick={onClick} className="bg-brand-light hover:bg-brand-primary/30 border border-brand-primary/50 rounded-2xl p-6 text-left flex flex-col items-center text-center transition-all duration-300 transform hover:-translate-y-2">
        <div className="mb-4 text-brand-secondary">{icon}</div>
        <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
        <p className="text-gray-400 text-sm">{description}</p>
    </button>
);

interface DashboardProps {
    onBackToLanding: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onBackToLanding }) => {
    const [currentUser, setCurrentUser] = useState<User>(DOCENTE_DEMO);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleRoleChange = (role: UserRole) => {
        setCurrentUser(role === UserRole.DOCENTE ? DOCENTE_DEMO : ESTUDIANTE_DEMO);
    };

    return (
        <div className="min-h-screen bg-brand-dark text-white p-4 sm:p-6 lg:p-8">
            {isModalOpen && <EvaluationModal onClose={() => setIsModalOpen(false)} />}
            <header className="flex flex-wrap justify-between items-center mb-8 gap-4">
                <div className="flex items-center gap-4">
                     <button 
                       onClick={onBackToLanding} 
                       className="p-2 rounded-full hover:bg-brand-light transition-colors"
                       aria-label="Volver a la portada"
                   >
                       <ChevronLeftIcon className="w-6 h-6 text-gray-300" />
                   </button>
                    <div>
                        <h1 className="text-3xl font-bold text-white">J.E.B. – IA</h1>
                        <p className="text-gray-400">Plataforma de Evaluación de Competencias</p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                     <div className="flex items-center gap-2 p-2 bg-brand-light rounded-lg">
                        <span className="text-sm text-gray-300">Vista:</span>
                        <button onClick={() => handleRoleChange(UserRole.DOCENTE)} className={`px-3 py-1 text-sm rounded ${currentUser.rol === UserRole.DOCENTE ? 'bg-brand-primary text-white' : 'bg-transparent text-gray-400'}`}>Docente</button>
                        <button onClick={() => handleRoleChange(UserRole.ESTUDIANTE)} className={`px-3 py-1 text-sm rounded ${currentUser.rol === UserRole.ESTUDIANTE ? 'bg-brand-primary text-white' : 'bg-transparent text-gray-400'}`}>Estudiante</button>
                    </div>
                    <img src={currentUser.fotoUrl} alt={currentUser.nombre} className="w-12 h-12 rounded-full border-2 border-brand-primary"/>
                    <div>
                        <p className="font-semibold">{currentUser.nombre}</p>
                        <p className="text-sm text-gray-400">{currentUser.rol}</p>
                    </div>
                </div>
            </header>

            {currentUser.rol === UserRole.DOCENTE ? (
                 <main>
                    <div className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4 text-brand-secondary">Acciones con IA</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <ActionCard 
                                icon={<PsychologyIcon className="w-12 h-12"/>} 
                                title="Diagnóstico IA"
                                description="Genera y califica una prueba diagnóstica personalizada para evaluar competencias."
                                onClick={() => setIsModalOpen(true)}
                            />
                            <ActionCard 
                                icon={<ChecklistIcon className="w-12 h-12"/>} 
                                title="Rúbrica Digital"
                                description="Evalúa con rúbricas interactivas y obtén comentarios generados por IA."
                                onClick={() => alert("Función 'Rúbrica Digital' en desarrollo.")}
                            />
                            <ActionCard 
                                icon={<InsightsIcon className="w-12 h-12"/>} 
                                title="Reportes y Evidencias"
                                description="Visualiza el progreso, gestiona evidencias y exporta reportes detallados."
                                onClick={() => alert("Función 'Reportes' en desarrollo.")}
                            />
                        </div>
                    </div>
                    <div>
                        <h2 className="text-2xl font-semibold mb-4 text-brand-secondary">Estudiantes del Curso</h2>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                            {ESTUDIANTES_DEMO.map((student: Estudiante) => (
                                <div key={student.estudianteId} className="bg-brand-light p-4 rounded-lg text-center border border-gray-700">
                                    <img src={`https://picsum.photos/seed/${student.email}/100/100`} alt={student.nombre} className="w-16 h-16 rounded-full mx-auto mb-2"/>
                                    <p className="font-semibold text-white">{student.nombre} {student.apellido}</p>
                                    <span className={`text-xs px-2 py-0.5 rounded-full ${student.estado === 'completada' ? 'bg-green-800 text-green-200' : 'bg-yellow-800 text-yellow-200'}`}>
                                        {student.estado}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </main>
            ) : (
                <main className="text-center mt-16">
                    <h2 className="text-3xl font-bold mb-4">Bienvenido, {currentUser.nombre}</h2>
                    <p className="text-gray-400 mb-8">Aquí podrás ver tus resultados, progreso y evidencias.</p>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
                           <ActionCard 
                                icon={<InsightsIcon className="w-12 h-12"/>} 
                                title="Mis Resultados"
                                description="Consulta las calificaciones y la retroalimentación de tus evaluaciones."
                                onClick={() => alert("Vista de resultados del estudiante en desarrollo.")}
                            />
                           <ActionCard 
                                icon={<ChecklistIcon className="w-12 h-12"/>} 
                                title="Mis Evidencias"
                                description="Revisa los trabajos y archivos que has entregado como evidencia."
                                onClick={() => alert("Vista de evidencias del estudiante en desarrollo.")}
                            />
                     </div>
                </main>
            )}
        </div>
    );
};


function App() {
  const [screen, setScreen] = useState<'landing' | 'dashboard'>('landing');

  if (screen === 'landing') {
    return <LandingPage onStart={() => setScreen('dashboard')} />;
  }

  return <Dashboard onBackToLanding={() => setScreen('landing')} />;
}

export default App;
