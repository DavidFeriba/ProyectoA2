import { Alumno } from "./alumno.interface";
import { Profesor } from "./profesor.interface";

export interface Curso{
    curso:string,
    profesor:Profesor,
    alumnos:Alumno[]
}