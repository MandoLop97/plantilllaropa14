
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useMobile } from '@/hooks/use-mobile';
import { 
  generateColorScale, 
  generateColorPresets, 
  getContrastRatio, 
  getTextColor, 
  convertColor,
  isValidColor 
} from '@/utils/colorUtils';
import { Palette, Save, RotateCcw, Eye, Copy, Check, Star, Droplets, Zap, Wand2 } from 'lucide-react';
import OptimizedColorPalettes from './OptimizedColorPalettes';

interface ColorPaletteCustomizerProps {
  currentPalette?: Record<string, Record<string, string>>;
  onSave: (colorType: 'primary' | 'secondary' | 'accent' | 'neutral', palette: Record<string, string>) => Promise<void>;
}

const colorTypes = [
  { value: 'primary', label: 'Primario', description: 'Color principal de la marca', icon: Star },
  { value: 'secondary', label: 'Secundario', description: 'Color de apoyo secundario', icon: Droplets },
  { value: 'accent', label: 'Acento', description: 'Color para destacar elementos', icon: Zap },
  { value: 'neutral', label: 'Neutral', description: 'Colores grises y neutros', icon: Palette }
] as const;

const algorithms = [
  { value: 'hsl', label: 'HSL (Estándar)', description: 'Generación basada en HSL' },
  { value: 'lab', label: 'LAB (Perceptual)', description: 'Mejor distribución perceptual' },
  { value: 'lch', label: 'LCH (Uniforme)', description: 'Luminosidad uniforme' }
] as const;

export default function ColorPaletteCustomizer({ currentPalette, onSave }: ColorPaletteCustomizerProps) {
  const { toast } = useToast();
  const isMobile = useMobile();
  const [selectedColorType, setSelectedColorType] = useState<'primary' | 'secondary' | 'accent' | 'neutral'>('primary');
  const [baseColor, setBaseColor] = useState('#3b82f6');
  const [palette, setPalette] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [copiedLevel, setCopiedLevel] = useState<string | null>(null);
  const [algorithm, setAlgorithm] = useState<'hsl' | 'lab' | 'lch'>('hsl');
  const [paletteSource, setPaletteSource] = useState<'optimized' | 'generated'>('optimized');

  const colorLevels = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950'];
  const presets = generateColorPresets();

  useEffect(() => {
    if (currentPalette && currentPalette[selectedColorType]) {
      setPalette(currentPalette[selectedColorType]);
      if (currentPalette[selectedColorType]['500']) {
        setBaseColor(currentPalette[selectedColorType]['500']);
      }
    } else {
      if (paletteSource === 'generated') {
        const defaultBaseColor = getDefaultColorForType(selectedColorType);
        const defaultPalette = generateColorScale(defaultBaseColor, algorithm);
        setPalette(defaultPalette);
        setBaseColor(defaultBaseColor);
      }
    }
  }, [selectedColorType, currentPalette, algorithm, paletteSource]);

  const getDefaultColorForType = (type: string) => {
    switch (type) {
      case 'primary': return '#3b82f6';
      case 'secondary': return '#64748b';
      case 'accent': return '#f59e0b';
      case 'neutral': return '#6b7280';
      default: return '#3b82f6';
    }
  };

  const handleBaseColorChange = (color: string) => {
    if (!isValidColor(color)) return;
    setBaseColor(color);
    const newPalette = generateColorScale(color, algorithm);
    setPalette(newPalette);
    setPaletteSource('generated');
  };

  const handlePresetSelect = (presetColor: string) => {
    handleBaseColorChange(presetColor);
  };

  const handleOptimizedPaletteSelect = (optimizedPalette: Record<string, string>) => {
    setPalette(optimizedPalette);
    if (optimizedPalette['500']) {
      setBaseColor(optimizedPalette['500']);
    }
    setPaletteSource('optimized');
    toast({
      title: "Paleta optimizada cargada",
      description: "Se ha cargado una paleta optimizada de la base de datos",
    });
  };

  const regeneratePalette = () => {
    const newPalette = generateColorScale(baseColor, algorithm);
    setPalette(newPalette);
    setPaletteSource('generated');
    toast({
      title: "Paleta regenerada",
      description: `Paleta regenerada usando algoritmo ${algorithms.find(a => a.value === algorithm)?.label}`,
    });
  };

  const copyColorToClipboard = async (color: string, level: string) => {
    try {
      const hexColor = convertColor(color, 'hex');
      await navigator.clipboard.writeText(hexColor);
      setCopiedLevel(level);
      setTimeout(() => setCopiedLevel(null), 2000);
      toast({
        title: "Color copiado",
        description: `${hexColor} copiado al portapapeles`,
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "No se pudo copiar el color",
        variant: "destructive",
      });
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const hslPalette: Record<string, string> = {};
      Object.entries(palette).forEach(([level, color]) => {
        hslPalette[level] = convertColor(color, 'hsl');
      });

      await onSave(selectedColorType, hslPalette);
      toast({
        title: "Paleta guardada",
        description: `La paleta ${colorTypes.find(t => t.value === selectedColorType)?.label} ha sido guardada en formato HSL.`,
      });
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : "No se pudo guardar la paleta de colores.";
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const selectedColorInfo = colorTypes.find(t => t.value === selectedColorType);
  const SelectedIcon = selectedColorInfo?.icon || Palette;

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border border-gray-200 w-full">
        <CardHeader className={`border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white ${isMobile ? 'p-3' : 'p-6'}`}>
          <CardTitle className="flex items-center gap-2 text-gray-900">
            <div className={`p-1.5 bg-white rounded-lg shadow-sm border ${isMobile ? 'p-1' : 'p-2'}`}>
              <Palette className={`text-gray-700 ${isMobile ? 'h-3 w-3' : 'h-5 w-5'}`} />
            </div>
            <div>
              <h3 className={`font-semibold ${isMobile ? 'text-base' : 'text-xl'}`}>Personalización de Colores</h3>
              {!isMobile && (
                <p className="text-sm text-gray-600 font-normal mt-1">
                  Crea paletas profesionales para tu marca (se guardan en formato HSL)
                </p>
              )}
            </div>
          </CardTitle>
        </CardHeader>
        
        <CardContent className={`space-y-4 ${isMobile ? 'p-3 pt-4' : 'pt-8 space-y-8'}`}>
          {/* Color Type Selector */}
          <div className="space-y-2">
            <Label className={`font-semibold text-gray-900 ${isMobile ? 'text-xs' : 'text-base'}`}>Tipo de Color</Label>
            <div className={`grid gap-1.5 ${isMobile ? 'grid-cols-2' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3'}`}>
              {colorTypes.map((type) => {
                const Icon = type.icon;
                return (
                  <button
                    key={type.value}
                    onClick={() => setSelectedColorType(type.value)}
                    className={`${isMobile ? 'p-2' : 'p-4'} rounded-xl border-2 transition-all duration-200 text-left group hover:shadow-md ${
                      selectedColorType === type.value
                        ? 'border-blue-500 bg-blue-50 shadow-sm'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    <div className={`flex items-center gap-2 ${isMobile ? 'mb-0' : 'gap-3 mb-2'}`}>
                      <div className={`${isMobile ? 'p-1' : 'p-2'} rounded-lg transition-colors ${
                        selectedColorType === type.value 
                          ? 'bg-blue-100 text-blue-600' 
                          : 'bg-gray-100 text-gray-600 group-hover:bg-gray-200'
                      }`}>
                        <Icon className={`${isMobile ? 'h-2.5 w-2.5' : 'h-4 w-4'}`} />
                      </div>
                      <span className={`font-medium text-gray-900 ${isMobile ? 'text-xs' : ''}`}>{type.label}</span>
                    </div>
                    {!isMobile && <p className="text-xs text-gray-600">{type.description}</p>}
                  </button>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Color Palette Display - Now shown first */}
      {Object.keys(palette).length > 0 && (
        <Card className="border border-gray-200 w-full">
          <CardHeader className={`border-b border-gray-200 ${isMobile ? 'p-3' : 'p-6'}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Label className={`font-semibold text-gray-900 ${isMobile ? 'text-xs' : 'text-base'}`}>
                  Paleta - {selectedColorInfo?.label} 
                  <span className="text-xs text-gray-500 ml-2">
                    ({paletteSource === 'optimized' ? 'Optimizada' : 'Generada'})
                  </span>
                </Label>
              </div>
              <div className="flex gap-1.5">
                {paletteSource === 'generated' && (
                  <Button
                    variant="outline"
                    size={isMobile ? "sm" : "sm"}
                    onClick={regeneratePalette}
                    className={isMobile ? 'text-xs px-2 h-8' : ''}
                  >
                    <RotateCcw className={`${isMobile ? 'h-2.5 w-2.5 mr-1' : 'h-4 w-4 mr-2'}`} />
                    {isMobile ? 'Regen' : 'Regenerar'}
                  </Button>
                )}
                <Button
                  variant="outline"
                  size={isMobile ? "sm" : "sm"}
                  onClick={() => setPreviewMode(!previewMode)}
                  className={isMobile ? 'text-xs px-2 h-8' : ''}
                >
                  <Eye className={`${isMobile ? 'h-2.5 w-2.5 mr-1' : 'h-4 w-4 mr-2'}`} />
                  {isMobile ? (previewMode ? 'Edit' : 'Vista') : (previewMode ? 'Editar' : 'Vista')}
                </Button>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className={`${isMobile ? 'p-2' : 'p-6'}`}>
            <div className={`bg-gray-50 rounded-xl ${isMobile ? 'p-2' : 'p-6 rounded-2xl'}`}>
              <div className={`grid gap-1.5 ${isMobile ? 'grid-cols-6' : 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-11 gap-3'}`}>
                {colorLevels.map((level) => {
                  const color = palette[level] || '#ffffff';
                  const textColor = getTextColor(color);
                  const contrastRatio = getContrastRatio(color, textColor);
                  
                  return (
                    <div key={level} className="space-y-1">
                      <div
                        className={`group relative aspect-square rounded-lg shadow-sm border border-gray-200 overflow-hidden cursor-pointer hover:shadow-md transition-all duration-200 hover:scale-105 ${isMobile ? 'rounded-md' : 'rounded-xl'}`}
                        style={{ backgroundColor: color }}
                        onClick={() => copyColorToClipboard(color, level)}
                      >
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-5 transition-all duration-200" />
                        
                        {/* Level indicator */}
                        <div className={`absolute ${isMobile ? 'top-0.5 left-0.5' : 'top-2 left-2'}`}>
                          <div 
                            className={`font-bold rounded-md ${isMobile ? 'text-xs px-1 py-0.5' : 'text-xs px-2 py-1'}`}
                            style={{ 
                              color: textColor,
                              backgroundColor: `rgba(${textColor === '#ffffff' ? '0,0,0' : '255,255,255'}, 0.2)`
                            }}
                          >
                            {level}
                          </div>
                        </div>
                        
                        {/* Copy feedback */}
                        {copiedLevel === level && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20">
                            <div className="bg-white rounded-full p-0.5">
                              <Check className={`text-green-600 ${isMobile ? 'h-2.5 w-2.5' : 'h-4 w-4'}`} />
                            </div>
                          </div>
                        )}
                        
                        {/* Accessibility indicator */}
                        {contrastRatio >= 4.5 && (
                          <div className={`absolute ${isMobile ? 'bottom-0.5 right-0.5' : 'bottom-2 right-2'}`}>
                            <div className={`bg-green-500 rounded-full border-2 border-white ${isMobile ? 'w-1.5 h-1.5' : 'w-3 h-3'}`}></div>
                          </div>
                        )}
                      </div>
                      
                      {/* Color value */}
                      {!isMobile && (
                        <div className="text-center">
                          <div className="text-xs font-mono text-gray-600 truncate">
                            {convertColor(color, 'hex')}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tabs para seleccionar fuente de paleta */}
      <Tabs value={paletteSource} onValueChange={(value) => setPaletteSource(value as 'optimized' | 'generated')} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="optimized" className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            {isMobile ? 'Optimizadas' : 'Paletas Optimizadas'}
          </TabsTrigger>
          <TabsTrigger value="generated" className="flex items-center gap-2">
            <Wand2 className="h-4 w-4" />
            {isMobile ? 'Generar' : 'Generar Paleta'}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="optimized" className="mt-6">
          <OptimizedColorPalettes 
            onPaletteSelect={handleOptimizedPaletteSelect}
            selectedPalette={paletteSource === 'optimized' ? palette : undefined}
          />
        </TabsContent>
        
        <TabsContent value="generated" className="mt-6">
          <Card className="border border-gray-200 w-full">
            <CardHeader className={`border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white ${isMobile ? 'p-3' : 'p-6'}`}>
              <CardTitle className="flex items-center gap-2 text-gray-900">
                <div className={`p-1.5 bg-white rounded-lg shadow-sm border ${isMobile ? 'p-1' : 'p-2'}`}>
                  <Wand2 className={`text-gray-700 ${isMobile ? 'h-3 w-3' : 'h-5 w-5'}`} />
                </div>
                <div>
                  <h3 className={`font-semibold ${isMobile ? 'text-base' : 'text-xl'}`}>Generar Paleta Personalizada</h3>
                  {!isMobile && (
                    <p className="text-sm text-gray-600 font-normal mt-1">
                      Crea una paleta única desde un color base
                    </p>
                  )}
                </div>
              </CardTitle>
            </CardHeader>
            
            <CardContent className={`space-y-4 ${isMobile ? 'p-3 pt-4' : 'pt-8 space-y-8'}`}>
              {/* Color Presets */}
              <div className="space-y-2">
                <Label className={`font-semibold text-gray-900 ${isMobile ? 'text-xs' : 'text-base'}`}>Colores Base Populares</Label>
                <div className={`grid gap-1.5 ${isMobile ? 'grid-cols-8' : 'grid-cols-4 sm:grid-cols-6 lg:grid-cols-12 gap-3'}`}>
                  {presets.map((preset) => (
                    <button
                      key={preset.name}
                      onClick={() => handlePresetSelect(preset.color)}
                      className={`group relative aspect-square rounded-lg border-2 border-gray-200 overflow-hidden hover:border-gray-300 transition-all duration-200 hover:scale-105 ${isMobile ? 'rounded-md' : 'rounded-xl'}`}
                      style={{ backgroundColor: preset.color }}
                      title={`${preset.name} - ${preset.description}`}
                    >
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-200" />
                      {baseColor.toLowerCase() === preset.color.toLowerCase() && paletteSource === 'generated' && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="bg-white bg-opacity-90 backdrop-blur-sm rounded-full p-0.5">
                            <Check className={`text-green-600 ${isMobile ? 'h-2 w-2' : 'h-3 w-3'}`} />
                          </div>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Base Color & Algorithm */}
              <div className={`grid gap-3 ${isMobile ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-2 gap-6'}`}>
                <div className="space-y-2">
                  <Label className={`font-semibold text-gray-900 ${isMobile ? 'text-xs' : 'text-base'}`}>Color Base (HEX)</Label>
                  <div className={`flex gap-2 items-center ${isMobile ? 'gap-1.5' : 'gap-3'}`}>
                    <Input
                      type="text"
                      value={baseColor}
                      onChange={(e) => handleBaseColorChange(e.target.value)}
                      className={`flex-1 font-mono border-2 ${isMobile ? 'h-10 text-sm' : 'h-16 text-lg'}`}
                      placeholder="#3b82f6"
                      style={{ 
                        borderColor: baseColor,
                        backgroundColor: `${baseColor}15`
                      }}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label className={`font-semibold text-gray-900 ${isMobile ? 'text-xs' : 'text-base'}`}>Algoritmo</Label>
                  <Select value={algorithm} onValueChange={(value: 'hsl' | 'lab' | 'lch') => setAlgorithm(value)}>
                    <SelectTrigger className={`${isMobile ? 'h-10' : 'h-16'}`}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {algorithms.map((alg) => (
                        <SelectItem key={alg.value} value={alg.value}>
                          <div className="flex flex-col">
                            <span className="font-medium">{alg.label}</span>
                            {!isMobile && <span className="text-xs text-gray-500">{alg.description}</span>}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Actions */}
      {Object.keys(palette).length > 0 && (
        <Card className="border border-gray-200">
          <CardContent className={`flex justify-end gap-2 pt-3 ${isMobile ? 'p-3' : 'p-6'}`}>
            <Button 
              onClick={handleSave} 
              disabled={loading}
              className={`flex items-center gap-2 ${isMobile ? 'text-xs h-8' : ''}`}
              size={isMobile ? "sm" : "default"}
            >
              <Save className={`${isMobile ? 'h-2.5 w-2.5' : 'h-4 w-4'}`} />
              {loading ? (isMobile ? 'Guardando...' : 'Guardando en HSL...') : (isMobile ? 'Guardar' : 'Guardar Paleta (HSL)')}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
