# Estructura de `tema_config.configuracion`

La tabla `tema_config` en Supabase almacena un objeto JSON en el campo `configuracion`.
Dicho objeto sigue el esquema definido por `ThemeConfigSchema` y describe colores,
tipografías y otros ajustes que se aplican a la interfaz.

Los bloques principales son:

- `colors`
  - `light`: pares `clave: valor` con variables CSS para modo claro. Cada clave se
    convierte directamente en `--color-<clave>`.
  - `dark`: pares para modo oscuro. Se transforman en variables `--color-<clave>-dark` y
    se insertan dentro de la regla `.dark { ... }`.
  - `customPalette`: paletas completas compatibles con Tailwind, por ejemplo
    `primary`, `secondary`, etc., donde cada tono ("50", "500"...) se convierte en
    `--color-<nombre>-<tono>`. Cada paleta debe incluir al menos los tonos `500`
    y `600` para ser válida.
  - `typography`
    - `fontFamily`: objeto con fuentes para `primary`, `secondary` o `mono`.
- `spacing`, `borderRadius`, `shadows`, `buttons`: ajustes opcionales que se
  trasladan a variables CSS del mismo nombre.

A continuación se muestra un ejemplo simplificado:

```json
{
  "colors": {
    "light": {
      "primary-500": "#0ea5e9",
      "neutral-50": "#f8fafc"
    },
    "dark": {
      "primary-500": "#0284c7",
      "neutral-50": "#18181b"
    },
    "customPalette": {
      "primary": { "50": "#f0f9ff", "500": "#0ea5e9", "600": "#0284c7" },
      "secondary": { "50": "#fff7ed", "500": "#f97316", "600": "#ea580c" }
    }
  },
  "typography": {
    "fontFamily": {
      "primary": "Inter, sans-serif",
      "secondary": "Poppins, sans-serif",
      "mono": "Menlo, monospace"
    }
  }
}
```

Cuando `useTemaConfig` recupera este JSON, llama internamente a
`applyThemeFromJson` para convertir cada valor en variables CSS. De esta forma la
interfaz adopta de inmediato la paleta y tipografía definidas en Supabase.

Si alguna paleta de `customPalette` no incluye todos los tonos estándar de
Tailwind (`50`, `100`, ..., `950`), la función completará los faltantes copiando
el tono definido más cercano o, de no existir ninguno, aplicará `#000000` por
defecto. Cada tono agregado se registra en la consola para facilitar la
depuración.
