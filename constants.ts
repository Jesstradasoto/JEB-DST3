
import { User, UserRole, Curso, Grupo, Estudiante, Rubrica, Dominio } from './types';

export const DOCENTE_DEMO: User = {
  userId: 'docente-01',
  nombre: 'Prof. Ana Torres',
  email: 'ana.torres@example.com',
  rol: UserRole.DOCENTE,
  fotoUrl: 'https://picsum.photos/seed/docente/100/100',
};

export const ESTUDIANTE_DEMO: User = {
    userId: 'estudiante-10',
    nombre: 'Carlos Ruiz',
    email: 'carlos.ruiz@example.com',
    rol: UserRole.ESTUDIANTE,
    fotoUrl: 'https://picsum.photos/seed/carlos/100/100',
};


export const CURSOS_DEMO: Curso[] = [
  { cursoId: 'c1', nombreCurso: 'Competencias Digitales', grado: '6º Grado', docenteId: 'docente-01' },
  { cursoId: 'c2', nombreCurso: 'Introducción a la Programación', grado: '7º Grado', docenteId: 'docente-01' },
];

export const GRUPOS_DEMO: Grupo[] = [
  { grupoId: 'g1', nombreGrupo: 'Grupo A', cursoId: 'c1' },
  { grupoId: 'g2', nombreGrupo: 'Grupo B', cursoId: 'c1' },
];

export const ESTUDIANTES_DEMO: Estudiante[] = [
  { estudianteId: 'e1', nombre: 'Juan', apellido: 'Pérez', email: 'juan.perez@example.com', grupoId: 'g1', cursoId: 'c1', estado: 'completada' },
  { estudianteId: 'e2', nombre: 'María', apellido: 'García', email: 'maria.garcia@example.com', grupoId: 'g1', cursoId: 'c1', estado: 'pendiente' },
  { estudianteId: 'e3', nombre: 'Luis', apellido: 'Martínez', email: 'luis.martinez@example.com', grupoId: 'g1', cursoId: 'c1', estado: 'completada' },
  { estudianteId: 'e4', nombre: 'Ana', apellido: 'López', email: 'ana.lopez@example.com', grupoId: 'g2', cursoId: 'c1', estado: 'pendiente' },
  { estudianteId: 'e5', nombre: 'Pedro', apellido: 'Sánchez', email: 'pedro.sanchez@example.com', grupoId: 'g2', cursoId: 'c1', estado: 'completada' },
  { estudianteId: 'e6', nombre: 'Laura', apellido: 'Gómez', email: 'laura.gomez@example.com', grupoId: 'g2', cursoId: 'c1', estado: 'pendiente' },
];

export const RUBRICAS_DEMO: Rubrica[] = [
  {
    rubricaId: 'r1',
    nombreRubrica: 'Búsqueda y Evaluación de Información',
    dominio: Dominio.INFORMACION,
    criterios: ['Identificar necesidades de información', 'Localizar y acceder a contenido', 'Evaluar la fiabilidad de las fuentes', 'Organizar y almacenar información'],
    niveles: ['Inicial', 'Básico', 'Intermedio', 'Avanzado'],
  },
  {
    rubricaId: 'r2',
    nombreRubrica: 'Colaboración en Entornos Digitales',
    dominio: Dominio.COMUNICACION,
    criterios: ['Interactuar mediante tecnologías', 'Compartir información y contenido', 'Participar en ciudadanía digital', 'Gestionar la identidad digital'],
    niveles: ['Inicial', 'Básico', 'Intermedio', 'Avanzado'],
  },
  {
    rubricaId: 'r3',
    nombreRubrica: 'Desarrollo de Contenido Multimedia',
    dominio: Dominio.CREACION_CONTENIDO,
    criterios: ['Crear contenido en diversos formatos', 'Integrar y reelaborar contenido', 'Respetar derechos de autor y licencias', 'Programar y configurar software'],
    niveles: ['Inicial', 'Básico', 'Intermedio', 'Avanzado'],
  },
];
