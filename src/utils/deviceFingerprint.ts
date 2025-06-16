
/**
 * Genera un fingerprint único del dispositivo basado en características del navegador
 */
export const generateDeviceFingerprint = (): string => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  // Información básica del dispositivo
  const screen = `${window.screen.width}x${window.screen.height}x${window.screen.colorDepth}`;
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const language = navigator.language;
  const platform = navigator.platform;
  const userAgent = navigator.userAgent;
  
  // Generar canvas fingerprint
  let canvasFingerprint = '';
  if (ctx) {
    ctx.textBaseline = 'top';
    ctx.font = '14px Arial';
    ctx.fillText('Device fingerprint canvas', 2, 2);
    canvasFingerprint = canvas.toDataURL();
  }
  
  // Combinar todas las características
  const fingerprint = [
    screen,
    timezone,
    language,
    platform,
    userAgent.slice(0, 100), // Limitar longitud del user agent
    canvasFingerprint.slice(0, 50) // Limitar longitud del canvas
  ].join('|');
  
  // Generar hash simple
  let hash = 0;
  for (let i = 0; i < fingerprint.length; i++) {
    const char = fingerprint.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convertir a 32-bit integer
  }
  
  return Math.abs(hash).toString(36);
};

/**
 * Obtiene la dirección IP del cliente (aproximada)
 */
export const getClientIP = async (): Promise<string | null> => {
  try {
    // En producción, esto debería obtener la IP real del servidor
    // Por ahora, usamos un placeholder
    return 'unknown';
  } catch (error) {
    console.warn('Could not get client IP:', error);
    return null;
  }
};
