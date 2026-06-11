<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/d242c809-67ac-4d0a-8f09-dbb632117230

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Pruebas móviles y construcción de Android/iOS

1. Instala dependencias:
   `npm install`
2. Construye la app web:
   `npm run build`
3. Sincroniza Capacitor:
   `npm run cap:sync`
4. Agrega Android e iOS una sola vez:
   `npm run cap:add:android`
   `npm run cap:add:ios`
5. Abre el proyecto móvil:
   `npm run cap:open:android`
   `npm run cap:open:ios`

> Para pruebas desde un teléfono en la misma red, ejecuta el servidor con host accesible:
> `npm run dev:host`
> Luego abre `http://<IP-del-PC>:3000` desde el navegador del teléfono.

## Variables de entorno y seguridad

- El archivo `.env` local debe contener solo valores secretos y nunca debe subirse al repositorio.
- Para Supabase en el cliente, usa `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY`.
- No expongas `service_role` ni claves de administrador en el código del cliente.
- Para el backend, usa variables del servidor que no lleguen al navegador.
