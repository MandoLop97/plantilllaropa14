import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Crown, Star, Building, Zap, Clock, Gift, ArrowLeft } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

type Plan = {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  features: string[];
  popular?: boolean;
  current?: boolean;
  discount?: boolean;
  free?: boolean;
};

const plans: Plan[] = [
  {
    id: "gratuito",
    name: "Gratuito",
    price: 0,
    description: "Perfecto para probar nuestras funciones básicas",
    icon: Gift,
    features: [
      "Hasta 10 productos",
      "Panel básico",
      "Soporte por email",
      "1 negocio",
      "Plantilla básica",
      "Marca de agua"
    ],
    free: true
  },
  {
    id: "basico",
    name: "Básico",
    price: 90,
    description: "Perfecto para pequeños negocios que están comenzando",
    icon: Star,
    features: [
      "Hasta 100 productos",
      "Panel de administración básico",
      "Soporte por email",
      "1 negocio",
      "Plantillas básicas"
    ]
  },
  {
    id: "pro",
    name: "Pro",
    price: 90,
    originalPrice: 200,
    description: "Para negocios en crecimiento que necesitan más funciones",
    icon: Crown,
    features: [
      "Hasta 500 productos",
      "Panel de administración avanzado",
      "Soporte prioritario",
      "3 negocios",
      "Todas las plantillas",
      "Reportes avanzados",
      "Integraciones"
    ],
    popular: true,
    discount: true
  },
  {
    id: "negocio",
    name: "Negocio",
    price: 500,
    description: "Ideal para negocios establecidos con múltiples ubicaciones",
    icon: Building,
    features: [
      "Hasta 2000 productos",
      "Panel completo",
      "Soporte telefónico",
      "10 negocios",
      "Plantillas premium",
      "Reportes personalizados",
      "API access",
      "Multi-ubicación"
    ]
  },
  {
    id: "empresa",
    name: "Empresa",
    price: 1200,
    description: "Para grandes empresas con necesidades específicas",
    icon: Zap,
    features: [
      "Productos ilimitados",
      "Panel personalizado",
      "Soporte dedicado",
      "Negocios ilimitados",
      "Desarrollo personalizado",
      "Integración enterprise",
      "SLA garantizado",
      "Consultoría incluida"
    ]
  }
];

export default function AdminPlanes() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    // Calcular 1 mes desde ahora
    const discountEndDate = new Date();
    discountEndDate.setMonth(discountEndDate.getMonth() + 1);

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = discountEndDate.getTime() - now;

      if (distance > 0) {
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleSelectPlan = (planId: string) => {
    const planName = plans.find(p => p.id === planId)?.name || 'plan';
    const message = `Hola! Me interesa el plan ${planName}. ¿Podrían darme más información?`;
    const whatsappUrl = `https://wa.me/524622070235?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleBackToDashboard = () => {
    navigate('/admin/dashboard');
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-50 via-white to-blue-50 overflow-x-hidden">
      {/* Meta viewport para asegurar escala correcta en móviles */}
      <div 
        className="w-full"
        style={{
          minWidth: '320px',
          maxWidth: '100vw'
        }}
      >
        <div className="w-full max-w-7xl mx-auto py-4 px-3 sm:py-6 sm:px-4 lg:py-8 lg:px-6">
          {/* Back Button */}
          <div className="mb-4 sm:mb-6 animate-fade-in">
            <Button
              onClick={handleBackToDashboard}
              variant="ghost"
              size="sm"
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-all duration-200 hover-scale text-sm sm:text-base px-2 py-1.5 sm:px-3 sm:py-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Volver al Dashboard</span>
              <span className="sm:hidden">Volver</span>
            </Button>
          </div>

          <div className="text-center mb-6 sm:mb-8 lg:mb-12 animate-fade-in">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4 lg:mb-6 bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent leading-tight px-2">
              Elige tu plan perfecto
            </h1>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed px-4">
              Mejora tu cuenta para acceder a más funciones y hacer crecer tu negocio
            </p>
            
            {/* Contador de descuento */}
            <div className="mt-4 sm:mt-6 lg:mt-8 p-3 sm:p-4 lg:p-6 bg-gradient-to-r from-purple-100 via-blue-100 to-indigo-100 rounded-xl max-w-xs sm:max-w-sm lg:max-w-md mx-auto shadow-lg border border-purple-200 animate-scale-in">
              <div className="flex items-center justify-center gap-1 sm:gap-2 mb-2 sm:mb-3">
                <Clock className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-purple-600 animate-pulse" />
                <span className="font-semibold text-purple-800 text-xs sm:text-sm lg:text-lg">¡Oferta especial termina en!</span>
              </div>
              <div className="flex justify-center gap-2 sm:gap-3 lg:gap-6 text-xs sm:text-sm">
                <div className="text-center animate-fade-in">
                  <div className="font-bold text-sm sm:text-lg lg:text-2xl text-purple-600 bg-white rounded-lg px-1.5 sm:px-2 lg:px-3 py-1 sm:py-1.5 lg:py-2 shadow-sm">{timeLeft.days}</div>
                  <div className="text-purple-700 mt-0.5 sm:mt-1 text-xs">días</div>
                </div>
                <div className="text-center animate-fade-in">
                  <div className="font-bold text-sm sm:text-lg lg:text-2xl text-purple-600 bg-white rounded-lg px-1.5 sm:px-2 lg:px-3 py-1 sm:py-1.5 lg:py-2 shadow-sm">{timeLeft.hours}</div>
                  <div className="text-purple-700 mt-0.5 sm:mt-1 text-xs">horas</div>
                </div>
                <div className="text-center animate-fade-in">
                  <div className="font-bold text-sm sm:text-lg lg:text-2xl text-purple-600 bg-white rounded-lg px-1.5 sm:px-2 lg:px-3 py-1 sm:py-1.5 lg:py-2 shadow-sm">{timeLeft.minutes}</div>
                  <div className="text-purple-700 mt-0.5 sm:mt-1 text-xs">min</div>
                </div>
                <div className="text-center animate-fade-in">
                  <div className="font-bold text-sm sm:text-lg lg:text-2xl text-purple-600 bg-white rounded-lg px-1.5 sm:px-2 lg:px-3 py-1 sm:py-1.5 lg:py-2 shadow-sm">{timeLeft.seconds}</div>
                  <div className="text-purple-700 mt-0.5 sm:mt-1 text-xs">seg</div>
                </div>
              </div>
            </div>
          </div>

          {/* Desktop Layout - 2 rows, 3 and 2 columns */}
          <div className="hidden lg:block">
            {/* Primera fila: Gratuito, Básico, Pro */}
            <div className="grid grid-cols-3 gap-8 max-w-6xl mx-auto mb-12">
              {plans.slice(0, 3).map((plan, index) => {
                const Icon = plan.icon;
                return (
                  <Card 
                    key={plan.id} 
                    className={`relative flex flex-col h-full group animate-fade-in hover-scale transition-all duration-300 ${
                      plan.popular 
                        ? 'border-2 border-purple-500 shadow-2xl scale-105 bg-gradient-to-br from-purple-50 to-white' 
                        : plan.free
                        ? 'border-2 border-green-500 bg-gradient-to-br from-green-50 to-white shadow-lg'
                        : 'border border-gray-200 hover:shadow-xl bg-white'
                    }`}
                    style={{ animationDelay: `${index * 150}ms` }}
                  >
                    {plan.popular && (
                      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 animate-scale-in">
                        <Badge className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-6 py-2 text-sm font-semibold shadow-lg">
                          Más Popular
                        </Badge>
                      </div>
                    )}

                    {plan.free && (
                      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 animate-scale-in">
                        <Badge className="bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-2 text-sm font-semibold shadow-lg">
                          Gratis
                        </Badge>
                      </div>
                    )}

                    {plan.discount && (
                      <div className="absolute -top-3 -right-3 animate-scale-in">
                        <Badge className="bg-gradient-to-r from-red-600 to-red-700 text-white px-4 py-2 animate-pulse shadow-lg rounded-full">
                          ¡55% OFF!
                        </Badge>
                      </div>
                    )}

                    <CardHeader className="text-center pb-6">
                      <div className={`mx-auto p-4 rounded-full w-fit mb-6 transition-all duration-300 group-hover:scale-110 ${
                        plan.popular 
                          ? 'bg-gradient-to-br from-purple-100 to-purple-200 text-purple-600' 
                          : plan.free
                          ? 'bg-gradient-to-br from-green-100 to-green-200 text-green-600'
                          : 'bg-gradient-to-br from-gray-100 to-gray-200 text-gray-600'
                      }`}>
                        <Icon className="h-10 w-10" />
                      </div>
                      <CardTitle className="text-3xl font-bold text-gray-900 mb-4">
                        {plan.name}
                      </CardTitle>
                      <div className="mb-4">
                        {plan.originalPrice && (
                          <div className="text-xl text-gray-500 line-through mb-2">
                            ${plan.originalPrice}/mes
                          </div>
                        )}
                        <div className="text-5xl font-bold text-gray-900 mb-2">
                          {plan.free ? 'Gratis' : `$${plan.price}`}
                          {!plan.free && <span className="text-lg font-normal text-gray-500">/mes</span>}
                        </div>
                        {plan.originalPrice && (
                          <div className="text-base text-green-600 font-semibold bg-green-100 px-3 py-1 rounded-full inline-block">
                            Ahorras ${plan.originalPrice - plan.price}/mes
                          </div>
                        )}
                      </div>
                      <CardDescription className="text-gray-600 text-lg leading-relaxed">
                        {plan.description}
                      </CardDescription>
                    </CardHeader>

                    <CardContent className="flex-1 px-8">
                      <ul className="space-y-4">
                        {plan.features.map((feature, index) => (
                          <li key={index} className="flex items-start gap-4 animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                            <Check className="h-6 w-6 text-green-500 flex-shrink-0 mt-0.5" />
                            <span className="text-gray-700 text-base leading-relaxed">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>

                    <CardFooter className="pt-8 px-8">
                      <Button
                        onClick={() => handleSelectPlan(plan.id)}
                        className={`w-full h-14 text-lg font-semibold transition-all duration-300 hover-scale ${
                          plan.popular
                            ? 'bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white shadow-lg'
                            : plan.free
                            ? 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-lg'
                            : 'bg-gradient-to-r from-gray-900 to-gray-800 hover:from-gray-800 hover:to-gray-700 text-white shadow-lg'
                        }`}
                      >
                        {plan.current ? 'Plan Actual' : plan.free ? 'Comenzar Gratis' : 'Seleccionar Plan'}
                      </Button>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>

            {/* Segunda fila: Negocio, Empresa */}
            <div className="grid grid-cols-2 gap-8 max-w-5xl mx-auto">
              {plans.slice(3, 5).map((plan, index) => {
                const Icon = plan.icon;
                return (
                  <Card 
                    key={plan.id} 
                    className="relative flex flex-col h-full group animate-fade-in hover-scale transition-all duration-300 border border-gray-200 hover:shadow-xl bg-white"
                    style={{ animationDelay: `${(index + 3) * 150}ms` }}
                  >
                    <CardHeader className="text-center pb-6">
                      <div className="mx-auto p-4 rounded-full w-fit mb-6 bg-gradient-to-br from-gray-100 to-gray-200 text-gray-600 transition-all duration-300 group-hover:scale-110">
                        <Icon className="h-10 w-10" />
                      </div>
                      <CardTitle className="text-3xl font-bold text-gray-900 mb-4">
                        {plan.name}
                      </CardTitle>
                      <div className="mb-4">
                        <div className="text-5xl font-bold text-gray-900 mb-2">
                          ${plan.price}
                          <span className="text-lg font-normal text-gray-500">/mes</span>
                        </div>
                      </div>
                      <CardDescription className="text-gray-600 text-lg leading-relaxed">
                        {plan.description}
                      </CardDescription>
                    </CardHeader>

                    <CardContent className="flex-1 px-8">
                      <ul className="space-y-4">
                        {plan.features.map((feature, index) => (
                          <li key={index} className="flex items-start gap-4 animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                            <Check className="h-6 w-6 text-green-500 flex-shrink-0 mt-0.5" />
                            <span className="text-gray-700 text-base leading-relaxed">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>

                    <CardFooter className="pt-8 px-8">
                      <Button
                        onClick={() => handleSelectPlan(plan.id)}
                        className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-gray-900 to-gray-800 hover:from-gray-800 hover:to-gray-700 text-white shadow-lg transition-all duration-300 hover-scale"
                      >
                        {plan.current ? 'Plan Actual' : 'Seleccionar Plan'}
                      </Button>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Mobile Layout - Single column with better spacing */}
          <div className="grid grid-cols-1 gap-4 sm:gap-6 max-w-sm sm:max-w-md mx-auto lg:hidden">
            {plans.map((plan, index) => {
              const Icon = plan.icon;
              return (
                <Card 
                  key={plan.id} 
                  className={`relative flex flex-col group animate-fade-in hover-scale transition-all duration-300 ${
                    plan.popular 
                      ? 'border-2 border-purple-500 shadow-2xl bg-gradient-to-br from-purple-50 to-white' 
                      : plan.free
                      ? 'border-2 border-green-500 bg-gradient-to-br from-green-50 to-white shadow-lg'
                      : 'border border-gray-200 hover:shadow-xl bg-white'
                  }`}
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 animate-scale-in">
                      <Badge className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-3 sm:px-4 py-1 sm:py-1.5 text-xs sm:text-sm font-semibold shadow-lg">
                        Más Popular
                      </Badge>
                    </div>
                  )}

                  {plan.free && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 animate-scale-in">
                      <Badge className="bg-gradient-to-r from-green-600 to-green-700 text-white px-3 sm:px-4 py-1 sm:py-1.5 text-xs sm:text-sm font-semibold shadow-lg">
                        Gratis
                      </Badge>
                    </div>
                  )}

                  {plan.discount && (
                    <div className="absolute -top-2 -right-2 animate-scale-in">
                      <Badge className="bg-gradient-to-r from-red-600 to-red-700 text-white px-2 sm:px-3 py-1 animate-pulse shadow-lg rounded-full text-xs">
                        ¡55% OFF!
                      </Badge>
                    </div>
                  )}

                  <CardHeader className="text-center pb-4 sm:pb-6 px-4 sm:px-6">
                    <div className={`mx-auto p-3 sm:p-4 rounded-full w-fit mb-4 sm:mb-6 transition-all duration-300 group-hover:scale-110 ${
                      plan.popular 
                        ? 'bg-gradient-to-br from-purple-100 to-purple-200 text-purple-600' 
                        : plan.free
                        ? 'bg-gradient-to-br from-green-100 to-green-200 text-green-600'
                        : 'bg-gradient-to-br from-gray-100 to-gray-200 text-gray-600'
                    }`}>
                      <Icon className="h-6 w-6 sm:h-8 sm:w-8" />
                    </div>
                    <CardTitle className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">
                      {plan.name}
                    </CardTitle>
                    <div className="mb-3 sm:mb-4">
                      {plan.originalPrice && (
                        <div className="text-sm sm:text-lg text-gray-500 line-through mb-1 sm:mb-2">
                          ${plan.originalPrice}/mes
                        </div>
                      )}
                      <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-1 sm:mb-2">
                        {plan.free ? 'Gratis' : `$${plan.price}`}
                        {!plan.free && <span className="text-sm sm:text-lg font-normal text-gray-500">/mes</span>}
                      </div>
                      {plan.originalPrice && (
                        <div className="text-xs sm:text-sm text-green-600 font-semibold bg-green-100 px-2 sm:px-3 py-1 rounded-full inline-block">
                          Ahorras ${plan.originalPrice - plan.price}/mes
                        </div>
                      )}
                    </div>
                    <CardDescription className="text-gray-600 text-sm sm:text-base lg:text-lg leading-relaxed px-2">
                      {plan.description}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="flex-1 px-4 sm:px-6">
                    <ul className="space-y-3 sm:space-y-4">
                      {plan.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-start gap-3 animate-fade-in" style={{ animationDelay: `${featureIndex * 100}ms` }}>
                          <Check className="h-4 w-4 sm:h-5 sm:w-5 text-green-500 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-700 text-sm sm:text-base leading-relaxed">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>

                  <CardFooter className="pt-4 sm:pt-6 lg:pt-8 px-4 sm:px-6">
                    <Button
                      onClick={() => handleSelectPlan(plan.id)}
                      className={`w-full h-12 sm:h-14 text-sm sm:text-lg font-semibold transition-all duration-300 hover-scale ${
                        plan.popular
                          ? 'bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white shadow-lg'
                          : plan.free
                          ? 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-lg'
                          : 'bg-gradient-to-r from-gray-900 to-gray-800 hover:from-gray-800 hover:to-gray-700 text-white shadow-lg'
                      }`}
                    >
                      {plan.current ? 'Plan Actual' : plan.free ? 'Comenzar Gratis' : 'Seleccionar Plan'}
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>

          <div className="mt-12 sm:mt-16 text-center animate-fade-in">
            <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-lg px-4">
              ¿Necesitas algo más específico?
            </p>
            <Button 
              variant="outline" 
              size="lg"
              className="h-12 sm:h-14 px-6 sm:px-8 text-sm sm:text-lg font-semibold border-2 hover:bg-gray-50 hover-scale transition-all duration-300"
              onClick={() => {
                const message = "Hola! Me gustaría información sobre planes personalizados.";
                const whatsappUrl = `https://wa.me/524622070235?text=${encodeURIComponent(message)}`;
                window.open(whatsappUrl, '_blank');
              }}
            >
              Contactar Ventas
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
