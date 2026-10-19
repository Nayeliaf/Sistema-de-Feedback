# Aeropostal — Demo de sistema de feedback

Demo frontend en HTML, CSS y JavaScript puro para probar un flujo de feedback de agencias de viaje y viajeros frecuentes.

## Cómo abrir
1. Descomprime `aeropostal-feedback-demo.zip`.
2. Abre `index.html` en Chrome, Edge o Firefox. No requiere instalación ni servidor.
3. Para obtener la experiencia completa, permite JavaScript en el navegador. Se recomienda conexión a internet para cargar la fotografía de fondo y las fuentes web; el resto de la interfaz funciona localmente.

## Acceso de empresa (demo)
- Las opciones **Opiniones recibidas** y **Panel de análisis** quedan ocultas a los participantes.
- Usa el botón **Acceso empresa** en la parte superior para abrir el inicio de sesión.
- Contraseña de prueba: `Aero2026!`.
- Puedes cerrar la sesión desde **Cerrar sesión**.
- Esta barrera solo oculta/protege la interfaz del navegador: una persona técnica puede inspeccionar el código y los datos locales. No usar datos reales ni considerar esto una protección de producción.

## Funcionalidades incluidas
- Página de bienvenida con identidad visual y acceso por tipo de participante.
- Formulario en tres pasos con validación básica.
- Calificación por estrellas, áreas de mejora y prioridad Alta/Media/Baja.
- Panel con métricas, distribución por perfil, barras por área y tendencia mensual.
- Búsqueda, filtros, vista de detalle y eliminación de registros.
- Exportación de registros a CSV.
- Datos de ejemplo y persistencia con `localStorage`.

## Importante: alcance de la demo
- Los registros se guardan solo en el navegador actual. No se envían a Aeropostal ni a un servidor.
- La contraseña de empresa es solo una simulación de acceso del lado del cliente. Los datos se siguen guardando localmente en este navegador; no hay separación de seguridad real ni sincronización multiusuario.
- Los datos de ejemplo son ficticios.
- Para producción se recomienda backend con base de datos, autenticación y roles (participante/administrador), HTTPS, validación del lado del servidor, protección contra abuso, política de privacidad y consentimiento revisado, y controles de acceso al panel.
- La fotografía del hero y las fuentes se cargan desde servicios externos; puedes sustituir la URL de la fotografía en `styles.css` por una imagen institucional autorizada.

## Archivos
- `index.html`: estructura y pantallas.
- `styles.css`: diseño responsive y estilos.
- `app.js`: navegación, validación, datos, panel y exportación.
- `assets/aeropostal-logo.jpg`: logo suministrado.


## Para una versión real con acceso seguro
La empresa necesitará autenticación validada en servidor, roles y permisos del lado del servidor, base de datos centralizada, HTTPS y controles para que las cuentas de agencias/viajeros solo puedan crear y consultar los datos que les correspondan. El panel de administración debe requerir una sesión autenticada en backend; ocultar botones o usar una contraseña en JavaScript no protege los datos.
