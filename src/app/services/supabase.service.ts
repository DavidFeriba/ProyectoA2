import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(
      'https://xihoqjtqwissymcnjrud.supabase.co', // Reemplaza con tu URL
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhpaG9xanRxd2lzc3ltY25qcnVkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI3NTcwNTYsImV4cCI6MjA1ODMzMzA1Nn0.ASXM7c6p368dRN13dS5Gmm0TnSjABkV7Ov4vL7IZMn4' // Reemplaza con tu API Key
    );
  }

  async obtenerUsuarios() {
    const { data, error } = await this.supabase.from('usuarios').select('*');
    if (error) {
      console.error('Error al obtener usuarios:', error);
      return [];  // Si hay error, devolvemos un array vacío
    }
    console.log('Datos obtenidos de Supabase:', data);  // Agrega esto para ver qué datos recibes
    return data;
  }
}