# RALI React/Vite + Netlify + Supabase

Proyecto listo para publicar en Netlify.

## Qué incluye
- Web pública con diseño comercial
- Catálogo con carrusel automático por producto
- Botón de cotizar por WhatsApp por producto
- Panel de administración compatible con Netlify
- Login administrador
- Cambio de contraseña
- Edición de productos, galerías y datos del negocio
- Modo demo con localStorage
- Modo producción con Supabase

## 1. Instalar
```bash
npm install
npm run dev
```

## 2. Configurar Supabase
Crea un archivo `.env` a partir de `.env.example` y llena:
```bash
VITE_SUPABASE_URL=tu_url
VITE_SUPABASE_ANON_KEY=tu_anon_key
```

## 3. Crear tablas en Supabase
Ejecuta el contenido de `supabase/schema.sql` en el editor SQL de Supabase.

## 4. Crear usuario admin
En Supabase Auth crea el usuario administrador con correo y contraseña.

## 5. Subir a Netlify
- Sube este proyecto a GitHub
- En Netlify importa el repo
- Build command: `npm run build`
- Publish directory: `dist`
- En Site configuration > Environment variables agrega:
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_ANON_KEY`

## 6. Modo demo
Si no configuras Supabase, el proyecto funciona en modo demo con localStorage.

## Rutas
- `/` inicio
- `/quienes-somos`
- `/catalogo`
- `/contacto`
- `/admin/login`
- `/admin`
