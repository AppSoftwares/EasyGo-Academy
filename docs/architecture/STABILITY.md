# Estándares de Estabilidad y Seguridad - EasyGo Academy

/* Creado por Jesús Pirela */

Para asegurar una academia moderna y confiable, seguimos estos 3 pilares:

## 1. Validación en la Puerta (Input Safety)
Nunca confiar en el usuario. Todo dato que entre a Supabase debe pasar por el `InputSanitizer`.
- **Regla:** Longitud máxima 254 chars para textos, validación estricta de regex para emails.

## 2. Fallback de IA (Resiliencia)
Si Gemini API o Google TTS fallan (por cuotas o red):
- El sistema debe tener un mensaje predefinido o usar el `SpeechSynthesis` nativo del navegador/celular como respaldo.

## 3. Row Level Security (RLS) Infalible
La base de datos es la última línea de defensa.
- **Prohibido:** Hacer SELECT sin un filtro de `auth.uid()`.
- **Obligatorio:** Cada nueva tabla en Supabase debe tener `ALTER TABLE ... ENABLE ROW LEVEL SECURITY;`.

## 4. Estructura de Repositorio (Clean Arch)
- **Entities:** Lógica de negocio pura (no depende de librerías).
- **UseCases:** Qué hace la app (ej: `EnrollStudent`).
- **Infrastructure:** Cómo se comunica (Supabase, Firebase, API).
