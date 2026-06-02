# Buenas prácticas - EasyGo Academy

Este documento resume recomendaciones para la app Android y backend.

## Room (offline)
- Usa `Room` con `Flow`/`LiveData` para observabilidad.
- Implementa una única instancia `Room` (singleton) y migraciones.
- Guarda timestamps en UTC (`System.currentTimeMillis()` o Instant) y almacena la zona del usuario por identificador (`America/New_York`).
- Coloca índices en columnas usadas en búsquedas (p.ej. `word`).

## Lottie (animaciones)
- Añade la dependencia `implementation 'com.airbnb.android:lottie:5.0.3'`.
- Usa animaciones ligeras y versionadas; minifica JSON antes de subir.
- Reproduce en loop solo cuando esté visible; pausa en `onPause()`.

## CameraX (escáner)
- Usa `PreviewView` y `ImageAnalysis` para inferencia on-device.
- Mantén overlays ligeros; no dibujes en cada frame sin throttling.

## Accesibilidad
- Todos los textos escalables en `sp`.
- Áreas táctiles min 48dp.
- Colores con contraste suficiente (AA mínimo) y soporte para modo oscuro.

## Timezones y Fechas
- Guardar todo en UTC; almacenar zona del usuario (IANA) en su perfil.
- Convertir a la zona local solo en la capa de presentación.

## Pagos y seguridad
- Usa Stripe (global) y MercadoPago (LATAM). Nunca guardes tarjetas en tu servidor.
- Implementa webhooks para confirmar pagos y auditar eventos.
- 2FA para cuentas admin y registro de auditoría para cambios críticos.

## Performance
- Indexa campos de búsqueda; paginación en endpoints largos.
- Evita consultas sincronas en el hilo UI; usa coroutines/Dispatchers.IO.

## Logs y Auditoría
- Guarda eventos importantes (suscripciones, cambios roles, reembolsos).
- Asegura retención y acceso restringido a logs.
