
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Loader2, Plus, Pencil } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { logger } from "@/lib/logger";

interface SupabaseImageUploadProps {
  onImageSelect: (url: string) => void;
  currentImageUrl?: string | null;
  negocioId: string;
  label: string;
  previewClassName?: string;
  bucketName?: string;
  folderPath?: string;
}

export default function SupabaseImageUpload({ 
  onImageSelect, 
  currentImageUrl, 
  negocioId,
  label,
  previewClassName = "h-24 w-24 rounded-lg object-cover",
  bucketName = "imagenproducto",
  folderPath
}: SupabaseImageUploadProps) {
  const [showUploader, setShowUploader] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(currentImageUrl || null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      // Auto upload when file is selected
      handleUploadFile(file);
    }
  };

  const handleUploadFile = async (file?: File) => {
    const fileToUpload = file || selectedFile;
    if (!fileToUpload) return;
    
    setUploading(true);
    
    try {
      const fileExt = fileToUpload.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = folderPath ? `${folderPath}/${fileName}` : `${negocioId}/${fileName}`;
      
      logger.log(`Uploading to ${bucketName} bucket:`, filePath);
      
      const { data, error } = await supabase.storage
        .from(bucketName)
        .upload(filePath, fileToUpload);
        
      if (error) {
        console.error("Upload error:", error);
        throw error;
      }
      
      logger.log("Upload successful:", data);
      
      const { data: publicUrlData } = supabase.storage
        .from(bucketName)
        .getPublicUrl(filePath);
        
      logger.log("Public URL data:", publicUrlData);
      
      if (publicUrlData?.publicUrl) {
        const publicUrl = publicUrlData.publicUrl;
        logger.log("Final public URL:", publicUrl);
        setImagePreview(publicUrl);
        onImageSelect(publicUrl);
        setShowUploader(false);
      }
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
      setUploading(false);
      setSelectedFile(null);
    }
  };

  
  if (showUploader) {
    return (
      <div className="w-full max-w-full">
        <Card className="p-4 space-y-4 max-w-full overflow-hidden">
          <div className="flex justify-between items-center">
            <h3 className="font-medium text-sm lg:text-base">{label}</h3>
            <Button variant="ghost" size="sm" onClick={() => setShowUploader(false)}>
              Cancelar
            </Button>
          </div>

          <div className="space-y-3 max-w-full">
            <div className="flex items-center justify-center h-32 border-2 border-dashed rounded-lg border-muted-foreground/25 p-4 overflow-hidden">
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" className="max-h-28 max-w-full object-contain" />
              ) : (
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Vista previa de la imagen</p>
                </div>
              )}
            </div>
            <Input 
              type="file" 
              accept="image/*" 
              onChange={handleFileChange} 
              className="max-w-full"
              disabled={uploading}
            />
            {uploading && (
              <div className="flex items-center justify-center">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                <span className="text-sm text-muted-foreground">Subiendo imagen...</span>
              </div>
            )}
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-3 max-w-full">
      {currentImageUrl && (
        <div className="flex justify-center overflow-hidden">
          <img 
            src={currentImageUrl} 
            alt={label} 
            className={`${previewClassName} max-w-full`}
            onError={(e) => {
              console.error("Error loading image:", currentImageUrl);
              e.currentTarget.style.display = 'none';
            }}
          />
        </div>
      )}
      <Button
        type="button"
        variant="outline"
        onClick={() => setShowUploader(true)}
        className="w-full"
        size="sm"
      >
        {currentImageUrl ? (
          <>
            <Pencil className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Modificar {label}</span>
            <span className="sm:hidden">Modificar</span>
          </>
        ) : (
          <>
            <Plus className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Añadir {label}</span>
            <span className="sm:hidden">Añadir</span>
          </>
        )}
      </Button>
    </div>
  );
}
