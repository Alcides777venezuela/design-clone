import { createClient } from "@supabase/supabase-js";

// Configuración de Supabase - reemplaza con tus credenciales
const supabaseUrl = "https://vmliftgrxsluxdfvsfap.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZtbGlmdGdyeHNsdXhkZnZzZmFwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY5MTQ0ODgsImV4cCI6MjEwMjQ5MDQ4OH0.512po6XaK-7-CVV5jXcFtPk5s-isOpaAUF_S66NpJqA";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);