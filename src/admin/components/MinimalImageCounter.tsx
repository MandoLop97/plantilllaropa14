
import { useState, useEffect } from "react";
import { Images, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface MinimalImageCounterProps {
  negocioId: string;
}

const MAX_IMAGES = 5;

export default function MinimalImageCounter({ negocioId }: MinimalImageCounterProps) {
  const [imageCount, setImageCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchImageCount = async () => {
      setLoading(true);
      try {
        const { count, error } = await supabase
          .from("negocio_imagenes")
          .select("*", { count: "exact", head: true })
          .eq("negocio_id", negocioId);

        if (error) {
          console.error("Error fetching image count:", error);
        } else {
          setImageCount(count || 0);
        }
      } finally {
        setLoading(false);
      }
    };

    if (negocioId) {
      fetchImageCount();
    }
  }, [negocioId]);

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span>Cargando...</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 text-sm">
      <Images className="h-4 w-4 text-muted-foreground" />
      <span className="text-muted-foreground">
        Imágenes: <span className="font-medium text-foreground">{imageCount}/{MAX_IMAGES}</span>
      </span>
      {imageCount >= MAX_IMAGES && (
        <span className="text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
          Límite alcanzado
        </span>
      )}
    </div>
  );
}
