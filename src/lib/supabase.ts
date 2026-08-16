import { createClient } from "@supabase/supabase-js";

// Configuración de Supabase - reemplaza con tus credenciales
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://TU-PROYECTO.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "TU-ANON-KEY";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);