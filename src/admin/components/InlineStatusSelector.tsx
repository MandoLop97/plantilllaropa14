
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { logger } from "@/lib/logger";
import OrderStatusBadge from "./OrderStatusBadge";
import { Loader2 } from "lucide-react";

interface InlineStatusSelectorProps {
  status: string;
  type: 'order' | 'payment' | 'delivery';
  orderNumPedido: string;
  negocioId: string;
  onStatusChange: () => void;
}

const statusOptions = {
  order: [
    { value: 'pendiente', label: 'PENDIENTE' },
    { value: 'confirmado', label: 'CONFIRMADO' },
    { value: 'completado', label: 'COMPLETADO' },
    { value: 'cancelado', label: 'CANCELADO' }
  ],
  payment: [
    { value: 'pendiente', label: 'PENDIENTE' },
    { value: 'pagado', label: 'PAGADO' },
    { value: 'reintegrado', label: 'REINTEGRADO' },
    { value: 'en confirmación', label: 'EN CONFIRMACIÓN' }
  ],
  delivery: [
    { value: 'pendiente', label: 'PENDIENTE' },
    { value: 'listo para retirar', label: 'LISTO PARA RETIRAR' },
    { value: 'en curso', label: 'EN CURSO' },
    { value: 'entregado', label: 'ENTREGADO' }
  ]
};

export default function InlineStatusSelector({ 
  status, 
  type, 
  orderNumPedido, 
  negocioId, 
  onStatusChange 
}: InlineStatusSelectorProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();

  const handleStatusChange = async (newStatus: string) => {
    if (newStatus === status) return; // No change needed
    
    setIsUpdating(true);
    logger.log(
      `Updating ${type} status from ${status} to ${newStatus} for order ${orderNumPedido}`
    );
    
    try {
      const columnName = type === 'order' ? 'estado' : 
                        type === 'payment' ? 'estado_pago' : 'estado_entrega';

      const { error } = await supabase
        .from('ordenes')
        .update({ [columnName]: newStatus })
        .eq('num_pedido', orderNumPedido)
        .eq('negocio_id', negocioId);

      if (error) throw error;

      logger.log(`Successfully updated ${type} status to ${newStatus}`);

      toast({
        title: "Estado actualizado",
        description: `El ${type === 'order' ? 'estado de orden' : 
                      type === 'payment' ? 'estado de pago' : 'estado de entrega'} ha sido actualizado a ${newStatus}.`,
      });

      // Call the callback to refresh the parent component
      onStatusChange();
    } catch (error) {
      console.error("Error updating status:", error);
      toast({
        title: "Error",
        description: "No se pudo actualizar el estado.",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Select value={status} onValueChange={handleStatusChange} disabled={isUpdating}>
      <SelectTrigger className="w-full border border-border/50 bg-background hover:bg-muted/50 transition-colors duration-200 focus:ring-2 focus:ring-primary/20">
        <SelectValue asChild>
          <div className="flex items-center gap-2 w-full">
            {isUpdating ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />
                <OrderStatusBadge status={status} type={type} />
              </div>
            ) : (
              <OrderStatusBadge status={status} type={type} />
            )}
          </div>
        </SelectValue>
      </SelectTrigger>
      <SelectContent 
        className="bg-background/95 backdrop-blur-sm border border-border shadow-lg rounded-lg p-1 z-50"
        align="start"
      >
        {statusOptions[type].map((option) => (
          <SelectItem 
            key={option.value} 
            value={option.value}
            className="rounded-md py-2.5 px-3 text-sm font-medium cursor-pointer transition-colors duration-150 hover:bg-muted focus:bg-muted data-[highlighted]:bg-muted"
          >
            <OrderStatusBadge status={option.value} type={type} />
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
