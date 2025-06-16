
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Paintbrush, Palette } from "lucide-react";

interface PersonalizationOptions {
  logo_position: 'center' | 'left' | 'right';
  profile_shape: 'circle' | 'square' | 'rounded-square';
  button_shape: 'rectangular' | 'rounded';
  background_type: 'solid' | 'gradient' | 'pattern-lines' | 'pattern-dots';
  background_color: string;
  primary_color: string;
  secondary_color: string;
  tertiary_color: string;
}

interface PersonalizationCardProps {
  values: PersonalizationOptions;
  onChange: (key: keyof PersonalizationOptions, value: string) => void;
}

export default function PersonalizationCard({ values, onChange }: PersonalizationCardProps) {
  const backgroundOptions = [
    { id: 'solid', name: 'Color Sólido', preview: 'bg-blue-500' },
    { id: 'gradient', name: 'Degradado', preview: 'bg-gradient-to-r from-blue-500 to-purple-500' },
    { id: 'pattern-lines', name: 'Líneas', preview: 'bg-gradient-to-r from-gray-100 to-gray-200' },
    { id: 'pattern-dots', name: 'Puntos', preview: 'bg-gray-100' },
  ];

  const colorPresets = [
    { name: 'Azul Clásico', primary: '#3B82F6', secondary: '#60A5FA', tertiary: '#93C5FD' },
    { name: 'Verde Natural', primary: '#10B981', secondary: '#34D399', tertiary: '#6EE7B7' },
    { name: 'Morado Elegante', primary: '#8B5CF6', secondary: '#A78BFA', tertiary: '#C4B5FD' },
    { name: 'Naranja Vibrante', primary: '#F97316', secondary: '#FB923C', tertiary: '#FDBA74' },
    { name: 'Rosa Moderno', primary: '#EC4899', secondary: '#F472B6', tertiary: '#F9A8D4' },
  ];

  return (
    <Card className="bg-gradient-to-b from-card to-background/60 rounded-2xl shadow-xl overflow-hidden border-none">
      <CardHeader className="bg-primary/5 border-b border-primary/10">
        <CardTitle className="flex items-center gap-2 text-xl">
          <Paintbrush className="h-5 w-5 text-primary" />
          <span>Personalización</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-8 p-6">
        
        {/* Posición del Logo */}
        <div className="space-y-4">
          <Label className="text-base font-medium">Posición del Logo</Label>
          <RadioGroup 
            value={values.logo_position} 
            onValueChange={(value) => onChange('logo_position', value)}
            className="grid grid-cols-3 gap-4"
          >
            {[
              { value: 'left', label: 'Izquierda', preview: 'justify-start' },
              { value: 'center', label: 'Centrada', preview: 'justify-center' },
              { value: 'right', label: 'Derecha', preview: 'justify-end' }
            ].map((option) => (
              <div key={option.value} className="space-y-2">
                <div className={`flex ${option.preview} p-3 border rounded-lg bg-muted/20`}>
                  <div className="w-6 h-6 bg-primary rounded"></div>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value} id={option.value} />
                  <Label htmlFor={option.value} className="text-sm">{option.label}</Label>
                </div>
              </div>
            ))}
          </RadioGroup>
        </div>

        {/* Forma del Perfil */}
        <div className="space-y-4">
          <Label className="text-base font-medium">Forma de la Foto de Perfil</Label>
          <RadioGroup 
            value={values.profile_shape} 
            onValueChange={(value) => onChange('profile_shape', value)}
            className="grid grid-cols-3 gap-4"
          >
            {[
              { value: 'circle', label: 'Circular', class: 'rounded-full' },
              { value: 'square', label: 'Cuadrada', class: 'rounded-none' },
              { value: 'rounded-square', label: 'Esquinas Redondeadas', class: 'rounded-lg' }
            ].map((option) => (
              <div key={option.value} className="space-y-2">
                <div className="flex justify-center p-3 border rounded-lg bg-muted/20">
                  <div className={`w-8 h-8 bg-primary ${option.class}`}></div>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value} id={option.value} />
                  <Label htmlFor={option.value} className="text-sm">{option.label}</Label>
                </div>
              </div>
            ))}
          </RadioGroup>
        </div>

        {/* Forma de los Botones */}
        <div className="space-y-4">
          <Label className="text-base font-medium">Forma de los Botones</Label>
          <RadioGroup 
            value={values.button_shape} 
            onValueChange={(value) => onChange('button_shape', value)}
            className="grid grid-cols-2 gap-4"
          >
            {[
              { value: 'rectangular', label: 'Rectangulares', class: 'rounded-none' },
              { value: 'rounded', label: 'Esquinas Redondeadas', class: 'rounded-md' }
            ].map((option) => (
              <div key={option.value} className="space-y-2">
                <div className="flex justify-center p-3 border rounded-lg bg-muted/20">
                  <div className={`px-4 py-2 bg-primary text-white text-xs ${option.class}`}>
                    Botón
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value} id={option.value} />
                  <Label htmlFor={option.value} className="text-sm">{option.label}</Label>
                </div>
              </div>
            ))}
          </RadioGroup>
        </div>

        {/* Fondo del Sitio */}
        <div className="space-y-4">
          <Label className="text-base font-medium">Fondo del Sitio Web</Label>
          <div className="grid grid-cols-2 gap-3">
            {backgroundOptions.map((bg) => (
              <Button
                key={bg.id}
                type="button"
                variant={values.background_type === bg.id ? "default" : "outline"}
                onClick={() => onChange('background_type', bg.id)}
                className="flex flex-col h-20 p-2"
              >
                <div className={`w-full h-8 ${bg.preview} rounded mb-1`}></div>
                <span className="text-xs">{bg.name}</span>
              </Button>
            ))}
          </div>
        </div>

        {/* Colores Principales */}
        <div className="space-y-4">
          <Label className="text-base font-medium flex items-center gap-2">
            <Palette className="h-4 w-4" />
            Colores Principales del Sitio
          </Label>
          
          {/* Paletas Predefinidas */}
          <div className="grid grid-cols-1 gap-3">
            {colorPresets.map((preset) => (
              <Button
                key={preset.name}
                type="button"
                variant="outline"
                onClick={() => {
                  onChange('primary_color', preset.primary);
                  onChange('secondary_color', preset.secondary);
                  onChange('tertiary_color', preset.tertiary);
                }}
                className="flex items-center justify-between p-3 h-auto"
              >
                <span className="text-sm font-medium">{preset.name}</span>
                <div className="flex gap-1">
                  <div className="w-6 h-6 rounded" style={{ backgroundColor: preset.primary }}></div>
                  <div className="w-6 h-6 rounded" style={{ backgroundColor: preset.secondary }}></div>
                  <div className="w-6 h-6 rounded" style={{ backgroundColor: preset.tertiary }}></div>
                </div>
              </Button>
            ))}
          </div>

          {/* Colores Actuales */}
          <div className="grid grid-cols-3 gap-4 pt-4 border-t">
            <div className="space-y-2">
              <Label className="text-sm">Primario</Label>
              <div className="flex items-center gap-2">
                <div 
                  className="w-8 h-8 rounded border" 
                  style={{ backgroundColor: values.primary_color }}
                ></div>
                <input
                  type="color"
                  value={values.primary_color}
                  onChange={(e) => onChange('primary_color', e.target.value)}
                  className="w-8 h-8 rounded border cursor-pointer"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-sm">Secundario</Label>
              <div className="flex items-center gap-2">
                <div 
                  className="w-8 h-8 rounded border" 
                  style={{ backgroundColor: values.secondary_color }}
                ></div>
                <input
                  type="color"
                  value={values.secondary_color}
                  onChange={(e) => onChange('secondary_color', e.target.value)}
                  className="w-8 h-8 rounded border cursor-pointer"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-sm">Terciario</Label>
              <div className="flex items-center gap-2">
                <div 
                  className="w-8 h-8 rounded border" 
                  style={{ backgroundColor: values.tertiary_color }}
                ></div>
                <input
                  type="color"
                  value={values.tertiary_color}
                  onChange={(e) => onChange('tertiary_color', e.target.value)}
                  className="w-8 h-8 rounded border cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>

      </CardContent>
    </Card>
  );
}
