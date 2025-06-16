
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Producto, Negocio, Categoria } from '@/lib/supabase';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

interface ProductDetailViewProps {
  producto: Producto;
  negocioActivo: Negocio;
  categorias: Categoria[];
  onClose: () => void;
  onSave: () => void;
}

export default function ProductDetailView({ producto, negocioActivo, categorias, onClose, onSave }: ProductDetailViewProps) {
  const [editedProduct, setEditedProduct] = useState(producto);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const categoriaNombre = editedProduct.categoria_id === "sin-categoria" || !editedProduct.categoria_id
        ? "Sin categoría" 
        : categorias.find(cat => cat.id === editedProduct.categoria_id)?.nombre || null;

      const { data, error } = await supabase
        .from('productos')
        .update({
          nombre: editedProduct.nombre,
          descripcion: editedProduct.descripcion,
          precio: editedProduct.precio,
          categoria_id: editedProduct.categoria_id === "sin-categoria" ? null : editedProduct.categoria_id,
          categoria: categoriaNombre,
        })
        .eq('id', editedProduct.id)
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Producto actualizado",
        description: "El producto se ha actualizado correctamente.",
      });

      onSave();
    } catch (error) {
      console.error("Error al actualizar el producto:", error);
      toast({
        title: "Error",
        description: "No se pudo actualizar el producto.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getCategoriaName = (categoriaId: string | null) => {
    if (!categoriaId) return "Sin categoría";
    const categoria = categorias.find(c => c.id === categoriaId);
    return categoria ? categoria.nombre : "Sin categoría";
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <CardTitle>Detalle del Producto</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="nombre">Nombre</Label>
            <Input
              id="nombre"
              value={editedProduct.nombre}
              onChange={(e) => setEditedProduct({...editedProduct, nombre: e.target.value})}
            />
          </div>
          
          <div>
            <Label htmlFor="descripcion">Descripción</Label>
            <Textarea
              id="descripcion"
              value={editedProduct.descripcion || ''}
              onChange={(e) => setEditedProduct({...editedProduct, descripcion: e.target.value})}
            />
          </div>

          <div>
            <Label htmlFor="precio">Precio</Label>
            <Input
              id="precio"
              type="number"
              step="0.01"
              value={editedProduct.precio}
              onChange={(e) => setEditedProduct({...editedProduct, precio: parseFloat(e.target.value) || 0})}
            />
          </div>

          <div>
            <Label htmlFor="categoria">Categoría</Label>
            <Select 
              value={editedProduct.categoria_id || "sin-categoria"} 
              onValueChange={(value) => setEditedProduct({...editedProduct, categoria_id: value === "sin-categoria" ? null : value})}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona una categoría" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sin-categoria">Sin categoría</SelectItem>
                {categorias
                  .filter(categoria => categoria.id && categoria.id.trim() !== '')
                  .map((categoria) => (
                    <SelectItem key={categoria.id} value={categoria.id}>
                      {categoria.nombre}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={isLoading}>
              {isLoading ? "Guardando..." : "Guardar"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
