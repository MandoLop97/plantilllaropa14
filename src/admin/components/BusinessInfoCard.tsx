
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import PhoneInput from "@/components/PhoneInput";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import SupabaseImageUpload from "./SupabaseImageUpload";

interface FormValues {
  nombre: string;
  descripcion: string;
  direccion: string;
  telefono: string;
  email: string;
  logo_url: string;
  banner_url: string;
  logo_position: string;
  profile_shape: string;
  button_shape: string;
  background_type: string;
  background_color: string;
  primary_color: string;
  secondary_color: string;
  tertiary_color: string;
}

interface BusinessInfoCardProps {
  form: UseFormReturn<FormValues>;
  negocioId?: string;
  onLogoSelect: (url: string) => void;
  onBannerSelect: (url: string) => void;
  phoneCode: string;
  onPhoneCodeChange: (code: string) => void;
}

export default function BusinessInfoCard({
  form,
  negocioId,
  onLogoSelect,
  onBannerSelect,
  phoneCode,
  onPhoneCodeChange,
}: BusinessInfoCardProps) {
  return (
    <Card className="bg-gradient-to-b from-card to-background/60 rounded-2xl shadow-xl overflow-hidden animate-fade-in border-none">
      <CardHeader className="bg-primary/5 border-b border-primary/10">
        <CardTitle className="flex items-center gap-2 text-xl">
          <Building className="h-5 w-5 text-primary" />
          <span>Información del Negocio</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Información básica */}
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="nombre"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre del Negocio</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Mi Negocio" 
                      autoComplete="organization" 
                      required 
                      maxLength={60} 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="telefono"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Teléfono</FormLabel>
                  <FormControl>
                    <PhoneInput
                      defaultCode={phoneCode}
                      onCodeChange={onPhoneCodeChange}
                      placeholder="1234567890"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email de contacto</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="contacto@minegocio.com" 
                      type="email" 
                      autoComplete="email" 
                      maxLength={60} 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="direccion"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dirección</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Dirección completa"
                      autoComplete="street-address"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Imágenes y descripción */}
          <div className="space-y-6">
            {/* Logo */}
            <FormField
              control={form.control}
              name="logo_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Logo del Negocio</FormLabel>
                  <FormControl>
                    <div className="max-w-full overflow-hidden">
                      <SupabaseImageUpload
                        onImageSelect={onLogoSelect}
                        currentImageUrl={field.value}
                        negocioId={negocioId || "default"}
                        bucketName="infonegocio"
                        folderPath={`Logo/${negocioId || "default"}`}
                        label="Logo"
                        previewClassName="h-20 w-20 rounded-lg object-cover border shadow mx-auto"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Banner */}
            <FormField
              control={form.control}
              name="banner_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Banner del Perfil</FormLabel>
                  <FormControl>
                    <div className="max-w-full overflow-hidden">
                      <SupabaseImageUpload
                        onImageSelect={onBannerSelect}
                        currentImageUrl={field.value}
                        negocioId={negocioId || "default"}
                        bucketName="infonegocio"
                        folderPath={`Banner/${negocioId || "default"}`}
                        label="Banner"
                        previewClassName="h-24 w-full max-w-full rounded-lg object-cover border shadow"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Descripción */}
            <FormField
              control={form.control}
              name="descripcion"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripción</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe tu negocio" 
                      rows={4} 
                      className="resize-none" 
                      maxLength={200} 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
