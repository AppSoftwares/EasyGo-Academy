# EasyGo Academy Pro - Sistema Unificado
/* Creado por Jesús Pirela */

Este proyecto fusiona la robustez de una academia tradicional con la tecnología moderna de IA y movilidad multiplataforma.

## Arquitectura
- **Core:** Lógica de negocio pura (Clean Architecture).
- **Mobile:** Expo SDK 54 (Android / iOS).
- **Web:** React + TypeScript (Dashboard Administrativo).
- **Backend:** Supabase (PostgreSQL + RLS + Auth).

## Requisitos Previos
1. Node.js (LTS)
2. Expo CLI (`npm install -g expo-cli`)
3. EAS CLI (`npm install -g eas-cli`)
4. Cuenta en Supabase.com

## Configuración Inicial

### 1. Backend (Supabase)
- Crea un nuevo proyecto en Supabase.
- Copia el contenido de `supabase/migrations/20240101000000_init_schema.sql` y ejecútalo en el SQL Editor de Supabase.
- Habilita Google Auth o Email Auth en la sección de Authentication.

### 2. Móvil (Expo)
```bash
cd apps/mobile
npm install
# Para Android (Windows + Android Studio)
npx expo run:android
```

### 3. iOS sin Mac (Windows)
Este proyecto está configurado para compilación remota:
1. Crea una cuenta en [expo.dev](https://expo.dev).
2. Ejecuta `eas build --platform ios`.
3. Expo compilará el `.ipa` en sus servidores y te dará un link de descarga o lo enviará a TestFlight.

## Seguridad y Reglas
- **RLS:** Activado en todas las tablas. Ningún usuario puede ver datos de otro.
- **Sanitización:** Todo input es procesado por `InputSanitizer` antes de guardarse.
- **UTC:** Todos los tiempos se guardan en UTC y se transforman en la UI.
- **Branding:** Logos vectoriales y paddings de seguridad de 16dp obligatorios.

## Estructura de Ingeniería (Actualizada)
- **Consistencia:** Proyecto migrado a TypeScript (`.tsx`) para mayor seguridad.
- **Enrutamiento:** Centralizado en `src/App.tsx` usando `react-router-dom`.
- **Híbrido:** `SupabaseClient` optimizado para funcionar tanto en entorno Web (Vite) como Mobile (Expo).
- **Seguridad:** API Keys removidas de `app.json` y movidas a gestión por variables de entorno.

## Requisitos Previos
1. Node.js (LTS)
2. pnpm (Recomendado) o npm.
3. Expo CLI (`npm install -g expo-cli`)
4. EAS CLI (`npm install -g eas-cli`)

---
**Ingeniería y Arquitectura:** Jesús Pirela
**Versión:** 1.0.0
