
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="container flex flex-col items-center justify-center h-screen text-center">
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <h2 className="text-2xl font-semibold mb-4">Página no encontrada</h2>
      <p className="text-muted-foreground mb-8">
        Lo sentimos, la página que estás buscando no existe o ha sido movida.
      </p>
      <Link to="/admin">
        <Button>Volver al Panel de Administración</Button>
      </Link>
    </div>
  );
}
