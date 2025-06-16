
import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/hooks/use-cart";
import { toast } from "@/hooks/use-toast";

// Local interface for sample services
interface ServicioMuestra {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  duracion: number;
  imagen: string;
}

const serviciosMuestra: ServicioMuestra[] = [
  {
    id: "1",
    nombre: "Corte de cabello",
    descripcion: "Corte y peinado profesional adaptado a tus necesidades",
    precio: 25,
    duracion: 30,
    imagen: "/placeholder.svg"
  },
  {
    id: "2",
    nombre: "Manicura",
    descripcion: "Tratamiento completo para manos con esmalte de larga duración",
    precio: 20,
    duracion: 45,
    imagen: "/placeholder.svg"
  },
  {
    id: "3",
    nombre: "Tratamiento facial",
    descripcion: "Limpieza profunda e hidratación para una piel radiante",
    precio: 40,
    duracion: 60,
    imagen: "/placeholder.svg"
  },
  {
    id: "4",
    nombre: "Masaje relajante",
    descripcion: "Masaje corporal completo para aliviar tensiones",
    precio: 50,
    duracion: 60,
    imagen: "/placeholder.svg"
  }
];

export default function Servicios() {
  const { items, addItem } = useCart();
  const [searchTerm, setSearchTerm] = useState("");

  const handleAddToCart = (servicio: ServicioMuestra) => {
    addItem({
      id: servicio.id,
      name: servicio.nombre,
      price: servicio.precio,
      quantity: 1,
    });
    
    toast({
      title: "Añadido al carrito",
      description: `${servicio.nombre} ha sido añadido a tu carrito`,
    });
  };

  const filteredServicios = serviciosMuestra.filter((servicio) =>
    servicio.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between mb-8">
        <h1 className="text-3xl font-bold">Nuestros Servicios</h1>
        
        <div className="relative">
          <input
            type="text"
            placeholder="Buscar servicios..."
            className="px-4 py-2 border rounded-md w-full md:w-64"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredServicios.map((servicio) => (
          <Card key={servicio.id}>
            <div className="aspect-video w-full overflow-hidden rounded-t-lg">
              <img 
                src={servicio.imagen} 
                alt={servicio.nombre} 
                className="w-full h-full object-cover"
              />
            </div>
            <CardHeader>
              <div className="flex items-start justify-between">
                <CardTitle>{servicio.nombre}</CardTitle>
                <Badge variant="outline" className="ml-2">
                  {servicio.duracion} min
                </Badge>
              </div>
              <CardDescription>{servicio.descripcion}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{servicio.precio}€</p>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full" 
                onClick={() => handleAddToCart(servicio)}
              >
                Añadir al carrito
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      
      {filteredServicios.length === 0 && (
        <div className="text-center py-12">
          <p className="text-lg text-muted-foreground">No se encontraron servicios que coincidan con tu búsqueda.</p>
        </div>
      )}
    </div>
  );
}
