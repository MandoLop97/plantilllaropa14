
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import OrderStatusBadge from "./OrderStatusBadge";
import { Loader2 } from "lucide-react";

interface GroupedOrder {
  num_pedido: string;
  ordenes: unknown[];
  total_amount: number;
  total_items: number;
  cliente: unknown;
  estado: string;
  fecha: string;
  estado_pago?: string;
  estado_entrega?: string;
  nota_interna?: string;
  subtotal?: number;
}

interface OrderEditFormProps {
  order: GroupedOrder;
  onSave: () => void;
  onCancel: () => void;
}

export default function OrderEditForm({ order, onSave, onCancel }: OrderEditFormProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    estado: order.estado || 'pendiente',
    estado_pago: order.estado_pago || 'pendiente',
    estado_entrega: order.estado_entrega || 'pendiente',
    nota_interna: order.nota_interna || '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Update all orders with the same num_pedido
      const { error } = await supabase
        .from('items')
        .update({
          estado: formData.estado,
          estado_pago: formData.estado_pago,
          estado_entrega: formData.estado_entrega,
          nota_interna: formData.nota_interna,
        })
        .eq('num_pedido', order.num_pedido);

      if (error) throw error;

      toast({
        title: "Orden actualizada",
        description: "Los cambios se han guardado correctamente.",
      });

      onSave();
    } catch (error) {
      console.error("Error updating order:", error);
      toast({
        title: "Error",
        description: "No se pudo actualizar la orden.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Estado de Orden */}
        <div className="space-y-2">
          <Label htmlFor="estado">Estado de Orden</Label>
          <Select value={formData.estado} onValueChange={(value) => setFormData(prev => ({ ...prev, estado: value }))}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pendiente">Pendiente</SelectItem>
              <SelectItem value="confirmado">Confirmado</SelectItem>
              <SelectItem value="completado">Completado</SelectItem>
              <SelectItem value="cancelado">Cancelado</SelectItem>
            </SelectContent>
          </Select>
          <OrderStatusBadge status={formData.estado} type="order" />
        </div>

        {/* Estado de Pago */}
        <div className="space-y-2">
          <Label htmlFor="estado_pago">Estado de Pago</Label>
          <Select value={formData.estado_pago} onValueChange={(value) => setFormData(prev => ({ ...prev, estado_pago: value }))}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pendiente">Pendiente</SelectItem>
              <SelectItem value="pagado">Pagado</SelectItem>
              <SelectItem value="reintegrado">Reintegrado</SelectItem>
              <SelectItem value="en confirmación">En confirmación</SelectItem>
            </SelectContent>
          </Select>
          <OrderStatusBadge status={formData.estado_pago} type="payment" />
        </div>

        {/* Estado de Entrega */}
        <div className="space-y-2">
          <Label htmlFor="estado_entrega">Estado de Entrega</Label>
          <Select value={formData.estado_entrega} onValueChange={(value) => setFormData(prev => ({ ...prev, estado_entrega: value }))}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pendiente">Pendiente</SelectItem>
              <SelectItem value="listo para retirar">Listo para retirar</SelectItem>
              <SelectItem value="en curso">En curso</SelectItem>
              <SelectItem value="entregado">Entregado</SelectItem>
            </SelectContent>
          </Select>
          <OrderStatusBadge status={formData.estado_entrega} type="delivery" />
        </div>
      </div>

      {/* Nota Interna */}
      <div className="space-y-2">
        <Label htmlFor="nota_interna">Nota Interna</Label>
        <Textarea
          id="nota_interna"
          value={formData.nota_interna}
          onChange={(e) => setFormData(prev => ({ ...prev, nota_interna: e.target.value }))}
          placeholder="Agregar notas internas para el equipo..."
          rows={3}
        />
      </div>

      {/* Botones */}
      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" disabled={loading}>
          {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
          Guardar Cambios
        </Button>
      </div>
    </form>
  );
}
