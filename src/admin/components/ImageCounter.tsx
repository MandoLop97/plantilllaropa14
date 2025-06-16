
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ImageIcon, Images, Loader2, Trash2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import ImageUploadButton from "./ImageUploadButton";

interface Image {
  id: string;
  name: string;
  public_url: string;
}

interface ImageCounterProps {
  negocioId: string;
}

const MAX_IMAGES = 5;

export default function ImageCounter({ negocioId }: ImageCounterProps) {
  const [images, setImages] = useState<Image[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchImages = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("negocio_imagenes")
          .select("id, name, public_url")
          .eq("negocio_id", negocioId);

        if (error) {
          console.error("Error fetching images:", error);
          toast({
            title: "Error",
            description: "Failed to load images.",
            variant: "destructive",
          });
        } else {
          setImages(data || []);
        }
      } finally {
        setLoading(false);
      }
    };

    if (negocioId) {
      fetchImages();
    }
  }, [negocioId, toast]);

  const handleImageUpload = async (imageUrl: string) => {
    // Add the new image to the negocio_imagenes table
    try {
      const { error } = await supabase
        .from("negocio_imagenes")
        .insert({
          negocio_id: negocioId,
          name: `image_${Date.now()}`,
          public_url: imageUrl,
        });

      if (error) {
        console.error("Error saving image:", error);
        toast({
          title: "Error",
          description: "Failed to save image.",
          variant: "destructive",
        });
      } else {
        // Refresh the images list
        const { data } = await supabase
          .from("negocio_imagenes")
          .select("id, name, public_url")
          .eq("negocio_id", negocioId);
        
        setImages(data || []);
        toast({
          title: "Imagen guardada",
          description: "La imagen se ha guardado correctamente.",
        });
      }
    } catch (error) {
      console.error("Error saving image:", error);
      toast({
        title: "Error",
        description: "Failed to save image.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteImage = async (imageId: string) => {
    if (!window.confirm("¿Estás seguro de que deseas eliminar esta imagen?")) {
      return;
    }

    setDeleting(true);
    try {
      const { error } = await supabase
        .from("negocio_imagenes")
        .delete()
        .eq("id", imageId);

      if (error) {
        console.error("Error deleting image:", error);
        toast({
          title: "Error",
          description: "Failed to delete image.",
          variant: "destructive",
        });
      } else {
        setImages((prevImages) =>
          prevImages.filter((image) => image.id !== imageId)
        );
        toast({
          title: "Imagen eliminada",
          description: "La imagen se ha eliminado correctamente.",
        });
      }
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Card className="border border-gray-200">
      <CardHeader className="border-b border-gray-200">
        <CardTitle className="flex items-center gap-2 text-gray-900">
          <Images className="h-5 w-5" />
          Galería de Imágenes
        </CardTitle>
        <p className="text-sm text-gray-600">
          {images.length} de {MAX_IMAGES} imágenes
        </p>
      </CardHeader>
      <CardContent className="pt-6">
        {images.length === 0 ? (
          <div className="text-center py-8">
            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <ImageIcon className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No hay imágenes
            </h3>
            <p className="text-gray-600 mb-4">
              Sube las primeras imágenes de tu negocio
            </p>
            <ImageUploadButton 
              onImageSelect={handleImageUpload}
              negocioId={negocioId}
              label="Subir imagen"
            />
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-600">
                Imágenes subidas ({images.length}/{MAX_IMAGES})
              </p>
              {images.length < MAX_IMAGES && (
                <ImageUploadButton 
                  onImageSelect={handleImageUpload}
                  negocioId={negocioId}
                  label="Añadir imagen"
                />
              )}
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {images.map((image) => (
                <div key={image.id} className="group relative aspect-square">
                  <img
                    src={image.public_url}
                    alt={image.name}
                    className="w-full h-full object-cover rounded-lg border border-gray-200"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity rounded-lg flex items-center justify-center">
                    <Button
                      variant="destructive"
                      size="sm"
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => handleDeleteImage(image.id)}
                      disabled={deleting}
                    >
                      {deleting ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {images.length >= MAX_IMAGES && (
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">
                  Has alcanzado el límite máximo de {MAX_IMAGES} imágenes
                </p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
