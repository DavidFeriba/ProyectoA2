import { Injectable } from '@angular/core';
import { Profesor } from 'src/models/profesor.interface';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {
  public profesor: Profesor = {
    nombre: "Carlos",
    apellidos: "Suviela",
    clase: "2º",
    alumnos: []
  }

  constructor() { }
}
