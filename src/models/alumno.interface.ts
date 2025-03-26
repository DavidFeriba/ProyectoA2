import { Aviso } from "./aviso.interface";
import { Curso } from "./curso.interface";
import { Logro } from "./logro.interface";
import { Nota } from "./nota.interface";
import { Profesor } from "./profesor.interface";

export interface Alumno{
    nombre:string;
    apellidos:string;
    foto:string;
    notas?: Nota[];
    profesor?: Profesor;
    curso: Curso;
    logros?: Logro[];
    avisos?: Aviso[];
}