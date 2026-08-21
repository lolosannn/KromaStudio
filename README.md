# Kroma Studio — Landing Page

Landing page para un estudio de arquitectura, en modo oscuro, construida con HTML5, CSS3 (animaciones con `transform`/`opacity`) y JavaScript vanilla.

## Estructura

```
index.html        Marcado semántico de toda la landing
css/style.css      Estilos, variables de diseño y animaciones
js/main.js         Interacciones: nav, scroll reveal, animación del hero, contador, formulario
```

## Cómo verlo localmente

No requiere build ni dependencias:

```bash
python3 -m http.server 8000
# abrir http://localhost:8000
```

## Personalización rápida

- **Colores**: variables `--bg`, `--accent`, `--accent-light` en `css/style.css`.
- **Imágenes**: reemplaza las URLs de Unsplash en `index.html` por tus renders reales.
- **WhatsApp**: cambia el número en el `href="https://wa.me/..."` del botón flotante (`index.html`).
- **Formulario de contacto**: actualmente simula el envío en `js/main.js`. Conéctalo a un backend real o a un servicio como Formspree / EmailJS para recibir los leads.
