/* Creado por Jesús Pirela */
/**
 * C:/Users/admin/Documents/easygo-academy-pro/src/infrastructure/database/SupabaseClient.ts
 * Infraestructura: Cliente Singleton para Supabase (Híbrido Web/Mobile)
 */

import { createClient } from '@supabase/supabase-js';

// Detección de entorno para obtener las llaves correctamente
let supabaseUrl = '';
let supabaseAnonKey = '';

// 1. Intentar obtener de variables de entorno (Vite/Web)
if (typeof import.meta !== 'undefined' && import.meta.env) {
  supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
}

// 2. Si no existen (Entorno Expo/Mobile), intentar desde Constants
if (!supabaseUrl || !supabaseAnonKey) {
  try {
    // Importación dinámica para evitar errores en Web puro
    const Constants = require('expo-constants').default;
    supabaseUrl = Constants.expoConfig?.extra?.supabaseUrl;
    supabaseAnonKey = Constants.expoConfig?.extra?.supabaseAnonKey;
  } catch (e) {
    // No estamos en Expo
  }
}

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("⚠️ Advertencia: Supabase URL o Anon Key no configurados. Usando placeholders.");
}

export const supabase = createClient(
  supabaseUrl || 'https://nwccwrqhljpdsgdgdqdd.supabase.co',
  supabaseAnonKey || 'placeholder-key'
);

