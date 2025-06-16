
import chroma from 'chroma-js';

export interface DominantColor {
  color: string;
  percentage: number;
  name: string;
}

export interface ColorSuggestion {
  name: string;
  colors: Record<string, string>;
  description: string;
  category: 'warm' | 'cool' | 'neutral' | 'vibrant';
}

export function analyzeImageColors(imageUrl: string): Promise<DominantColor[]> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          reject(new Error('No se pudo obtener el contexto del canvas'));
          return;
        }

        // Redimensionar para análisis más rápido pero mantener calidad
        const maxSize = 150;
        const ratio = Math.min(maxSize / img.width, maxSize / img.height);
        canvas.width = img.width * ratio;
        canvas.height = img.height * ratio;
        
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const colors = extractDominantColors(imageData);
        
        resolve(colors);
      } catch (error) {
        reject(error);
      }
    };
    
    img.onerror = () => reject(new Error('Error al cargar la imagen'));
    img.src = imageUrl;
  });
}

function extractDominantColors(imageData: ImageData): DominantColor[] {
  const colorMap = new Map<string, number>();
  const data = imageData.data;
  const totalPixels = data.length / 4;
  
  // Muestrear cada píxel (no saltar para mejor precisión)
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const a = data[i + 3];
    
    // Ignorar píxeles transparentes o muy transparentes
    if (a < 200) continue;
    
    // Ignorar colores muy oscuros (casi negros) y muy claros (casi blancos)
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    if (brightness < 30 || brightness > 240) continue;
    
    try {
      const color = chroma(r, g, b);
      
      // Agrupar colores similares usando clustering básico
      const hue = Math.round(color.get('hsl.h') / 10) * 10; // Agrupar en intervalos de 10°
      const sat = Math.round(color.get('hsl.s') * 10) / 10;
      const light = Math.round(color.get('hsl.l') * 10) / 10;
      
      // Solo considerar colores con saturación mínima
      if (sat < 0.2 && light > 0.3 && light < 0.7) {
        // Para grises, usar solo luminosidad
        const grayKey = `gray-${Math.round(light * 10)}`;
        colorMap.set(grayKey, (colorMap.get(grayKey) || 0) + 1);
      } else if (sat >= 0.2) {
        // Para colores saturados, usar HSL agrupado
        const colorKey = `${hue}-${sat}-${light}`;
        const representativeColor = chroma.hsl(hue, sat, light).hex();
        colorMap.set(representativeColor, (colorMap.get(representativeColor) || 0) + 1);
      }
    } catch (e) {
      // Ignorar colores inválidos
    }
  }
  
  // Convertir a array y ordenar por frecuencia
  const colorArray = Array.from(colorMap.entries())
    .map(([color, count]) => {
      let actualColor = color;
      if (color.startsWith('gray-')) {
        const lightness = parseFloat(color.split('-')[1]) / 10;
        actualColor = chroma.hsl(0, 0, lightness).hex();
      }
      
      return {
        color: actualColor,
        count,
        percentage: (count / totalPixels) * 100
      };
    })
    .sort((a, b) => b.count - a.count)
    .slice(0, 8); // Top 8 colores para más variedad
  
  // Filtrar colores con muy poca presencia (menos del 2%)
  const significantColors = colorArray.filter(item => item.percentage > 2);
  
  return significantColors.slice(0, 5).map(({ color, percentage }) => ({
    color,
    percentage,
    name: getColorName(color)
  }));
}

function getColorName(hex: string): string {
  try {
    const color = chroma(hex);
    const hue = color.get('hsl.h') || 0;
    const saturation = color.get('hsl.s');
    const lightness = color.get('hsl.l');
    
    if (saturation < 0.15) {
      if (lightness > 0.85) return 'Blanco';
      if (lightness < 0.15) return 'Negro';
      if (lightness > 0.65) return 'Gris claro';
      if (lightness < 0.35) return 'Gris oscuro';
      return 'Gris';
    }
    
    // Mejorar detección de colores
    if (hue >= 0 && hue < 15) return 'Rojo';
    if (hue >= 15 && hue < 45) return 'Naranja';
    if (hue >= 45 && hue < 75) return 'Amarillo';
    if (hue >= 75 && hue < 105) return 'Verde Lima';
    if (hue >= 105 && hue < 135) return 'Verde';
    if (hue >= 135 && hue < 165) return 'Verde Azulado';
    if (hue >= 165 && hue < 195) return 'Cian';
    if (hue >= 195 && hue < 225) return 'Azul Claro';
    if (hue >= 225 && hue < 255) return 'Azul';
    if (hue >= 255 && hue < 285) return 'Azul Violeta';
    if (hue >= 285 && hue < 315) return 'Púrpura';
    if (hue >= 315 && hue < 345) return 'Rosa';
    if (hue >= 345) return 'Rojo';
    
    return 'Color';
  } catch {
    return 'Desconocido';
  }
}

export function generateColorSuggestions(dominantColors: DominantColor[]): ColorSuggestion[] {
  const suggestions: ColorSuggestion[] = [];
  
  // Filtrar colores muy oscuros o muy claros antes de generar sugerencias
  const validColors = dominantColors.filter(({ color }) => {
    try {
      const chroma_color = chroma(color);
      const lightness = chroma_color.get('hsl.l');
      const saturation = chroma_color.get('hsl.s');
      return lightness > 0.15 && lightness < 0.85 && saturation > 0.1;
    } catch {
      return false;
    }
  });
  
  validColors.forEach(({ color }, index) => {
    if (suggestions.length >= 6) return; // Limitar a 6 sugerencias
    
    try {
      const baseColor = chroma(color);
      const hue = baseColor.get('hsl.h') || 0;
      const saturation = baseColor.get('hsl.s');
      const lightness = baseColor.get('hsl.l');
      
      // Asegurar que el color base tenga suficiente saturación
      const enhancedBase = chroma.hsl(
        hue,
        Math.max(saturation, 0.4), // Mínimo 40% de saturación
        Math.min(Math.max(lightness, 0.3), 0.7) // Entre 30% y 70% de luminosidad
      );
      
      // Paleta monocromática (variaciones del mismo color)
      if (index === 0) {
        suggestions.push({
          name: `Monocromática ${getColorName(color)}`,
          colors: generateColorScale(enhancedBase.hex()),
          description: `Variaciones elegantes de ${getColorName(color)}`,
          category: getCategoryFromColor(enhancedBase)
        });
      }
      
      // Paleta complementaria
      const complementHue = (hue + 180) % 360;
      const complementColor = chroma.hsl(complementHue, saturation, lightness);
      suggestions.push({
        name: `Complementaria ${getColorName(color)}`,
        colors: generateColorScale(complementColor.hex()),
        description: `Contraste perfecto con ${getColorName(color)}`,
        category: getCategoryFromColor(complementColor)
      });
      
      // Paleta análoga (solo para los primeros 2 colores)
      if (index < 2) {
        const analogousHue = (hue + 60) % 360;
        const analogousColor = chroma.hsl(analogousHue, saturation, lightness);
        suggestions.push({
          name: `Análoga ${getColorName(color)}`,
          colors: generateColorScale(analogousColor.hex()),
          description: `Armonía natural con ${getColorName(color)}`,
          category: getCategoryFromColor(analogousColor)
        });
      }
      
    } catch (e) {
      console.warn('Error generando sugerencia para color:', color, e);
    }
  });
  
  // Si no hay sugerencias válidas, crear paletas por defecto
  if (suggestions.length === 0) {
    const defaultColors = [
      { color: '#3B82F6', name: 'Azul Profesional' },
      { color: '#10B981', name: 'Verde Moderno' },
      { color: '#8B5CF6', name: 'Púrpura Elegante' }
    ];
    
    defaultColors.forEach(({ color, name }) => {
      suggestions.push({
        name: `${name}`,
        colors: generateColorScale(color),
        description: `Paleta ${name.toLowerCase()} para tu marca`,
        category: getCategoryFromColor(chroma(color))
      });
    });
  }
  
  return suggestions.slice(0, 4); // Máximo 4 sugerencias
}

function generateColorScale(baseColor: string): Record<string, string> {
  const base = chroma(baseColor);
  const levels = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950'];
  const palette: Record<string, string> = {};
  
  // Crear escala más balanceada
  const lightestColor = base.brighten(3).desaturate(0.3);
  const darkestColor = base.darken(3).saturate(0.2);
  
  const scale = chroma.scale([
    lightestColor.set('hsl.l', 0.95),
    lightestColor.set('hsl.l', 0.85),
    base.brighten(2),
    base.brighten(1),
    base.brighten(0.3),
    base, // 500 - color base
    base.darken(0.5),
    base.darken(1),
    base.darken(1.8),
    darkestColor.set('hsl.l', 0.15),
    darkestColor.set('hsl.l', 0.08)
  ]).mode('hsl');

  levels.forEach((level, index) => {
    const color = scale(index / (levels.length - 1));
    palette[level] = color.hex();
  });

  return palette;
}

function getCategoryFromColor(color: chroma.Color): 'warm' | 'cool' | 'neutral' | 'vibrant' {
  const hue = color.get('hsl.h') || 0;
  const saturation = color.get('hsl.s');
  
  if (saturation < 0.2) return 'neutral';
  if (saturation > 0.7) return 'vibrant';
  
  // Colores cálidos: rojos, naranjas, amarillos
  if ((hue >= 0 && hue < 60) || (hue >= 300 && hue <= 360)) return 'warm';
  
  // Colores fríos: azules, verdes, púrpuras
  if (hue >= 180 && hue < 300) return 'cool';
  
  // Resto pueden ser considerados neutros o cálidos dependiendo del matiz
  return hue < 180 ? 'warm' : 'cool';
}
