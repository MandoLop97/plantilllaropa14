# Bienvenido a tu proyecto en Lovable

## Información del proyecto

**URL**: [https://lovable.dev/projects/7b428b88-db08-44e9-a68c-6136204de0bb](https://lovable.dev/projects/7b428b88-db08-44e9-a68c-6136204de0bb)

Consulta [TEMPLATE.md](TEMPLATE.md) para ver los pasos detallados de personalización.

## ¿Cómo puedo editar este código?

Hay varias formas de editar tu aplicación.

**Usar Lovable**

Simplemente visita el [Proyecto en Lovable](https://lovable.dev/projects/7b428b88-db08-44e9-a68c-6136204de0bb) y comienza a escribir instrucciones (prompts).

Los cambios hechos a través de Lovable se guardarán automáticamente en este repositorio.

**Usar tu IDE favorito**

Si prefieres trabajar localmente con tu propio editor, puedes clonar este repositorio y subir los cambios. Los cambios subidos también se reflejarán en Lovable.

El único requisito es tener instalado Node.js y npm — [instálalo con nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Sigue estos pasos:

```sh
# Paso 1: Clona el repositorio usando la URL del proyecto.
git clone <TU_URL_DEL_REPO>

# Paso 2: Entra al directorio del proyecto.
cd <NOMBRE_DE_TU_PROYECTO>

# Paso 3: Instala las dependencias necesarias.
npm i

# Paso 4: Inicia el servidor de desarrollo con recarga automática y vista previa.
npm run dev
```

**Editar un archivo directamente en GitHub**

* Navega hasta el archivo que desees modificar.
* Haz clic en el botón "Editar" (ícono de lápiz) en la parte superior derecha.
* Realiza tus cambios y haz un commit.

**Usar GitHub Codespaces**

* Ve a la página principal del repositorio.
* Haz clic en el botón verde "Code" en la parte superior derecha.
* Selecciona la pestaña "Codespaces".
* Haz clic en "New codespace" para iniciar un nuevo entorno.
* Edita los archivos directamente en Codespace y luego haz commit y push de tus cambios.

---

## ¿Qué tecnologías se usan en este proyecto?

Este proyecto está construido con:

* Vite
* TypeScript
* React
* shadcn-ui
* Tailwind CSS

---

## ¿Cómo puedo desplegar este proyecto?

Simplemente abre [Lovable](https://lovable.dev/projects/7b428b88-db08-44e9-a68c-6136204de0bb) y haz clic en **Share → Publish**.

---

## ¿Puedo conectar un dominio personalizado a mi proyecto en Lovable?

¡Sí, puedes hacerlo!

Para conectar un dominio, ve a **Project > Settings > Domains** y haz clic en **Connect Domain**.

Lee más aquí: [Configuración de dominio personalizado](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)

---

## Configuración de Supabase

Copia el archivo `.env.example` a `.env` y proporciona tus credenciales de Supabase:

```sh
cp .env.example .env
# edita el archivo .env y completa las claves necesarias
```

La aplicación lee las variables `VITE_SUPABASE_URL`,
`VITE_SUPABASE_ANON_KEY` y `VITE_SUPABASE_PROJECT_ID` desde ese archivo.
Estos valores son utilizados por `src/config/environment.ts` y consumidos por el cliente Supabase en `src/api/supabase/client.ts`.

El archivo `supabase/config.toml` deja vacío el `project_id`. Puedes configurarlo mediante la variable de entorno `SUPABASE_PROJECT_ID` al usar Supabase CLI o rellenarlo directamente en el archivo.

---

## Configurar categorías

El archivo `src/data/categories.ts` exporta por defecto un arreglo vacío. Durante el desarrollo puedes llenarlo localmente con tus propias categorías. Si prefieres administrar las categorías en Supabase, créalas en tu base de datos y usa las herramientas de sincronización de datos para traerlas al proyecto.

---

## Cambiar tipografías con el sistema de temas

La aplicación expone dos variables CSS, `--font-primary` y `--font-secondary`, que controlan las fuentes por defecto de la interfaz. Estas variables se actualizan cada vez que se llama a `applyTheme` desde `src/config/theme.ts`.

Para sobrescribir las fuentes, proporciona una sección `fonts` al llamar `applyTheme` o `useThemeConfig`:

```ts
applyTheme({
  fonts: {
    primary: 'Roboto, sans-serif',
    secondary: 'Lora, serif'
  }
});
```

Cualquier componente que utilice `var(--font-primary)` o `var(--font-secondary)` reflejará automáticamente el cambio.

---

## Personalización dinámica del diseño

El proyecto también puede cargar configuraciones de tema desde Supabase. Agrega tus colores y fuentes a la tabla `personalizacion`, y la aplicación los aplicará al iniciar. Los siguientes campos son utilizados:

* `color_primario` – color principal de marca
* `color_secundario` – color de acento secundario
* `fuente` – familia tipográfica base
* `modo_oscuro` – activar modo oscuro por defecto

Cuando estos valores están presentes, `useBusinessTheme` los aplica internamente llamando a `applyTheme`.
