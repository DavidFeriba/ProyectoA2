import { Alumno } from "./alumno.interface";

export interface Profesor {
    nombre:string;
    apellidos:string;
    cursos:string[];
    alumnos:Alumno[];
}