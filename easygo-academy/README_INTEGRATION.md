# Integración rápida - EasyGo Academy

Este documento explica cómo integrar y probar los ejemplos añadidos:

## Stripe (backend)
1. Asegúrate de tener `STRIPE_SECRET_KEY` en tus variables de entorno.
2. Instala la dependencia en la carpeta correspondiente (root o `easygo-academy`):

```bash
npm install stripe
```

3. El servidor principal ya intenta montar las rutas en `/payments` usando el ejemplo en `easygo-academy/server/payments/stripe_example.js`.
4. Para crear una sesión de pago desde el frontend, haz POST a `POST /payments/create-checkout-session` con JSON `{ priceId, successUrl, cancelUrl }`.

## Android - Vocabulario (ejemplo)
- Activity: `com.easygoacademy.ui.VocabListActivity` (archivo: `android/app/src/.../VocabListActivity.kt`)
- Adapter: `VocabAdapter.kt` y layouts `activity_vocab_list.xml`, `item_vocab.xml`.
- Requisitos: ya existe `AppDatabase` en `com.easygoacademy.data`.

Pasos para probar localmente en Android Studio:
1. Importa el proyecto `easygo-academy/android` en Android Studio.
2. Sincroniza Gradle y añade las dependencias de Kotlin coroutines y lifecycle si no existen:

```gradle
implementation 'androidx.lifecycle:lifecycle-runtime-ktx:2.6.1'
implementation 'org.jetbrains.kotlinx:kotlinx-coroutines-android:1.7.3'
implementation 'androidx.recyclerview:recyclerview:1.3.1'
```

3. Ejecuta la app en un emulador o dispositivo y abre `VocabListActivity`.

## Qué contiene este PR local
- Rutas Stripe ejemplo: `easygo-academy/server/payments/stripe_example.js` y montaje en `server.ts`.
- Ejemplo Android: Activity + Adapter + layouts para listar vocabulario desde `AppDatabase`.
- Documentación: `easygo-academy/README_INTEGRATION.md` y `easygo-academy/docs/good_practices.md`.

## Crear PR (sugerencia de comandos)

```bash
git checkout -b feat/integration-examples
git add .
git commit -m "Add integration examples: Stripe, Android vocab UI, docs"
git push origin feat/integration-examples
# Luego abrir PR en GitHub/GitLab como de costumbre.
```
