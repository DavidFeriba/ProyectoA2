import { Injectable } from '@angular/core';
import { AuthResponse, createClient, SupabaseClient } from '@supabase/supabase-js';
import { from, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {

  from(arg0: string) {
    throw new Error('Method not implemented.');
  }
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(
      'https://xihoqjtqwissymcnjrud.supabase.co', // Reemplaza con tu URL
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhpaG9xanRxd2lzc3ltY25qcnVkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI3NTcwNTYsImV4cCI6MjA1ODMzMzA1Nn0.ASXM7c6p368dRN13dS5Gmm0TnSjABkV7Ov4vL7IZMn4' // Reemplaza con tu API Key
    );

  }
  get auth() {
    return this.supabase.auth;
  }
  getUsuarioActual() {
    return this.supabase.auth.getUser();
  }

  cerrarSesion(){
    this.supabase.auth.signOut()
  }

  async loginTutor(email: string, password: string){
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error || !data?.user) {
      console.error('Error de inicio de sesión o usuario no válido:', error);
      return false;
    }
    const user = data?.user;

      const { data: tutorData, error: tutorError } = await this.supabase
        .from('tutores')
        .select('*')
        .eq('email', email)
        .single();

        if (tutorError || !tutorData) {
          console.error('No se encontró el tutor o error:', tutorError);
          return false;
        }
    return true;
  }
  async loginProfesor(email: string, password: string){
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error || !data?.user) {
      console.error('Error de inicio de sesión o usuario no válido:', error);
      return false;
    }
    const user = data?.user;

      const { data: profesorData, error: profesorError } = await this.supabase
        .from('profesores')
        .select('*')
        .eq('email', email)
        .single();

        if (profesorError || !profesorData) {
          console.error('No se encontró el tutor o error:', profesorError);
          return false;
        }

    return true;
  }
  async  obtenerAlumnosDelProfesor(uidProfesor: string | number) {
    console.log("HOLA")
    const { data: profesorData, error: profesorError } = await this.supabase
      .from('profesores')
      .select('cursos')
      .eq('uid', uidProfesor)
      .single();

    if (profesorError || !profesorData) {
      console.error('Error obteniendo tutor:', profesorError);
      return [];
    }
    const cursos = profesorData.cursos;
    const { data: alumnosData, error: alumnosError } = await this.supabase
    .from('alumnos')
    .select('*')
    .in('curso', cursos);
    if (alumnosError) {
      console.error('Error obteniendo alumnos:', alumnosError);
      return [];
    }
    console.log(cursos)
    console.log(alumnosData.flatMap)
    return alumnosData
  }

  async  obtenerAlumnosDelTutor(uidTutor: string | number) {
    if(typeof uidTutor === 'string'){
    const { data: tutorData, error: tutorError } = await this.supabase
      .from('tutores')
      .select('id')
      .eq('uid', uidTutor)
      .single();

    if (tutorError || !tutorData) {
      console.error('Error obteniendo tutor:', tutorError);
      return [];
    }

    const { data: alumnosData, error: alumnosError } = await this.supabase
      .from('alumno_tutor')
      .select('alumnos(id, nombre, apellidos, foto, curso)')
      .eq('tutor_id', tutorData.id);

    if (alumnosError) {
      console.error('Error obteniendo alumnos:', alumnosError);
      return [];
    }

    return alumnosData.flatMap(entry => entry.alumnos);
  }else{
    const { data: alumnosData, error: alumnosError } = await this.supabase
    .from('alumno_tutor')
    .select('alumnos(id, nombre, apellidos, foto, curso)')
    .eq('tutor_id', uidTutor);

    if (alumnosError) {
      console.error('Error obteniendo alumnos:', alumnosError);
      return [];
    }

    return alumnosData.flatMap(entry => entry.alumnos);
  }
  }




  async addAlumno(nombre: string, apellidos: string, curso: string, foto: string, tutorId: number, pin: number) {
    try {
      // Insertar el nuevo alumno en la tabla "alumnos"
      const { data: alumnoData, error: alumnoError } = await this.supabase.from('alumnos').insert([{
        nombre,
        apellidos,
        foto,
        curso,
        pin
      }]).select();  // Aseguramos que seleccionamos los datos devueltos

      // Si ocurrió un error al insertar el alumno
      if (alumnoError) {
        throw new Error('Error al insertar alumno: ' + alumnoError.message);
      }

      // Verificar que `alumnoData` no sea null ni vacío
      if (!alumnoData || alumnoData.length === 0) {
        throw new Error('No se insertó ningún alumno');
      }

      // Obtener el ID del alumno recién creado
      const alumnoId = alumnoData[0].id;  // El primer elemento es el alumno insertado

      // Insertar la relación entre el alumno y el tutor en la tabla "alumno_tutor"
      const { data: alumnoTutorData, error: alumnoTutorError } = await this.supabase.from('alumno_tutor').insert([{
        tutor_id: tutorId,
        alumno_id: alumnoId
      }]);

      // Si ocurrió un error al insertar la relación alumno-tutor
      if (alumnoTutorError) {
        throw new Error('Error al insertar relación alumno-tutor: ' + alumnoTutorError.message);
      }

      // Retornar los datos del alumno y la relación creada
      return { alumno: alumnoData, alumnoTutor: alumnoTutorData };

    } catch (error: any) {
      console.error('Error al agregar alumno:', error.message);
      throw new Error(error.message);  // Lanza el error para manejarlo en el componente
    }
  }

  async subirArchivo(bucket: string, filePath: string, file: File) {
    const { data, error } = await this.supabase.storage.from(bucket).upload(filePath, file, { upsert: true });

    if (error) {
      console.error('Error al subir archivo:', error.message);
      return { error };
    }

    return { data };
  }
  async registerTutor(email: string, password: string, rol: string, nombre: string, apellidos: string) {
    try {
      // Intentar registrar al usuario
      const response = await this.supabase.auth.signUp({
        email,
        password,
      });

      // Verificar si hay un error
      if (response.error) {
        throw new Error(response.error.message);  // Lanza el mensaje del error
      }

      // Si el registro fue exitoso, obtener el usuario
      const user = response.data.user;

      if (user) {
        // Realizar el insert con los datos del formulario
        const { data, error } = await this.supabase.from("tutores").insert([{
          email: user.email,
          nombre,
          apellidos,
          rol,
          uid: user.id

        }]);

        if (error) {
          throw new Error(error.message);  // Lanza el error si ocurre un problema con el insert
        }

        // Si el insert fue exitoso, retorna el usuario
        return data;
      } else {
        throw new Error('Usuario no encontrado después del registro');
      }

    } catch (error: any) {  // Captura el error y lanza un mensaje
      console.error('Error al registrar usuario:', error.message);
      throw new Error(error.message);  // Lanza el error para manejarlo en el componente
    }
  }

  async registerProfesor(email: string, password: string, asignaturas:string[], cursos:string[] ,nombre: string, apellidos: string, ) {
    try {
      // Intentar registrar al usuario
      const response = await this.supabase.auth.signUp({
        email,
        password,
      });

      // Verificar si hay un error
      if (response.error) {
        throw new Error(response.error.message);  // Lanza el mensaje del error
      }

      // Si el registro fue exitoso, obtener el usuario
      const user = response.data.user;

      if (user) {
        // Si es padre, insertar en la tabla "padres", si es profesor, insertar en la tabla "profesores"

        // Realizar el insert con los datos del formulario
        const { data, error } = await this.supabase.from("profesores").insert([{
          email: user.email,
          nombre,
          apellidos,
          asignaturas,
          cursos,
          uid: user.id
        }]);

        if (error) {
          throw new Error(error.message);  // Lanza el error si ocurre un problema con el insert
        }

        // Si el insert fue exitoso, retorna el usuario
        return data;
      } else {
        throw new Error('Usuario no encontrado después del registro');
      }

    } catch (error: any) {  // Captura el error y lanza un mensaje
      console.error('Error al registrar usuario:', error.message);
      throw new Error(error.message);  // Lanza el error para manejarlo en el componente
    }
  }
  async getDatosProfesor() {
    const { data: userData, error: userError } = await this.supabase.auth.getUser();
console.log('User data:', userData);  // Verifica el contenido de userData
if (userError || !userData.user) {
  throw new Error('No se pudo obtener el usuario logueado');
}

    const userId = userData.user.id;

    const { data: profesor, error } = await this.supabase
      .from('profesores')
      .select('*')
      .eq('uid', userId)
      .single();

    if (error) {
      throw new Error('No se encontró al tutor');
    }

    return profesor;
  }
  async getDatosTutor() {
    const { data: userData, error: userError } = await this.supabase.auth.getUser();
console.log('User data:', userData);  // Verifica el contenido de userData
if (userError || !userData.user) {
  throw new Error('No se pudo obtener el usuario logueado');
}

    const userId = userData.user.id;

    const { data: tutor, error } = await this.supabase
      .from('tutores')
      .select('*')
      .eq('uid', userId)
      .single();

    if (error) {
      throw new Error('No se encontró al tutor');
    }

    return tutor;
  }
  async vincularTutores(tutor_uid:string, correoDestino:string):Promise<boolean>{

    const {data: tutorCorreo, error:errorCorreo} = await this.supabase.from('tutores').select('id, vinculado_id').eq('email',correoDestino).single();
    const {data: tutorOriginal, error: errorOriginal} = await this.supabase.from('tutores').select('id').eq('uid',tutor_uid).single();
    console.log('Error tutorCorreo:', errorCorreo);
console.log('Error tutorOriginal:', errorOriginal);
    if (errorCorreo || errorOriginal) {

      throw new Error('Error al obtener los tutores')
    }
    console.log('tutorCorreo:', tutorCorreo);
console.log('tutorOriginal:', tutorOriginal);
if(tutorCorreo.vinculado_id == null){
    await this.supabase.from('tutores').update({vinculado_id: tutorOriginal.id}).eq('email', correoDestino)
    await this.supabase.from('tutores').update({vinculado_id: tutorCorreo.id}).eq('uid', tutor_uid)
    return false
  }else{
    return true
  }
  }
  async eliminarVinculo(tutor_uid:string,tutor_vinc_id:number){
    await this.supabase.from('tutores').update({vinculado_id:null}).eq('uid',tutor_uid)
    await this.supabase.from('tutores').update({vinculado_id:null}).eq('id',tutor_vinc_id)
  }
  async confirmarPin(pin:number) {

    const { data: alumno, error } = await this.supabase
      .from('alumnos')
      .select('*')
      .eq('pin', pin)
      .single();

    if (error) {
      throw new Error('No se encontró al tutor');
    }

    return alumno;
  }
  async comprobarLogin(){
    const { data } = await this.supabase.auth.getSession();
    const session = data.session;
    if(session){
      console.log('Session User ID:', session.user.id);
      const { data: tutor, error:tutorError } = await this.supabase
      .from('tutores')
      .select('id')
      .eq('uid', session.user.id)
      .single();
      if (tutor && !tutorError) {
        return "tutor";
      }
      const { data: profesor ,error: profesorError} = await this.supabase
      .from('profesores')
      .select('id')
      .eq('uid', session.user.id)
      .single();


      if (profesor && !profesorError) {
        return "profesor";
      }
    }
    return "nada"
  }
  async anadirTarea(data: any){
    const actividades = `${data.primeraActividad} - ${data.ultimaActividad}`;
    const {error} = await this.supabase.from('tareas').insert([{
      asignatura: data.asignatura,
      pagina: data.pagina,
      actividades: actividades,
      anotacion: data.anotacion,
      curso: data.curso,
      id_profesor: data.id,
      f_limite: data.f_limite
    }])
    if (error) {
      console.error("Error al insertar tarea:", error.message);
    } else {
      console.log("Tarea insertada correctamente");
    }
  }
  async getTareasProfesor(){
    const profesor = await this.getDatosProfesor()
    const {data, error} = await this.supabase.from('tareas').select('*').eq('id_profesor',profesor.id)
    if (error) {
      console.error("Error al coger las tareas", error)
      return[]
    }
    return data
  }




}