import CalificacionesRepository from '../repositories/calificaciones-repository.js';
import AlumnosService from './alumnos-service.js';
import MateriasService from './materias-service.js';

export default class CalificacionesService {
    constructor() {
        console.log('Estoy en: CalificacionesService.constructor()');
        this.CalificacionesRepository = new CalificacionesRepository();
        this.AlumnosService = new AlumnosService();
        this.MateriasService = new MateriasService();
    }

    getAllAsync = async () => {
        console.log(`CalificacionesService.getAllAsync()`);
        const returnArray = await this.CalificacionesRepository.getAllAsync();
        return returnArray;
    }

    getByIdAsync = async (id) => {
        console.log(`CalificacionesService.getByIdAsync(${id})`);
        const returnEntity = await this.CalificacionesRepository.getByIdAsync(id);
        return returnEntity;
    }

    getByAlumnoAsync = async (idAlumno) => {
        console.log(`CalificacionesService.getByAlumnoAsync(${idAlumno})`);
        // Regla de negocio: el alumno debe existir
        const alumno = await this.AlumnosService.getByIdAsync(idAlumno);
        if (alumno == null) {
            throw new Error(`El alumno con id ${idAlumno} no existe.`);
        }
        const returnArray = await this.CalificacionesRepository.getByAlumnoAsync(idAlumno);
        return returnArray;
    }

    createAsync = async (entity) => {
        console.log(`CalificacionesService.createAsync(${JSON.stringify(entity)})`);

        // Validacion 1: nota obligatoria y entre 0 y 10
        if (entity.nota === undefined || entity.nota === null || !Number.isInteger(entity.nota) || entity.nota < 0 || entity.nota > 10) {
            throw new Error(`La nota debe ser un número entero entre 0 y 10.`);
        }

        // Validacion 2: el alumno debe existir
        const alumno = await this.AlumnosService.getByIdAsync(entity.id_alumno);
        if (alumno == null) {
            throw new Error(`El alumno con id ${entity.id_alumno} no existe.`);
        }

        // Validacion 3: la materia debe existir
        const materia = await this.MateriasService.getByIdAsync(entity.id_materia);
        if (materia == null) {
            throw new Error(`La materia con id ${entity.id_materia} no existe.`);
        }

        // Validacion 4: no debe existir ya una calificacion para ese alumno en esa materia
        const calificacionExistente = await this.CalificacionesRepository.getByAlumnoAndMateriaAsync(entity.id_alumno, entity.id_materia);
        if (calificacionExistente != null) {
            const conflictError = new Error(`Ya existe una calificación para el alumno ${entity.id_alumno} en la materia ${entity.id_materia}.`);
            conflictError.isConflict = true;
            throw conflictError;
        }

        const result = await this.CalificacionesRepository.createAsync(entity);
        return result;
    }

    updateAsync = async (entity) => {
        console.log(`CalificacionesService.updateAsync(${JSON.stringify(entity)})`);

        // Validacion 1: la calificacion debe existir
        const calificacion = await this.CalificacionesRepository.getByIdAsync(entity.id);
        if (calificacion == null) {
            throw new Error(`No se encontró la calificación (id: ${entity.id}).`);
        }

        // Validacion 2: si se envia nota, debe ser entre 0 y 10
        if (entity.nota !== undefined && entity.nota !== null) {
            if (!Number.isInteger(entity.nota) || entity.nota < 0 || entity.nota > 10) {
                throw new Error(`La nota debe ser un número entero entre 0 y 10.`);
            }
        }

        // Si no se envia nota o fecha, usar los valores actuales
        entity.nota = entity.nota ?? calificacion.nota;
        entity.fecha = entity.fecha ?? calificacion.fecha;

        const rowsAffected = await this.CalificacionesRepository.updateAsync(entity);
        return rowsAffected;
    }

    deleteByIdAsync = async (id) => {
        console.log(`CalificacionesService.deleteByIdAsync(${id})`);
        const rowsAffected = await this.CalificacionesRepository.deleteByIdAsync(id);
        return rowsAffected;
    }
}
