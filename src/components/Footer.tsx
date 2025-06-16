
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-muted/30">
      <div className="container section-padding">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Company Info */}
          <div>
            <Link to="/" className="flex items-center gap-2 font-bold text-xl mb-4">
              <div className="rounded-full bg-primary h-8 w-8 flex items-center justify-center text-primary-foreground">BP</div>
              <span>Business<span className="text-primary">Pro</span></span>
            </Link>
            <p className="text-muted-foreground mb-4">
              Solución completa para profesionales que quieren gestionar citas y vender productos o servicios de forma sencilla.
            </p>
            <div className="flex space-x-3">
              <Button variant="ghost" size="icon" aria-label="Facebook">
                <Facebook className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" aria-label="Instagram">
                <Instagram className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" aria-label="Twitter">
                <Twitter className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Enlaces Rápidos</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-muted-foreground hover:text-primary">
                  Inicio
                </Link>
              </li>
              <li>
                <Link to="/servicios" className="text-muted-foreground hover:text-primary">
                  Servicios
                </Link>
              </li>
              <li>
                <Link to="/citas" className="text-muted-foreground hover:text-primary">
                  Reservar Cita
                </Link>
              </li>
              <li>
                <Link to="/#about" className="text-muted-foreground hover:text-primary">
                  Sobre Nosotros
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Contacto</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-muted-foreground">
                <MapPin className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <span>Av. Principal 1234, Ciudad, CP 12345</span>
              </li>
              <li className="flex items-center gap-3 text-muted-foreground">
                <Phone className="h-5 w-5 text-primary flex-shrink-0" />
                <span>+1 (234) 567-8901</span>
              </li>
              <li className="flex items-center gap-3 text-muted-foreground">
                <Mail className="h-5 w-5 text-primary flex-shrink-0" />
                <span>contacto@businesspro.com</span>
              </li>
            </ul>
          </div>

          {/* Business Hours */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Horario de Atención</h3>
            <ul className="space-y-2">
              <li className="flex justify-between text-muted-foreground">
                <span>Lunes - Viernes</span>
                <span>9:00 - 19:00</span>
              </li>
              <li className="flex justify-between text-muted-foreground">
                <span>Sábado</span>
                <span>10:00 - 16:00</span>
              </li>
              <li className="flex justify-between text-muted-foreground">
                <span>Domingo</span>
                <span>Cerrado</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t mt-10 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground mb-4 md:mb-0">
            © {currentYear} Gutix.Site. Todos los derechos reservados.
          </p>
          <div className="flex gap-4">
            <Link to="/privacy" className="text-sm text-muted-foreground hover:text-primary">
              Políticas de Privacidad
            </Link>
            <Link to="/terms" className="text-sm text-muted-foreground hover:text-primary">
              Términos y Condiciones
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
