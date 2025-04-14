import { Aviso } from "./aviso.interface";
import { Logro } from "./logro.interface";
import { Nota } from "./nota.interface";
import { Profesor } from "./profesor.interface";

export interface Alumno{
    id: number;
    nombre:string;
    apellidos:string;
    foto:string;
    notas?: Nota[];
    profesor?: Profesor;
    curso: string;
    logros?: Logro[];
    avisos?: Aviso[];
}