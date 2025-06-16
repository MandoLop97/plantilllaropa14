
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { logger } from "@/lib/logger";

interface ImageUploaderProps {
  onImageSelect: (url: string) => void;
  currentImageUrl?: string | null;
  negocioId: string;
}

export default function ImageUploader({ 
  onImageSelect, 
  currentImageUrl, 
  negocioId
}: ImageUploaderProps) {
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
      const filePath = `${negocioId}/${fileName}`;
      
      logger.log("Uploading to imagenproducto bucket:", filePath);
      
      const { data, error } = await supabase.storage
        .from("imagenproducto")
        .upload(filePath, fileToUpload);
        
      if (error) {
        console.error("Upload error:", error);
        throw error;
      }
      
      logger.log("Upload successful:", data);
      
      const { data: publicURL } = supabase.storage
        .from("imagenproducto")
        .getPublicUrl(filePath);
        
      if (publicURL) {
        logger.log("Public URL:", publicURL.publicUrl);
        setImagePreview(publicURL.publicUrl);
        onImageSelect(publicURL.publicUrl);
      }
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
      setUploading(false);
      setSelectedFile(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col items-center justify-center h-40 border-2 border-dashed rounded-lg border-muted-foreground/25 p-4">
        {imagePreview ? (
          <img 
            src={imagePreview} 
            alt="Preview" 
            className="max-h-32 max-w-full object-contain" 
          />
        ) : (
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Sube una imagen
            </p>
          </div>
        )}
      </div>
      <Input 
        type="file" 
        accept="image/*"
        onChange={handleFileChange}
        disabled={uploading}
      />
      {uploading && (
        <div className="flex items-center justify-center">
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          <span className="text-sm text-muted-foreground">Subiendo imagen...</span>
        </div>
      )}
    </div>
  );
}
