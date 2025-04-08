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
  
  
  async login(email: string, password: string) {
    // Iniciar sesión con Supabase
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      console.error('Error de inicio de sesión:', error);
      return { error };
    }
    
    const user = data?.user;

    if (user) {
      // Verificar si el usuario está en la tabla de tutores
      const { data: tutorData, error: tutorError } = await this.supabase
        .from('tutores')
        .select('*')
        .eq('email', email)
        .single();

      // Verificar si el usuario está en la tabla de profesores
      const { data: profesorData, error: profesorError } = await this.supabase
        .from('profesores')
        .select('*')
        .eq('email', email)
        .single();
        const { data: alumnoData, error: alumnoError } = await this.supabase
        .from('alumnos')
        .select('*')
        .eq('email', email)
        .single();

      if (tutorData) {
        // Si es tutor, asignar el rol
        user.role = 'tutor';
      } else if (profesorData) {
        // Si es profesor, asignar el rol
        user.role = 'profesor';
      } else if(alumnoData){
        user.role = 'alumno'
      }else{
        console.error('Usuario no encontrado en las tablas de tutores ni profesores');
        return { error: 'Usuario no encontrado' };
      }
    }

    return { user, error };
  }
  

  async obtenerAlumnosDelTutor() {
    // Paso 1: Obtener el usuario logueado
    const { data: { user }, error: userError } = await this.supabase.auth.getUser();
    if (userError || !user) {
      console.error('Error al obtener usuario logueado:', userError);
      return [];
    }
  
    // Paso 2: Obtener el ID del tutor con ese user_id
    const { data: tutorData, error: tutorError } = await this.supabase
      .from('tutores')
      .select('id')
      .eq('uid', user.id)
      .single();
  
    if (tutorError || !tutorData) {
      console.error('Error al obtener tutor:', tutorError);
      return [];
    }
  
    const tutorId = tutorData.id;
  
    // Paso 3: Buscar alumnos relacionados en la tabla intermedia
    const { data, error } = await this.supabase
      .from('tutores_alumnos')
      .select('alumnos(*)') // Esto trae los datos de la tabla alumnos
      .eq('tutor_id', tutorId);
  
    if (error) {
      console.error('Error al obtener alumnos del tutor:', error);
      return [];
    }
  
    // Paso 4: Extraer los alumnos del resultado
    const alumnos = data.flatMap((registro) => registro.alumnos);
    console.log('Alumnos asociados al tutor:', alumnos);
    return alumnos;
  }

;
  
  
  async addAlumno(nombre: string, apellidos: string, curso: string, foto: string, tutorId: number) {
    try {
      // Insertar el nuevo alumno en la tabla "alumnos"
      const { data: alumnoData, error: alumnoError } = await this.supabase.from('alumnos').insert([{
        nombre,
        apellidos,
        foto,
        curso
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
          cursos
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
  
  
}