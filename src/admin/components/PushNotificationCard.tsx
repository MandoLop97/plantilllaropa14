
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bell, BellOff, Smartphone, AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { useUnifiedPushNotifications } from "@/hooks/use-unified-push-notifications";

interface PushNotificationCardProps {
  userId?: string;
}

export default function PushNotificationCard({ userId }: PushNotificationCardProps) {
  const {
    isSubscribed,
    isLoading,
    isSupported,
    isGranted,
    activateNotifications,
    deactivateNotifications
  } = useUnifiedPushNotifications(userId);

  const handleToggleSubscription = async () => {
    if (isSubscribed) {
      await deactivateNotifications();
    } else {
      await activateNotifications();
    }
  };

  if (!isSupported) {
    return (
      <Card className="border border-gray-200">
        <CardHeader className="border-b border-gray-200 p-4 sm:p-6">
          <CardTitle className="flex items-center gap-2 text-gray-900 text-base sm:text-lg">
            <Smartphone className="h-4 w-4 sm:h-5 sm:w-5" />
            Notificaciones Push
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <div className="flex items-center gap-3 text-amber-600 bg-amber-50 p-3 rounded-lg">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <p className="text-sm">
              Las notificaciones push no están soportadas en este navegador
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border border-gray-200">
      <CardHeader className="border-b border-gray-200 p-4 sm:p-6">
        <CardTitle className="flex items-center gap-2 text-gray-900 text-base sm:text-lg">
          <Smartphone className="h-4 w-4 sm:h-5 sm:w-5" />
          Notificaciones Push
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 sm:p-6">
        <div className="space-y-4">
          <p className="text-sm sm:text-base text-gray-600">
            Recibe notificaciones instantáneas cuando lleguen nuevos pedidos a tu negocio
          </p>

          {/* Status indicator */}
          <div className={`flex items-center gap-3 p-3 rounded-lg ${
            isSubscribed 
              ? 'text-green-700 bg-green-50' 
              : !isGranted 
                ? 'text-amber-600 bg-amber-50'
                : 'text-gray-600 bg-gray-50'
          }`}>
            {isSubscribed ? (
              <>
                <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
                <span className="text-sm font-medium">
                  Notificaciones push activadas
                </span>
              </>
            ) : !isGranted ? (
              <>
                <AlertCircle className="h-5 w-5 flex-shrink-0" />
                <span className="text-sm">
                  Permisos de notificación requeridos
                </span>
              </>
            ) : (
              <>
                <BellOff className="h-5 w-5 flex-shrink-0" />
                <span className="text-sm">
                  Notificaciones push desactivadas
                </span>
              </>
            )}
          </div>

          {/* Requirements list */}
          {!isSubscribed && (
            <div className="space-y-2">
              <p className="text-xs font-medium text-gray-700">Requisitos:</p>
              <ul className="text-xs text-gray-600 space-y-1">
                <li className="flex items-center gap-2">
                  {isGranted ? (
                    <CheckCircle2 className="h-3 w-3 text-green-600" />
                  ) : (
                    <div className="h-3 w-3 rounded-full border border-gray-300" />
                  )}
                  Permisos de notificación concedidos
                </li>
                <li className="flex items-center gap-2">
                  {isSupported ? (
                    <CheckCircle2 className="h-3 w-3 text-green-600" />
                  ) : (
                    <div className="h-3 w-3 rounded-full border border-gray-300" />
                  )}
                  Navegador compatible
                </li>
                <li className="flex items-center gap-2">
                  {userId ? (
                    <CheckCircle2 className="h-3 w-3 text-green-600" />
                  ) : (
                    <div className="h-3 w-3 rounded-full border border-gray-300" />
                  )}
                  Usuario autenticado
                </li>
              </ul>
            </div>
          )}

          {/* Action button */}
          <div className="pt-4 border-t border-gray-200">
            <Button
              onClick={handleToggleSubscription}
              disabled={isLoading || !isSupported || !userId}
              variant={isSubscribed ? "outline" : "default"}
              size="sm"
              className="w-full sm:w-auto flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Procesando...
                </>
              ) : isSubscribed ? (
                <>
                  <BellOff className="h-4 w-4" />
                  Desactivar notificaciones
                </>
              ) : (
                <>
                  <Bell className="h-4 w-4" />
                  Activar notificaciones
                </>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
