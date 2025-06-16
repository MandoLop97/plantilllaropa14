import { useState, useEffect, useMemo, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useOptimizedColors, OptimizedColorPalette } from '@/hooks/useOptimizedColors';
import { useNegocioActivo } from '@/hooks/useNegocioActivo';
import { useAuth } from '@/hooks/use-auth';
import { 
  Palette, 
  Check, 
  ChevronLeft, 
  ChevronRight, 
  Search, 
  Filter,
  Sparkles,
  Eye,
  Star
} from 'lucide-react';
import { useMobile } from '@/hooks/use-mobile';
import { analyzeImageColors, generateColorSuggestions, ColorSuggestion } from '@/utils/imageColorAnalysis';
import { useToast } from '@/hooks/use-toast';
import { generatePaletteName } from '@/utils/paletteNames';

// Types
interface OptimizedColorPalettesProps {
  onPaletteSelect: (palette: Record<string, string>) => void;
  selectedPalette?: Record<string, string>;
}

interface Category {
  value: string;
  label: string;
  icon: typeof Palette;
}

// Constants
const CATEGORIES: Category[] = [
  { value: 'all', label: 'Todas', icon: Palette },
  { value: 'warm', label: 'Cálidos', icon: Star },
  { value: 'cool', label: 'Fríos', icon: Eye },
  { value: 'neutral', label: 'Neutros', icon: Filter },
  { value: 'vibrant', label: 'Vibrantes', icon: Sparkles }
];

const RESPONSIVE_CONFIG = {
  mobile: {
    palettesPerPage: 8,
    gridCols: 'grid-cols-2',
    cardPadding: 'p-3',
    headerPadding: 'p-3',
    textSizes: {
      title: 'text-base',
      subtitle: 'text-xs',
      body: 'text-sm',
      small: 'text-xs'
    },
    heights: {
      button: 'h-7',
      palette: 'h-8',
      icon: 'h-3 w-3'
    }
  },
  desktop: {
    palettesPerPage: 20,
    gridCols: 'grid-cols-3 sm:grid-cols-4 lg:grid-cols-5',
    cardPadding: 'p-4',
    headerPadding: 'p-4',
    textSizes: {
      title: 'text-lg',
      subtitle: 'text-sm',
      body: 'text-base',
      small: 'text-sm'
    },
    heights: {
      button: 'h-auto',
      palette: 'h-10',
      icon: 'h-4 w-4'
    }
  }
};

// Utility functions
const categorizeColor = (color: string, category: string): boolean => {
  if (!color || category === 'all') return true;
  
  try {
    const hue = parseInt(color.replace('#', ''), 16);
    const r = (hue >> 16) & 255;
    const g = (hue >> 8) & 255;
    const b = hue & 255;
    
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const saturation = max === 0 ? 0 : (max - min) / max;
    
    switch (category) {
      case 'neutral': return saturation < 0.2;
      case 'vibrant': return saturation > 0.7;
      case 'warm': return r > g && r > b;
      case 'cool': return b > r || g > r;
      default: return false;
    }
  } catch {
    return false;
  }
};

// Subcomponents
const LoadingState = ({ isMobile }: { isMobile: boolean }) => {
  const config = isMobile ? RESPONSIVE_CONFIG.mobile : RESPONSIVE_CONFIG.desktop;
  
  return (
    <Card className="border border-gray-200">
      <CardContent className={config.cardPadding}>
        <div className="text-center py-8">
          <div className="w-6 h-6 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin mx-auto mb-3"></div>
          <p className={`text-gray-600 ${config.textSizes.body}`}>
            Cargando paletas...
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

const ErrorState = ({ error, isMobile }: { error: string; isMobile: boolean }) => {
  const config = isMobile ? RESPONSIVE_CONFIG.mobile : RESPONSIVE_CONFIG.desktop;
  
  return (
    <Card className="border border-red-200">
      <CardContent className={config.cardPadding}>
        <div className="text-center py-6">
          <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-3">
            <Palette className="h-5 w-5 text-red-600" />
          </div>
          <p className="text-red-600 font-medium">Error al cargar paletas</p>
          <p className={`text-red-500 mt-1 ${config.textSizes.small}`}>{error}</p>
        </div>
      </CardContent>
    </Card>
  );
};

const BrandSuggestions = ({ 
  suggestions, 
  onSuggestionClick, 
  onClose, 
  analyzingImages, 
  isMobile 
}: {
  suggestions: ColorSuggestion[];
  onSuggestionClick: (suggestion: ColorSuggestion) => void;
  onClose: () => void;
  analyzingImages: boolean;
  isMobile: boolean;
}) => {
  const config = isMobile ? RESPONSIVE_CONFIG.mobile : RESPONSIVE_CONFIG.desktop;
  
  return (
    <Card className="border border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50">
      <CardHeader className={`border-b border-blue-200 ${config.headerPadding}`}>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-blue-900">
            <div className={`p-1.5 bg-blue-100 rounded-lg ${isMobile ? 'p-1' : ''}`}>
              <Sparkles className={`text-blue-600 ${config.heights.icon}`} />
            </div>
            <div>
              <h3 className={`font-semibold ${config.textSizes.title}`}>
                Sugerencias para tu Marca
              </h3>
              <p className={`text-blue-700 font-normal mt-0.5 ${config.textSizes.subtitle}`}>
                Basadas en tu logo y banner
              </p>
            </div>
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-blue-600 hover:text-blue-800 h-6 w-6 p-0"
          >
            ✕
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className={config.cardPadding}>
        <div className={`grid gap-2 ${isMobile ? 'grid-cols-1' : 'grid-cols-2'}`}>
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => onSuggestionClick(suggestion)}
              className={`group relative rounded-lg border-2 border-blue-200 bg-white overflow-hidden transition-all duration-200 hover:scale-[1.02] hover:shadow-md hover:border-blue-300 ${isMobile ? 'p-2' : 'p-3'}`}
            >
              <div className="flex items-center gap-3">
                <div className={`grid grid-cols-5 ${isMobile ? 'w-10 h-5' : 'w-14 h-7'} rounded overflow-hidden shadow-sm`}>
                  {['100', '300', '500', '700', '900'].map((level, i) => (
                    <div
                      key={i}
                      className="transition-all duration-200"
                      style={{ backgroundColor: suggestion.colors[level] }}
                    />
                  ))}
                </div>
                <div className="flex-1 text-left">
                  <h4 className={`font-medium text-gray-900 ${config.textSizes.small}`}>
                    {suggestion.name}
                  </h4>
                  <p className={`text-gray-600 ${config.textSizes.small}`}>
                    {suggestion.description}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
        
        {analyzingImages && (
          <div className="flex items-center justify-center py-3 border-t border-blue-200 mt-3">
            <div className="flex items-center gap-2 text-blue-600">
              <div className="w-3 h-3 border-2 border-blue-300 border-t-blue-600 rounded-full animate-spin"></div>
              <span className={config.textSizes.small}>Analizando imágenes...</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const CategoryFilters = ({ 
  selectedCategory, 
  onCategoryChange, 
  isMobile 
}: {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  isMobile: boolean;
}) => {
  const config = isMobile ? RESPONSIVE_CONFIG.mobile : RESPONSIVE_CONFIG.desktop;
  
  return (
    <div className={`flex gap-1 overflow-x-auto ${isMobile ? 'pb-2' : ''}`}>
      {CATEGORIES.map((category) => {
        const Icon = category.icon;
        const isSelected = selectedCategory === category.value;
        return (
          <Button
            key={category.value}
            variant={isSelected ? "default" : "outline"}
            size={isMobile ? "sm" : "sm"}
            onClick={() => onCategoryChange(category.value)}
            className={`flex items-center gap-1.5 whitespace-nowrap ${isMobile ? 'text-xs h-7 px-2' : 'text-sm'}`}
          >
            <Icon className={config.heights.icon} />
            {category.label}
          </Button>
        );
      })}
    </div>
  );
};

const PaletteGrid = ({ 
  palettes, 
  onPaletteClick, 
  selectedPalette, 
  formatColorPalette, 
  getPreviewColors, 
  isMobile 
}: {
  palettes: OptimizedColorPalette[];
  onPaletteClick: (palette: OptimizedColorPalette) => void;
  selectedPalette?: Record<string, string>;
  formatColorPalette: (palette: OptimizedColorPalette) => Record<string, string>;
  getPreviewColors: (palette: OptimizedColorPalette) => string[];
  isMobile: boolean;
}) => {
  const config = isMobile ? RESPONSIVE_CONFIG.mobile : RESPONSIVE_CONFIG.desktop;
  
  const isPaletteSelected = useCallback((palette: Record<string, string>) => {
    if (!selectedPalette) return false;
    const levels = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950'];
    return levels.every(level => selectedPalette[level] === palette[level]);
  }, [selectedPalette]);

  if (palettes.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-3">
          <Filter className="h-5 w-5 text-gray-400" />
        </div>
        <p className="text-gray-600 font-medium">No se encontraron paletas</p>
        <p className={`text-gray-500 mt-1 ${config.textSizes.small}`}>
          Intenta cambiar los filtros o el término de búsqueda
        </p>
      </div>
    );
  }

  return (
    <div className={`grid gap-3 ${config.gridCols}`}>
      {palettes.map((optimizedPalette) => {
        const formattedPalette = formatColorPalette(optimizedPalette);
        const previewColors = getPreviewColors(optimizedPalette);
        const isSelected = isPaletteSelected(formattedPalette);
        const paletteName = generatePaletteName(formattedPalette);

        return (
          <button
            key={optimizedPalette.id}
            onClick={() => onPaletteClick(optimizedPalette)}
            className={`group relative rounded-lg border-2 overflow-hidden transition-all duration-200 hover:scale-105 hover:shadow-lg ${
              isSelected 
                ? 'border-blue-500 shadow-lg ring-2 ring-blue-200' 
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className={`grid grid-cols-5 ${config.heights.palette}`}>
              {previewColors.map((color, index) => (
                <div
                  key={index}
                  className="transition-all duration-200"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
            
            <div className={`px-2 py-1 bg-white border-t border-gray-100 ${isMobile ? 'py-0.5' : ''}`}>
              <p className={`text-gray-700 font-medium truncate ${config.textSizes.small}`}>
                {paletteName}
              </p>
            </div>
            
            {isSelected && (
              <div className="absolute inset-0 bg-black bg-opacity-10 flex items-center justify-center">
                <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-full p-1">
                  <Check className={`text-blue-600 ${isMobile ? 'h-2.5 w-2.5' : 'h-3 w-3'}`} />
                </div>
              </div>
            )}
            
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-5 transition-all duration-200" />
          </button>
        );
      })}
    </div>
  );
};

const PaginationControls = ({ 
  currentPage, 
  totalPages, 
  onPageChange, 
  totalItems, 
  isMobile 
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems: number;
  isMobile: boolean;
}) => {
  const config = isMobile ? RESPONSIVE_CONFIG.mobile : RESPONSIVE_CONFIG.desktop;
  
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
      <Button
        variant="outline"
        size={isMobile ? "sm" : "default"}
        onClick={() => onPageChange(Math.max(0, currentPage - 1))}
        disabled={currentPage === 0}
        className={`flex items-center gap-2 ${isMobile ? 'text-xs h-7 px-2' : ''}`}
      >
        <ChevronLeft className={config.heights.icon} />
        {!isMobile && 'Anterior'}
      </Button>
      
      <div className="flex items-center gap-2">
        <span className={`text-gray-600 ${config.textSizes.small}`}>
          {currentPage + 1} de {totalPages}
        </span>
        <Badge variant="secondary" className={isMobile ? 'text-xs h-5' : 'text-sm'}>
          {totalItems}
        </Badge>
      </div>
      
      <Button
        variant="outline"
        size={isMobile ? "sm" : "default"}
        onClick={() => onPageChange(Math.min(totalPages - 1, currentPage + 1))}
        disabled={currentPage === totalPages - 1}
        className={`flex items-center gap-2 ${isMobile ? 'text-xs h-7 px-2' : ''}`}
      >
        {!isMobile && 'Siguiente'}
        <ChevronRight className={config.heights.icon} />
      </Button>
    </div>
  );
};

// Main component
export default function OptimizedColorPalettes({ onPaletteSelect, selectedPalette }: OptimizedColorPalettesProps) {
  const isMobile = useMobile();
  const { toast } = useToast();
  const { user } = useAuth();
  const { negocioActivo } = useNegocioActivo(user?.id || null);
  const { palettes, loading, error, formatColorPalette, getPreviewColors } = useOptimizedColors();
  
  // State
  const [currentPage, setCurrentPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [suggestions, setSuggestions] = useState<ColorSuggestion[]>([]);
  const [analyzingImages, setAnalyzingImages] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  
  // Configuration
  const config = isMobile ? RESPONSIVE_CONFIG.mobile : RESPONSIVE_CONFIG.desktop;
  
  // Filtered palettes with memoization
  const filteredPalettes = useMemo(() => {
    return palettes.filter(palette => {
      const paletteName = generatePaletteName(formatColorPalette(palette));
      const matchesSearch = searchTerm === '' || 
        palette.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        paletteName.toLowerCase().includes(searchTerm.toLowerCase());
      
      return matchesSearch && categorizeColor(palette['500'], selectedCategory);
    });
  }, [palettes, searchTerm, selectedCategory, formatColorPalette]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredPalettes.length / config.palettesPerPage);
  const currentPalettes = useMemo(() => {
    return filteredPalettes.slice(
      currentPage * config.palettesPerPage,
      (currentPage + 1) * config.palettesPerPage
    );
  }, [filteredPalettes, currentPage, config.palettesPerPage]);

  // Effects
  useEffect(() => {
    setCurrentPage(0);
  }, [searchTerm, selectedCategory]);

  useEffect(() => {
    if (negocioActivo?.logo_url || negocioActivo?.banner_url) {
      analyzeBrandImages();
    }
  }, [negocioActivo]);

  // Handlers
  const analyzeBrandImages = useCallback(async () => {
    if (!negocioActivo) return;
    
    setAnalyzingImages(true);
    try {
      const imagesToAnalyze = [
        negocioActivo.logo_url,
        negocioActivo.banner_url
      ].filter(Boolean);

      if (imagesToAnalyze.length === 0) return;

      const allDominantColors = [];
      
      for (const imageUrl of imagesToAnalyze) {
        try {
          const colors = await analyzeImageColors(imageUrl!);
          allDominantColors.push(...colors);
        } catch (error) {
          console.warn('Error analizando imagen:', imageUrl, error);
        }
      }

      if (allDominantColors.length > 0) {
        const colorSuggestions = generateColorSuggestions(allDominantColors);
        setSuggestions(colorSuggestions);
        
        if (colorSuggestions.length > 0) {
          toast({
            title: "🎨 Sugerencias listas",
            description: `Se generaron ${colorSuggestions.length} paletas basadas en tu marca`,
          });
        }
      }
    } catch (error) {
      console.error('Error en análisis de imágenes:', error);
    } finally {
      setAnalyzingImages(false);
    }
  }, [negocioActivo, toast]);

  const handlePaletteClick = useCallback((optimizedPalette: OptimizedColorPalette) => {
    const formattedPalette = formatColorPalette(optimizedPalette);
    onPaletteSelect(formattedPalette);
  }, [formatColorPalette, onPaletteSelect]);

  const handleSuggestionClick = useCallback((suggestion: ColorSuggestion) => {
    onPaletteSelect(suggestion.colors);
    toast({
      title: "Paleta aplicada",
      description: `Se aplicó la paleta "${suggestion.name}"`,
    });
  }, [onPaletteSelect, toast]);

  // Render states
  if (loading) return <LoadingState isMobile={isMobile} />;
  if (error) return <ErrorState error={error} isMobile={isMobile} />;

  return (
    <div className="space-y-4">
      {/* Main palette panel */}
      <Card className="border border-gray-200">
        <CardHeader className={`border-b border-gray-200 ${config.headerPadding}`}>
          <CardTitle className="flex items-center gap-2 text-gray-900">
            <div className={`p-1.5 bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg shadow-sm border ${isMobile ? 'p-1' : ''}`}>
              <Palette className={`text-purple-600 ${config.heights.icon}`} />
            </div>
            <div>
              <h3 className={`font-semibold ${config.textSizes.title}`}>
                Paletas Optimizadas
              </h3>
              <p className={`text-gray-600 font-normal mt-0.5 ${config.textSizes.subtitle}`}>
                {filteredPalettes.length} paletas disponibles
              </p>
            </div>
          </CardTitle>
        </CardHeader>
        
        <CardContent className={`space-y-4 ${config.cardPadding}`}>
          {/* Search and filters */}
          <div className={`space-y-3 ${isMobile ? '' : 'flex gap-4 space-y-0'}`}>
            <div className="flex-1">
              <div className="relative">
                <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 ${config.heights.icon}`} />
                <Input
                  placeholder="Buscar paleta..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`pl-10 ${isMobile ? 'h-8 text-sm' : ''}`}
                />
              </div>
            </div>
            
            <CategoryFilters
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              isMobile={isMobile}
            />
          </div>

          {/* Palette grid */}
          <PaletteGrid
            palettes={currentPalettes}
            onPaletteClick={handlePaletteClick}
            selectedPalette={selectedPalette}
            formatColorPalette={formatColorPalette}
            getPreviewColors={getPreviewColors}
            isMobile={isMobile}
          />

          {/* Pagination controls */}
          <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            totalItems={filteredPalettes.length}
            isMobile={isMobile}
          />
        </CardContent>
      </Card>
      
      {/* Brand suggestions */}
      {suggestions.length > 0 && showSuggestions && (
        <BrandSuggestions
          suggestions={suggestions}
          onSuggestionClick={handleSuggestionClick}
          onClose={() => setShowSuggestions(false)}
          analyzingImages={analyzingImages}
          isMobile={isMobile}
        />
      )}
    </div>
  );
}