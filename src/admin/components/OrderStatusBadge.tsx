
import { Badge } from "@/components/ui/badge";

interface OrderStatusBadgeProps {
  status: string;
  type: 'order' | 'payment' | 'delivery';
}

export default function OrderStatusBadge({ status, type }: OrderStatusBadgeProps) {
  const getStatusColor = (status: string, type: string) => {
    const normalizedStatus = status.toLowerCase();
    
    if (type === 'order') {
      switch (normalizedStatus) {
        case 'pendiente':
          return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100';
        case 'confirmado':
          return 'bg-blue-100 text-blue-800 hover:bg-blue-100';
        case 'completado':
          return 'bg-green-100 text-green-800 hover:bg-green-100';
        case 'cancelado':
          return 'bg-red-100 text-red-800 hover:bg-red-100';
        default:
          return 'bg-gray-100 text-gray-800 hover:bg-gray-100';
      }
    }
    
    if (type === 'payment') {
      switch (normalizedStatus) {
        case 'pendiente':
          return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100';
        case 'pagado':
          return 'bg-green-100 text-green-800 hover:bg-green-100';
        case 'reintegrado':
          return 'bg-purple-100 text-purple-800 hover:bg-purple-100';
        case 'en confirmación':
          return 'bg-blue-100 text-blue-800 hover:bg-blue-100';
        default:
          return 'bg-gray-100 text-gray-800 hover:bg-gray-100';
      }
    }
    
    if (type === 'delivery') {
      switch (normalizedStatus) {
        case 'pendiente':
          return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100';
        case 'listo para retirar':
          return 'bg-blue-100 text-blue-800 hover:bg-blue-100';
        case 'en curso':
          return 'bg-orange-100 text-orange-800 hover:bg-orange-100';
        case 'entregado':
          return 'bg-green-100 text-green-800 hover:bg-green-100';
        default:
          return 'bg-gray-100 text-gray-800 hover:bg-gray-100';
      }
    }
    
    return 'bg-gray-100 text-gray-800 hover:bg-gray-100';
  };

  return (
    <Badge className={getStatusColor(status, type)}>
      {status.toUpperCase()}
    </Badge>
  );
}
