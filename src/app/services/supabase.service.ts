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
  async obtenerCorreos() {
    const { data: correosTutores, error: errorTutores } = await this.supabase
      .from('tutores')
      .select('email');

    if (errorTutores) {
      console.error('Error al obtener correos de tutores', errorTutores);
      return [];
    }

    const { data: correosProfesores, error: errorProfesores } = await this.supabase
      .from('profesores')
      .select('email');

    if (errorProfesores) {
      console.error('Error al obtener correos de profesores', errorProfesores);
      return [];
    }

    // Extraer los correos de los objetos y combinarlos
    const correosTutoresArray = correosTutores?.map(tutor => tutor.email) || [];
    const correosProfesoresArray = correosProfesores?.map(profesor => profesor.email) || [];

    // Unir los correos de ambas tablas
    const todosLosCorreos = [...correosTutoresArray, ...correosProfesoresArray];
    return todosLosCorreos;
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
  async pinExiste(pin: number){
    const { data: pinExistente, error: pinError } = await this.supabase
    .from('alumnos')
    .select('id')
    .eq('pin', pin);

  if (pinError) {
    throw new Error('Error al verificar el PIN: ' + pinError.message);
  }

  if (pinExistente && pinExistente.length > 0) {
    return true
  }else{
    return false;
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
  async obtenerFechasConTareas(curso:string): Promise<string[]> {
    const { data, error } = await this.supabase
      .from('tareas')
      .select('f_limite')
      .eq('curso', curso.trim())

    if (error) {
      console.error('Error al obtener fechas con tareas:', error);
      return [];
    }

    // Filtra y devuelve solo las fechas únicas en formato string
    const fechas = data.map((t: { f_limite: string }) => t.f_limite);
    return Array.from(new Set(fechas));
  }
  async obtenerTareasPorFechaYCurso(fecha: string, curso: string) {
    console.log("Buscando tareas para:", curso, fecha);

    const { data, error } = await this.supabase
      .from('tareas')
      .select('*')
      .eq('curso', curso)
      .filter('f_limite', 'eq', fecha); // Comparación solo por fecha exacta

    if (error) {
      console.error('Error al obtener tareas:', error);
      return [];
    }

    return data;
  }

  async obtenerAlumno(idAlumno: string): Promise<any | null> {
    const { data, error } = await this.supabase
      .from('alumnos')
      .select('*')
      .eq('id', idAlumno)
      .single();

    if (error) {
      console.error('Error al obtener alumno:', error);
      return null;
    }

    return data;
  }
  async marcarTareaCompletada(alumnoId: string, tareaId: string) {
    const { data, error } = await this.supabase
      .from('tareas_completadas')
      .upsert([{
        alumno_id: alumnoId,
        tarea_id: tareaId,
        completada: true,
        fecha_completada: new Date().toISOString(), // Fecha de cuando se marca como completada
      }]);

    if (error) {
      console.error('Error al marcar tarea como completada:', error);
    }

    return data;
  }
  async marcarTareaIncompleta(alumnoId: string, tareaId: string) {
    const { data, error } = await this.supabase
      .from('tareas_completadas')
      .upsert([{
        alumno_id: alumnoId,
        tarea_id: tareaId,
        completada: false,
        fecha_completada: null, // Borramos la fecha cuando se marca como incompleta
      }]);

    if (error) {
      console.error('Error al marcar tarea como incompleta:', error);
    }

    return data;
  }
  async obtenerTareasConEstado(alumno_id: string): Promise<any[]> {
    const { data, error } = await this.supabase
      .from('tareas_completadas')
      .select('tarea_id, completada')
      .eq('alumno_id', alumno_id); // Asegúrate de filtrar por alumno

    if (error) {
      console.error('Error al obtener el estado de las tareas:', error);
      return [];
    }

    return data;
  }

  async actualizarEstadoTarea(alumnoId: string, tareaId: string, estado: boolean) {

    const { data, error } = await this.supabase
      .from('tareas_completadas')  // Tabla donde se guarda el estado completado
      .upsert([
        { alumno_id: alumnoId, tarea_id: tareaId, completada: estado, fecha_completada: new Date(), revisada: false }
      ], { onConflict: 'alumno_id,tarea_id' })  // Usar una cadena separada por comas
    if (error) {
      console.error("Error al actualizar estado de tarea:", error);
    }
    return data;
  }
  async subirFotoTarea(alumnoId: string, tareaId: string, estado: boolean, url:string) {
    const { data, error } = await this.supabase
      .from('tareas_completadas')  // Tabla donde se guarda el estado completado
      .upsert([
        { alumno_id: alumnoId, tarea_id: tareaId, completada: estado, fecha_completada: new Date(),foto: url, revisada: false  }
      ], { onConflict: 'alumno_id,tarea_id' })  // Usar una cadena separada por comas
    if (error) {
      console.error("Error al actualizar estado de tarea:", error);
    }
    return data;
  }
  async obtenerDetallesTareasConFoto(alumnoId: string, profesorId: string) {
    const { data, error } = await this.supabase
      .from('tareas_completadas')
      .select(`
        id,
        completada,
        fecha_completada,
        foto,
        revisada,
        tareas (
          id,
          asignatura,
          pagina,
          actividades,
          anotacion,
          id_profesor,
          curso,
          f_limite
        )
      `)
      .eq('alumno_id', alumnoId)
      .eq('completada', true)
      .eq('revisada', false)
      .filter('tareas.id_profesor', 'eq', profesorId);

    if (error) {
      console.error('Error al obtener tareas con foto:', error);
      return [];
    }

    return data;
  }
  async obtenerTareasPorDia(alumnoId: string) {
    const { data, error } = await this.supabase
      .from('tareas_completadas')
      .select(`
        id,
        completada,
        fecha_completada,
        revisada,
        tarea_id
      `)
      .eq('alumno_id', alumnoId)
      .eq('completada', true)
      .eq('revisada', true);

    if (error) {
      console.error('Error al obtener tareas por dia:', error);
      return [];
    }

    // Arreglo para contar las tareas completadas por día de la semana (Domingo = 0, Lunes = 1, ..., Sábado = 6)
    const tareasPorDia: number[] = [0, 0, 0, 0, 0, 0, 0]; // [Domingo, Lunes, Martes, Miércoles, Jueves, Viernes, Sábado]

    // Iterar sobre las tareas para contar cuántas se completaron en cada día
    data.forEach((tarea: any) => {
      const fecha = new Date(tarea.fecha_completada);
      const diaSemana = fecha.getDay(); // Obtener el índice del día de la semana (0=Domingo, 1=Lunes, ..., 6=Sábado)

      // No es necesario ajustar el índice, ya que getDay() ya devuelve Domingo=0, Lunes=1, ..., Sábado=6
      tareasPorDia[diaSemana]++;
    });

    // Retornar los datos procesados
    return tareasPorDia;
  }

  async obtenerTareasTodas(profesorId: string, curso: string) {
    const { data, error } = await this.supabase
      .from('tareas_completadas')
      .select(`
        id,
        alumno_id,
        tarea_id,
        completada,
        fecha_completada,
        foto,
        revisada,
        tareas (
          id,
          asignatura,
          pagina,
          actividades,
          anotacion,
          id_profesor,
          curso,
          f_limite
        )
      `)
      .eq('completada', true)
      .eq('revisada', false)
      .filter('tareas.id_profesor', 'eq', profesorId)
      .filter('tareas.curso', 'eq', curso);

    return error ? [] : data;
  }
  async actualizarEstadoTareaCompletada(tareaId: number, completada: boolean) {
    const { error } = await this.supabase
      .from('tareas_completadas')
      .update({
        completada: completada,
        fecha_completada: completada ? new Date().toISOString() : null,
        revisada: true
      })

      .eq('tarea_id', tareaId)

      console.log(tareaId)


    if (error) throw error;
  }
  async comprobarLogros(alumno_id:string){
    const { data: tareas, error: tareasError } = await this.supabase
    .from('tareas_completadas')
    .select('*')
    .eq('alumno_id', alumno_id)
    .eq('completada',true)
    .eq ('revisada' , true)
    if (tareasError){
      console.error(tareasError);
      return;
    }
    console.log("Resultado de tareas completadas:", tareas);

    const {data:logrosConseguidos1, error: logrosConseguidosError1} = await this.supabase
    .from('logros_alumnos')
    .select('*')
    .eq('alumno_id', alumno_id)
    .eq('logro_id', 1)
    const {data:logrosConseguidos2, error: logrosConseguidosError2} = await this.supabase
    .from('logros_alumnos')
    .select('*')
    .eq('alumno_id', alumno_id)
    .eq('logro_id', 1)
    console.log("Condición:", (tareas?.length ?? 0) >= 1, "y", (logrosConseguidos1?.length ?? 0) === 0);
    if ((tareas?.length ?? 0) >= 1 && (logrosConseguidos1?.length ?? 0) === 0) {
      const { error: insertError } = await this.supabase
        .from('logros_alumnos')
        .insert([
          { logro_id: 1, alumno_id: alumno_id }
        ]);

      if (insertError) {
        console.error("Error al insertar logro:", insertError);
        return;
      }

      console.log("¡Logro insertado con éxito!");
    }
    if ((tareas?.length ?? 0) >= 5 && (logrosConseguidos2?.length ?? 0) === 0) {
      const { error: insertError } = await this.supabase
        .from('logros_alumnos')
        .insert([
          { logro_id: 2, alumno_id: alumno_id }
        ]);

      if (insertError) {
        console.error("Error al insertar logro:", insertError);
        return;
      }

      console.log("¡Logro insertado con éxito!");
    }



  }
  async obtenerLogros(alumno_id: string) {
    const { data: logros_alumnos, error: logros_alumnosError } = await this.supabase
      .from('logros_alumnos')
      .select('*')
      .eq('alumno_id', alumno_id);
      console.log("logros_alumnos data:", logros_alumnos);
      console.log("logros_alumnos error:", logros_alumnosError);

    if (logros_alumnosError) {
      console.error("Error al obtener logros_alumnos:", logros_alumnosError);
      return;
    }

    if ((logros_alumnos?.length ?? 0) > 0) {
      // Extraemos todos los logro_id en un array
      const idsLogros = logros_alumnos.map(l => l.logro_id);

      const { data: logros, error: logrosError } = await this.supabase
        .from('logros')
        .select('*')
        .in('id', idsLogros); // Aquí hacemos el select de los logros por ID

      if (logrosError) {
        console.error("Error al obtener logros:", logrosError);
        return;
      }

      console.log("Logros del alumno:", logros);
      return logros;
    }

    // Si no tiene logros, devolvemos un array vacío
    return [];
  }
  async crearAviso(idAlumno: string, idProfesor: string, mensaje: string, grado: number) {
    const fecha = new Date().toISOString();

    const { error } = await this.supabase
      .from('avisos')
      .insert([
        {
          id_alumno: idAlumno,
          id_profesor: idProfesor,
          fecha: fecha,
          mensaje: mensaje,
          grado: grado
        }
      ]);

    if (error) {
      console.error('Error al crear el aviso:', error.message);
      throw error;
    } else {
      console.log('Aviso creado correctamente');
    }
  }
  async obtenerAvisos(idProfesor: string) {
    const { data, error } = await this.supabase
      .from('avisos')
      .select(`
        id,
        grado,
        mensaje,
        fecha,
        alumnos (
          nombre,
          apellidos
        )
      `)
      .eq('id_profesor', idProfesor);

    if (error) throw error;

    return data;
  }
  async obtenerAvisosDeAlumno(idAlumno: string) {
    const { data, error } = await this.supabase
      .from('avisos')
      .select(`
        *
      `)
      .eq('id_alumno', idAlumno);

    if (error) throw error;

    return data;
  }
  async borrarAviso(id: number) {
    const { data, error } = await this.supabase
      .from('avisos')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error al borrar el aviso:', error);
      throw error;
    }

    return data;
  }
  async cogerAsignaturas(profesor_id: string){
    const {data} = await this.supabase
      .from('profesores')
      .select('asignaturas')
      .eq('id', profesor_id)
      .single();
      return data?.asignaturas
  }
  async anadirAsignatura(profesor_id: string ,asignatura: string){
    const asignaturas: any = await this.cogerAsignaturas(profesor_id)
    asignaturas.push(asignatura)
    await this.supabase
      .from('profesores')
      .update({asignaturas: asignaturas})
      .eq('id', profesor_id);
}
  async eliminarAsignatura(profesor_id: string, asignaturaEliminada: string){
    let asignaturas: any = await this.cogerAsignaturas(profesor_id)
    asignaturas = asignaturas.filter(
      (asignatura: string) => asignatura !== asignaturaEliminada
    )
    await this.supabase
    .from('profesores')
    .update({asignaturas: asignaturas})
    .eq('id', profesor_id)
  }
  async cogerCursos(profesor_id: string){
    const {data} = await this.supabase
      .from('profesores')
      .select('cursos')
      .eq('id', profesor_id)
      .single();
      return data?.cursos
  }
  async anadirCurso(profesor_id: string ,curso: string){
    const cursos: any = await this.cogerCursos(profesor_id)
    cursos.push(curso)
    await this.supabase
      .from('profesores')
      .update({cursos: cursos})
      .eq('id', profesor_id);
}
  async eliminarCurso(profesor_id: string, cursoEliminado: string){
    let cursos: any = await this.cogerCursos(profesor_id)
    cursos = cursos.filter(
      (curso: string) => curso !== cursoEliminado
    )
    await this.supabase
    .from('profesores')
    .update({cursos: cursos})
    .eq('id', profesor_id)
  }
  async eliminarAlumno(alumno_id: string){
    await this.supabase.from('tareas_completadas').delete().eq('alumno_id', alumno_id);
    await this.supabase.from('logros_alumnos').delete().eq('alumno_id', alumno_id);
    await this.supabase.from('alumno_tutor').delete().eq('alumno_id', alumno_id);
    await this.supabase.from('notas').delete().eq('alumno_id', alumno_id);

    await this.supabase
    .from('alumnos')
    .delete()
    .eq('id', alumno_id)
  }
}







