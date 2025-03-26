import { Alumno } from "./alumno.interface";
import { Curso } from "./curso.interface";

export interface Profesor {
    nombre:string;
    apellidos:string;
    curso:Curso;
    alumnos:Alumno[];
}