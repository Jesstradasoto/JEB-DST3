
export enum UserRole {
  ADMIN = 'ADMIN',
  DOCENTE = 'DOCENTE',
  ESTUDIANTE = 'ESTUDIANTE',
}

export interface User {
  userId: string;
  nombre: string;
  email: string;
  rol: UserRole;
  fotoUrl: string;
}

export interface Curso {
  cursoId: string;
  nombreCurso: string;
  grado: string;
  docenteId: string;
}

export interface Grupo {
  grupoId: string;
  nombreGrupo: string;
  cursoId: string;
}

export interface Estudiante {
  estudianteId: string;
  nombre: string;
  apellido: string;
  email: string;
  grupoId: string;
  cursoId: string;
  estado: 'completada' | 'pendiente';
}

export enum Dominio {
  INFORMACION = 'Información y alfabetización digital',
  COMUNICACION = 'Comunicación y colaboración',
  CREACION_CONTENIDO = 'Creación de contenido digital',
  SEGURIDAD = 'Seguridad',
  RESOLUCION_PROBLEMAS = 'Resolución de problemas',
}

export interface Rubrica {
  rubricaId: string;
  nombreRubrica: string;
  dominio: Dominio;
  criterios: string[]; 
  niveles: string[];
}

export interface DiagnosticQuestion {
  id: string;
  type: 'multiple_choice' | 'true_false' | 'short_answer';
  question: string;
  options?: string[];
}

export interface StudentAnswer {
  questionId: string;
  answer: string | boolean;
}

export interface EvaluationResult {
  puntajeTotal: number;
  nivelLogro: string;
  recomendacionesIA: string;
  resultadosPorCriterio: {
    criterio: string;
    puntaje: number;
    comentarioIA: string;
  }[];
}
