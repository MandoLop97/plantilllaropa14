
import chroma from 'chroma-js';

export function generateColorScale(baseColor: string, algorithm: 'hsl' | 'lab' | 'lch' = 'hsl'): Record<string, string> {
  const base = chroma(baseColor);
  
  let scale;
  
  switch (algorithm) {
    case 'lab':
      scale = chroma.scale([
        base.brighten(3.5).set('lab.l', Math.min(base.get('lab.l') + 40, 95)),
        base.brighten(3),
        base.brighten(2.5),
        base.brighten(1.5),
        base.brighten(0.8),
        base,
        base.darken(0.5),
        base.darken(1),
        base.darken(1.5),
        base.darken(2),
        base.darken(2.8).set('lab.l', Math.max(base.get('lab.l') - 50, 5))
      ]).mode('lab');
      break;
    case 'lch':
      scale = chroma.scale([
        base.brighten(3.5).set('lch.l', Math.min(base.get('lch.l') + 40, 95)),
        base.brighten(3),
        base.brighten(2.5),
        base.brighten(1.5),
        base.brighten(0.8),
        base,
        base.darken(0.5),
        base.darken(1),
        base.darken(1.5),
        base.darken(2),
        base.darken(2.8).set('lch.l', Math.max(base.get('lch.l') - 50, 5))
      ]).mode('lch');
      break;
    default:
      scale = chroma.scale([
        base.brighten(3.5).set('hsl.s', Math.min(base.get('hsl.s'), 0.3)),
        base.brighten(3),
        base.brighten(2.5),
        base.brighten(1.5),
        base.brighten(0.8),
        base,
        base.darken(0.5),
        base.darken(1),
        base.darken(1.5),
        base.darken(2),
        base.darken(2.8)
      ]).mode('hsl');
  }

  const levels = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950'];
  const palette: Record<string, string> = {};

  levels.forEach((level, index) => {
    const color = scale(index / (levels.length - 1));
    palette[level] = color.hex();
  });

  return palette;
}

export function generateColorPresets(): Array<{ name: string; color: string; description: string }> {
  return [
    { name: 'Azul', color: '#3b82f6', description: 'Azul profesional' },
    { name: 'Indigo', color: '#6366f1', description: 'Indigo moderno' },
    { name: 'Púrpura', color: '#8b5cf6', description: 'Púrpura elegante' },
    { name: 'Rosa', color: '#ec4899', description: 'Rosa vibrante' },
    { name: 'Rojo', color: '#ef4444', description: 'Rojo intenso' },
    { name: 'Naranja', color: '#f97316', description: 'Naranja energético' },
    { name: 'Amarillo', color: '#eab308', description: 'Amarillo brillante' },
    { name: 'Verde', color: '#22c55e', description: 'Verde natural' },
    { name: 'Esmeralda', color: '#10b981', description: 'Verde esmeralda' },
    { name: 'Teal', color: '#14b8a6', description: 'Teal profesional' },
    { name: 'Cian', color: '#06b6d4', description: 'Cian fresco' },
    { name: 'Gris', color: '#6b7280', description: 'Gris neutro' }
  ];
}

export function getContrastRatio(color1: string, color2: string): number {
  const c1 = chroma(color1);
  const c2 = chroma(color2);
  return chroma.contrast(c1, c2);
}

export function getTextColor(backgroundColor: string): string {
  const color = chroma(backgroundColor);
  const whiteContrast = chroma.contrast(color, 'white');
  const blackContrast = chroma.contrast(color, 'black');
  return whiteContrast > blackContrast ? '#ffffff' : '#000000';
}

export function isValidColor(color: string): boolean {
  try {
    chroma(color);
    return true;
  } catch {
    return false;
  }
}

export function convertColor(color: string, format: 'hex' | 'hsl' | 'rgb'): string {
  const c = chroma(color);
  switch (format) {
    case 'hex':
      return c.hex();
    case 'hsl': {
      const [h, s, l] = c.hsl();
      return `hsl(${Math.round(h || 0)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
    }
    case 'rgb': {
      const [r, g, b] = c.rgb();
      return `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`;
    }
    default:
      return c.hex();
  }
}

export function hslToObject(hslString: string): { h: number; s: number; l: number } {
  const match = hslString.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/);
  if (!match) return { h: 0, s: 0, l: 0 };
  
  return {
    h: parseInt(match[1]),
    s: parseInt(match[2]),
    l: parseInt(match[3])
  };
}

export function objectToHsl(obj: { h: number; s: number; l: number }): string {
  return `hsl(${obj.h}, ${obj.s}%, ${obj.l}%)`;
}
