import CalificacionesRepository from '../repositories/calificaciones-repository.js';
import AlumnosService from './alumnos-service.js';
import MateriasService from './materias-service.js';

export default class CalificacionesService {
    constructor() {
        console.log('Estoy en: CalificacionesService.constructor()');
        this.AlumnosService = new AlumnosService();
        this.MateriasService = new MateriasService();
    }

    getAllAsync = async () => {
        console.log(`CalificacionesService.getAllAsync()`);
        const returnArray = await this.CalificacionesRepository.getAllAsync();
        if (returnArray == null) return null;
        return returnArray;
    }

    getByIdAsync = async (id) => {
        console.log(`CalificacionesService.getByIdAsync(${id})`);
        const returnEntity = await this.CalificacionesRepository.getByIdAsync(id);
        // Regla de negocio que agrega la edad.!!!
        return returnEntity;
    }

    createAsync = async (entity) => {
        console.log(`CalificacionesService.createAsync(${JSON.stringify(entity)})`);
        // Regla de negocio!!!
        await this.validarCursoExiste(entity.id_curso);
        // Si llegue aca es que no hubo un error.
        const rowsAffected = await this.AlumnosRepository.createAsync(entity);
        return rowsAffected;
    }

    updateAsync = async (entity) => {
        console.log(`CalificacionesService.updateAsync(${JSON.stringify(entity)})`);
        // Regla de Negocio!
        if (entity.id_curso) {
            await this.validarCursoExiste(entity.id_curso);
        }
        
        const rowsAffected = await this.AlumnosRepository.updateAsync(entity);
        return rowsAffected;
    }

    deleteByIdAsync = async (id) => {
        console.log(`CalificacionesService.deleteByIdAsync(${id})`);
        const rowsAffected = await this.AlumnosRepository.deleteByIdAsync(id);
        return rowsAffected;
    }

    validarCursoExiste = async (idCurso) => {
        if (!idCurso) return; // Early return

        const curso = await this.CursosService.getByIdAsync(idCurso);
        if (curso == null) {
            throw new Error(`El curso con id ${idCurso} no existe.`);
        }
    }
}

    validarAlumnoExiste = async (idAlumno) => {
        if (!idAlumno) return; // Early return

        const alumno = await this.AlumnosService.getByIdAsync(idAlumno);
        if (alumno == null) {
            throw new Error(`El alumno con id ${idAlumno} no existe.`);
        }
    }
    
    validarMateriaExiste = async (idMateria) => {
        if (!idMateria) return; // Early return

        const materia = await this.MateriasService.getByIdAsync(idMateria);
        if (materia == null) {
            throw new Error(`La materia con id ${idMateria} no existe.`);
        }
    }
