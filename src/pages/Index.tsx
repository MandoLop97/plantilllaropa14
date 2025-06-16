
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Check,
  Sparkles,
  Zap,
  Shield,
  Users,
  Calendar,
  Package,
  BarChart3,
  Star,
  type LucideIcon,
} from "lucide-react";

interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
  gradient: string;
  iconColor: string;
}

const FEATURES: Feature[] = [
  {
    icon: Package,
    title: "Gestión de Negocios",
    description:
      "Configura y personaliza tu negocio con toda la información relevante para tus clientes.",
    gradient: "from-blue-500/10 to-cyan-500/10",
    iconColor: "text-blue-600",
  },
  {
    icon: Calendar,
    title: "Sistema de Citas",
    description:
      "Organiza tu agenda y permite a los clientes reservar citas fácilmente según tu disponibilidad.",
    gradient: "from-purple-500/10 to-pink-500/10",
    iconColor: "text-purple-600",
  },
  {
    icon: Users,
    title: "Gestión de Clientes",
    description:
      "Mantén un registro detallado de tus clientes y mejora la relación con ellos.",
    gradient: "from-green-500/10 to-emerald-500/10",
    iconColor: "text-green-600",
  },
  {
    icon: BarChart3,
    title: "Análisis y Reportes",
    description:
      "Obtén insights valiosos sobre tu negocio con reportes detallados y métricas en tiempo real.",
    gradient: "from-orange-500/10 to-red-500/10",
    iconColor: "text-orange-600",
  },
  {
    icon: Shield,
    title: "Seguridad Avanzada",
    description:
      "Protege los datos de tu negocio y clientes con nuestros sistemas de seguridad de última generación.",
    gradient: "from-indigo-500/10 to-blue-500/10",
    iconColor: "text-indigo-600",
  },
  {
    icon: Zap,
    title: "Automatización",
    description:
      "Automatiza tareas repetitivas y enfócate en lo que realmente importa: hacer crecer tu negocio.",
    gradient: "from-yellow-500/10 to-orange-500/10",
    iconColor: "text-yellow-600",
  },
];

interface Stat {
  number: string;
  label: string;
  icon: LucideIcon;
}

const STATS: Stat[] = [
  { number: "10,000+", label: "Empresas activas", icon: Users },
  { number: "500k+", label: "Citas gestionadas", icon: Calendar },
  { number: "99.9%", label: "Tiempo de actividad", icon: Shield },
];

export default function Index() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5 animate-pulse"></div>
        <div className="floating-particles"></div>
        
        <div className="container relative z-10 px-4 py-20 md:py-32">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="flex-1 text-center lg:text-left animate-fade-in">
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6 animate-slide-in">
                <Sparkles className="h-4 w-4" />
                Plataforma Profesional
              </div>
              
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-foreground via-primary to-accent bg-clip-text text-transparent leading-tight">
                Gestiona tu negocio con
                <span className="block text-primary">BusinessPro</span>
              </h1>
              
              <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl leading-relaxed">
                La plataforma completa para gestionar tus servicios, citas y clientes de manera eficiente y profesional. Aumenta tus ventas y mejora la experiencia de tus clientes.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link to="/login">
                  <Button size="lg" className="btn-gradient group">
                    Comenzar ahora
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link to="/servicios">
                  <Button variant="outline" size="lg" className="btn-outline-modern">
                    Ver servicios
                  </Button>
                </Link>
              </div>

              <div className="flex items-center gap-6 mt-8 justify-center lg:justify-start">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">
                  Más de <span className="font-semibold text-foreground">1,000+</span> empresas confían en nosotros
                </p>
              </div>
            </div>
            
            <div className="flex-1 relative animate-scale-in">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-3xl blur-3xl transform rotate-6"></div>
                <Card className="relative glass-effect border-primary/20 hover-lift">
                  <CardContent className="p-8">
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xl font-semibold">Panel de Control</h3>
                        <div className="h-3 w-3 bg-green-500 rounded-full animate-pulse"></div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="stat-card">
                          <div className="stat-number">127</div>
                          <div className="stat-label">Citas hoy</div>
                        </div>
                        <div className="stat-card">
                          <div className="stat-number">€2.4k</div>
                          <div className="stat-label">Ingresos</div>
                        </div>
                      </div>
                      
                      <div className="h-20 bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg flex items-end p-4">
                        <div className="w-full grid grid-cols-7 gap-1 h-full">
                          {[40, 65, 45, 80, 55, 90, 70].map((height, i) => (
                            <div
                              key={i}
                              className="bg-gradient-to-t from-primary to-accent rounded-sm animate-scale-in"
                              style={{ 
                                height: `${height}%`,
                                animationDelay: `${i * 0.1}s`
                              }}
                            ></div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 md:py-32 relative">
        <div className="container px-4">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
              Características principales
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Todo lo que necesitas para hacer crecer tu negocio en una sola plataforma
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {FEATURES.map((feature, index) => (
              <Card 
                key={index} 
                className="group hover-lift glass-effect border-primary/10 animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-8">
                  <div className={`h-16 w-16 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className={`h-8 w-8 ${feature.iconColor}`} />
                  </div>
                  <h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-20 bg-gradient-to-r from-primary/5 to-accent/5 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/placeholder.svg')] opacity-5"></div>
        <div className="container px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Únete a miles de profesionales exitosos
            </h2>
            <p className="text-lg text-muted-foreground">
              Que ya confían en BusinessPro para hacer crecer sus negocios
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              {STATS.map((stat, index) => (
              <div key={index} className="text-center animate-fade-in" style={{ animationDelay: `${index * 0.2}s` }}>
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-4">
                  <stat.icon className="h-8 w-8" />
                </div>
                <div className="stat-number text-4xl md:text-5xl mb-2">{stat.number}</div>
                <div className="stat-label text-lg">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10"></div>
        <div className="container px-4 relative z-10">
          <Card className="glass-effect border-primary/20 max-w-4xl mx-auto">
            <CardContent className="p-12 text-center">
              <h2 className="text-3xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
                ¿Listo para transformar tu negocio?
              </h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                Únete a BusinessPro hoy y comienza a gestionar tu negocio de manera más eficiente y profesional.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                <Link to="/login">
                  <Button size="lg" className="btn-gradient group">
                    Comenzar gratis
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link to="/servicios">
                  <Button variant="outline" size="lg" className="btn-outline-modern">
                    Ver demo
                  </Button>
                </Link>
              </div>
              
              <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  Sin tarjeta de crédito
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  Configuración en 5 minutos
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  Soporte 24/7
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
