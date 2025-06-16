
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Menu, X, Phone, ShoppingCart, User, LogOut } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/hooks/use-cart";
import { useAuth } from "@/hooks/use-auth";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { items } = useCart();
  const { user, signOut } = useAuth();
  
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  
  const navLinks = [
    { name: "Inicio", href: "/" },
    { name: "Servicios", href: "/servicios" },
    { name: "Citas", href: "/citas" },
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleLogout = async () => {
    await signOut();
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center gap-2 font-bold text-xl">
            <div className="rounded-full bg-primary h-8 w-8 flex items-center justify-center text-primary-foreground">BP</div>
            <span>Business<span className="text-primary">Pro</span></span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.href}
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive(link.href) 
                  ? "text-primary" 
                  : "text-foreground/80"
              }`}
            >
              {link.name}
            </Link>
          ))}
        </nav>
        
        <div className="hidden md:flex items-center gap-4">
          <Link to="/servicios">
            <Button variant="outline" size="sm" className="gap-1 relative">
              <ShoppingCart className="h-4 w-4" />
              <span className="sr-only sm:not-sr-only sm:ml-1">Carrito</span>
              {items.length > 0 && (
                <Badge 
                  variant="destructive" 
                  className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center"
                >
                  {items.length}
                </Badge>
              )}
            </Button>
          </Link>
          
          {user ? (
            <div className="flex items-center gap-2">
              <Link to="/admin">
                <Button variant="outline" size="sm" className="gap-1">
                  <User className="h-4 w-4" />
                  <span className="sr-only sm:not-sr-only sm:ml-1">Admin</span>
                </Button>
              </Link>
              <Button variant="ghost" size="sm" onClick={handleLogout} className="gap-1">
                <LogOut className="h-4 w-4" />
                <span className="sr-only sm:not-sr-only sm:ml-1">Salir</span>
              </Button>
            </div>
          ) : (
            <Link to="/login">
              <Button variant="outline" size="sm" className="gap-1">
                <User className="h-4 w-4" />
                <span className="sr-only sm:not-sr-only sm:ml-1">Login</span>
              </Button>
            </Link>
          )}
          
          <Button size="sm" className="gap-1">
            <Phone className="h-4 w-4" />
            <span className="sr-only sm:not-sr-only sm:ml-1">Contacto</span>
          </Button>
        </div>
        
        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <Button variant="ghost" size="icon" onClick={toggleMenu} aria-label="Toggle Menu">
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden container py-4 animate-fade-in">
          <nav className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className={`text-base py-2 font-medium transition-colors hover:text-primary ${
                  isActive(link.href) ? "text-primary" : "text-foreground/80"
                }`}
                onClick={toggleMenu}
              >
                {link.name}
              </Link>
            ))}
            <div className="flex items-center gap-4 pt-4">
              <Link to="/servicios" className="flex-1" onClick={toggleMenu}>
                <Button variant="outline" className="w-full gap-2 relative">
                  <ShoppingCart className="h-4 w-4" />
                  <span>Carrito</span>
                  {items.length > 0 && (
                    <Badge 
                      variant="destructive" 
                      className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center"
                    >
                      {items.length}
                    </Badge>
                  )}
                </Button>
              </Link>
              
              {user ? (
                <div className="flex flex-1 gap-2">
                  <Link to="/admin" className="flex-1" onClick={toggleMenu}>
                    <Button variant="outline" className="w-full gap-2">
                      <User className="h-4 w-4" />
                      <span>Admin</span>
                    </Button>
                  </Link>
                  <Button variant="ghost" className="flex-1 gap-2" onClick={handleLogout}>
                    <LogOut className="h-4 w-4" />
                    <span>Salir</span>
                  </Button>
                </div>
              ) : (
                <Link to="/login" className="flex-1" onClick={toggleMenu}>
                  <Button variant="outline" className="w-full gap-2">
                    <User className="h-4 w-4" />
                    <span>Login</span>
                  </Button>
                </Link>
              )}
              
              <Button className="flex-1 gap-2">
                <Phone className="h-4 w-4" />
                <span>Contacto</span>
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
