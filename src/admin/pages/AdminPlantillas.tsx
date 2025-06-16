
import MinimalAdminLayout from "@/admin/components/MinimalAdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { FileText, Save, Copy } from "lucide-react";

export default function AdminPlantillas() {
  const { toast } = useToast();
  
  const handleSave = () => {
    toast({
      title: "Funcionalidad en desarrollo",
      description: "La gestión de plantillas estará disponible próximamente.",
    });
  };
  
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copiado al portapapeles",
      description: "La plantilla ha sido copiada a tu portapapeles.",
    });
  };
  
  return (
    <MinimalAdminLayout>
      <div className="space-y-6 p-4 md:p-6 max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-1">
              <h1 className="text-2xl md:text-3xl font-bold text-foreground flex items-center gap-3">
                <FileText className="h-6 w-6 md:h-7 md:w-7" />
                Plantillas de Mensajes
              </h1>
              <p className="text-sm md:text-base text-muted-foreground">
                Personaliza los mensajes automáticos que se envían a tus clientes.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="px-3 py-1">
                2 plantillas
              </Badge>
            </div>
          </div>
        </div>
        
        {/* Templates Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="border-border/50 hover:shadow-lg transition-all duration-200">
            <CardHeader className="border-b border-border/50">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <CardTitle className="text-foreground">Confirmación de Cita</CardTitle>
                  <CardDescription>
                    Se envía cuando un cliente reserva una cita
                  </CardDescription>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleCopy(`Hola {{cliente}},

Tu cita ha sido confirmada para el {{fecha}} a las {{hora}}.

Servicio: {{servicio}}
Duración: {{duracion}}

Si necesitas cancelar o modificar tu cita, por favor contáctanos.

Saludos,
{{negocio}}`)}
                  className="hover:bg-muted"
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copiar
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="asunto1" className="text-sm font-medium">Asunto</Label>
                  <Input 
                    id="asunto1" 
                    defaultValue="Confirmación de tu cita en {{negocio}}"
                    className="bg-background border-border/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="mensaje1" className="text-sm font-medium">Mensaje</Label>
                  <Textarea 
                    id="mensaje1" 
                    rows={8}
                    className="font-mono text-sm bg-background border-border/50"
                    defaultValue={`Hola {{cliente}},\n\nTu cita ha sido confirmada para el {{fecha}} a las {{hora}}.\n\nServicio: {{servicio}}\nDuración: {{duracion}}\n\nSi necesitas cancelar o modificar tu cita, por favor contáctanos.\n\nSaludos,\n{{negocio}}`}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="bg-muted/30 border-t border-border/50 px-6 py-4">
              <Button 
                onClick={handleSave} 
                className="gap-2"
              >
                <Save className="h-4 w-4" />
                Guardar plantilla
              </Button>
            </CardFooter>
          </Card>
          
          <Card className="border-border/50 hover:shadow-lg transition-all duration-200">
            <CardHeader className="border-b border-border/50">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <CardTitle className="text-foreground">Recordatorio de Cita</CardTitle>
                  <CardDescription>
                    Se envía un día antes de la cita programada
                  </CardDescription>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleCopy(`Hola {{cliente}},

Te recordamos que tienes una cita mañana {{fecha}} a las {{hora}}.

Servicio: {{servicio}}

Te esperamos.

Saludos,
{{negocio}}`)}
                  className="hover:bg-muted"
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copiar
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="asunto2" className="text-sm font-medium">Asunto</Label>
                  <Input 
                    id="asunto2" 
                    defaultValue="Recordatorio: Tu cita mañana en {{negocio}}"
                    className="bg-background border-border/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="mensaje2" className="text-sm font-medium">Mensaje</Label>
                  <Textarea 
                    id="mensaje2" 
                    rows={8}
                    className="font-mono text-sm bg-background border-border/50"
                    defaultValue={`Hola {{cliente}},\n\nTe recordamos que tienes una cita mañana {{fecha}} a las {{hora}}.\n\nServicio: {{servicio}}\n\nTe esperamos.\n\nSaludos,\n{{negocio}}`}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="bg-muted/30 border-t border-border/50 px-6 py-4">
              <Button 
                onClick={handleSave} 
                className="gap-2"
              >
                <Save className="h-4 w-4" />
                Guardar plantilla
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </MinimalAdminLayout>
  );
}
