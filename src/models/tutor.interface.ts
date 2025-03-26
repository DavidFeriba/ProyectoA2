import { Alumno } from "./alumno.interface";

export interface Tutor {
    nombre:string,
    apellidos:string,
    rol:string,
    alumno:Alumno
}