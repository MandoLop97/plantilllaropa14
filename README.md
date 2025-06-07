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

# Paso 4: Ejecuta ESLint para verificar la configuración inicial y los plugins.
npm run lint

# Paso 5: Inicia el servidor de desarrollo con recarga automática y vista previa.
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

## ¿Cómo puedo ejecutar las pruebas?

Para correr las pruebas automatizadas, ejecuta:

```sh
npm test
```

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
`VITE_SUPABASE_ANON_KEY`, `VITE_SUPABASE_PROJECT_ID` y `VITE_BUSINESS_ID` desde ese archivo.
Estos valores son utilizados por `src/config/environment.ts` y consumidos por el cliente Supabase en `src/api/supabase/client.ts`.

El archivo `supabase/config.toml` deja vacío el `project_id`. Puedes configurarlo mediante la variable de entorno `SUPABASE_PROJECT_ID` al usar Supabase CLI o rellenarlo directamente en el archivo.

---

## Configurar categorías

El archivo `src/data/categories.ts` incluye ahora un conjunto de categorías de ejemplo que se utilizan como respaldo si no hay datos en Supabase. Puedes modificarlas libremente o, si prefieres administrarlas desde tu base de datos, simplemente elimina o reemplaza este arreglo y sincroniza los datos con Supabase.

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

La aplicación obtiene su apariencia desde la tabla `tema_config` en Supabase. El campo `configuracion` almacena un JSON con todos los colores, tipografías y ajustes visuales necesarios. Al iniciar, `useTemaConfig` recupera este objeto y ejecuta `applyThemeFromJson`, actualizando las variables CSS en tiempo real. La forma recomendada de exponer tu aplicación es envolviéndola con `ThemeConfigProvider`, así todos los componentes pueden acceder a `ThemeConfigContext`. Consulta [docs/tema_config.md](docs/tema_config.md) para ver la estructura completa y un ejemplo práctico.

Si la consulta a Supabase falla se aplican los valores definidos en `src/index.css` y `DEFAULT_THEME`. Estos colores y fuentes sirven como configuración de respaldo.
