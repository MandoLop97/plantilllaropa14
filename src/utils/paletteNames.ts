
export function generatePaletteName(palette: Record<string, string>): string {
  try {
    const baseColor = palette['500'];
    if (!baseColor) return 'Paleta';
    
    // Convert hex to HSL to determine color characteristics
    const hex = baseColor.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16) / 255;
    const g = parseInt(hex.substr(2, 2), 16) / 255;
    const b = parseInt(hex.substr(4, 2), 16) / 255;
    
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const diff = max - min;
    
    // Calculate hue
    let hue = 0;
    if (diff !== 0) {
      if (max === r) {
        hue = 60 * (((g - b) / diff) % 6);
      } else if (max === g) {
        hue = 60 * ((b - r) / diff + 2);
      } else {
        hue = 60 * ((r - g) / diff + 4);
      }
    }
    
    if (hue < 0) hue += 360;
    
    // Calculate saturation
    const saturation = max === 0 ? 0 : diff / max;
    
    // Calculate lightness
    const lightness = (max + min) / 2;
    
    // Generate subtle names based on color properties
    if (saturation < 0.2) {
      if (lightness > 0.7) return 'Humo';
      if (lightness < 0.3) return 'Carbón';
      return 'Gris';
    }
    
    // Color-based names (subtle and short)
    if (hue >= 0 && hue < 20) return 'Coral';
    if (hue >= 20 && hue < 40) return 'Arena';
    if (hue >= 40 && hue < 70) return 'Miel';
    if (hue >= 70 && hue < 100) return 'Hierba';
    if (hue >= 100 && hue < 140) return 'Bosque';
    if (hue >= 140 && hue < 180) return 'Jade';
    if (hue >= 180 && hue < 220) return 'Cielo';
    if (hue >= 220 && hue < 260) return 'Océano';
    if (hue >= 260 && hue < 300) return 'Violeta';
    if (hue >= 300 && hue < 330) return 'Rosa';
    if (hue >= 330) return 'Cereza';
    
    return 'Paleta';
  } catch {
    return 'Paleta';
  }
}
