import React, { useState } from 'react';
import { useCart } from '../contexts/CartContext';
import { useDynamicBusinessId } from '../contexts/DynamicBusinessIdContext';
import { Tag, X, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { formatPrice } from '../utils/currency';
import { CustomerForm } from './CustomerForm';
import { ClientsService, OrdersService } from '../api';
import { logger } from '../utils/logger';

interface CheckoutFormProps {
  isOpen: boolean;
  onClose: () => void;
}

type CheckoutStep = 'cart' | 'customer' | 'success' | 'error';

interface CustomerData {
  nombre: string;
  apellido: string;
  telefono: string;
  email: string;
  direccion_envio: string;
  ciudad: string;
  codigo_postal: string;
  pais: string;
}

export const CheckoutForm: React.FC<CheckoutFormProps> = ({ isOpen, onClose }) => {
  const { items, total, clearCart } = useCart();
  const { businessId } = useDynamicBusinessId();
  const [currentStep, setCurrentStep] = useState<CheckoutStep>('cart');
  const [isLoading, setIsLoading] = useState(false);
  const [orderNumber, setOrderNumber] = useState<number | null>(null);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [discount, setDiscount] = useState(0);
  const [couponError, setCouponError] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Cupones de ejemplo
  const validCoupons = {
    'DESCUENTO10': 10,
    'PRIMERA20': 20,
    'VERANO15': 15
  };

  const handleApplyCoupon = () => {
    setCouponError('');
    
    if (!couponCode.trim()) {
      setCouponError('Ingresa un código de cupón');
      return;
    }

    const upperCouponCode = couponCode.toUpperCase();
    if (validCoupons[upperCouponCode]) {
      setAppliedCoupon(upperCouponCode);
      setDiscount(validCoupons[upperCouponCode]);
      setCouponCode('');
    } else {
      setCouponError('Código de cupón inválido');
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setDiscount(0);
    setCouponError('');
  };

  const discountAmount = (total * discount) / 100;
  const finalTotal = total - discountAmount;

  const handleCustomerSubmit = async (customerData: CustomerData) => {
    if (!businessId) {
      logger.error('Business ID not found');
      setError('Error de configuración: ID de negocio no encontrado');
      setCurrentStep('error');
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      logger.info('Starting customer submit process:', { customerData, businessId });
      
      // Buscar si el cliente ya existe por email
      let client = await ClientsService.getClientByEmail(customerData.email, businessId);
      logger.info('Client search result:', { client });
      
      if (!client) {
        // Crear nuevo cliente si no existe
        logger.info('Creating new client');
        client = await ClientsService.createClient({
          ...customerData,
          negocio_id: businessId
        });
        logger.info('New client created:', { client });
      } else {
        // Actualizar datos del cliente existente
        logger.info('Updating existing client');
        client = await ClientsService.updateClient(client.id, customerData);
        logger.info('Client updated:', { client });
      }

      // Crear las órdenes
      logger.info('Creating orders from cart');
      const { orderNumber: newOrderNumber } = await OrdersService.createOrderFromCart(
        client.id,
        businessId,
        items,
        finalTotal
      );

      setOrderNumber(newOrderNumber);
      setCurrentStep('success');
      
      // Limpiar carrito después de crear la orden
      setTimeout(() => {
        clearCart();
      }, 1000);
      
    } catch (error) {
      logger.error('Error creating order:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      setError(`Error al procesar el pedido: ${errorMessage}`);
      setCurrentStep('error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleWhatsAppCheckout = () => {
    if (!orderNumber) return;

    const orderSummary = items
      .map(item =>
        `- ${item.quantity}x ${item.name} (${formatPrice(
          item.price * item.quantity
        )})`
      )
      .join('\n');

    let message = `Hola, confirmando mi pedido #${orderNumber}:\n${orderSummary}\n\nSubtotal: ${formatPrice(
      total
    )}`;
    
    if (appliedCoupon) {
      message += `\nCupón aplicado: ${appliedCoupon} (-${discount}%)\nDescuento: -${formatPrice(
        discountAmount
      )}`;
    }

    message += `\nTotal: ${formatPrice(finalTotal)}`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/5491234567890?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
    onClose();
  };

  const handleBack = () => {
    if (currentStep === 'customer') {
      setCurrentStep('cart');
    } else if (currentStep === 'success') {
      setCurrentStep('cart');
    } else if (currentStep === 'error') {
      setCurrentStep('cart');
    }
  };

  const handleClose = () => {
    setCurrentStep('cart');
    setOrderNumber(null);
    setAppliedCoupon(null);
    setDiscount(0);
    setCouponCode('');
    setCouponError('');
    setError(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={handleClose}></div>
      
      {/* Checkout Panel */}
      <div className="relative ml-auto w-full max-w-md bg-white h-full flex flex-col animate-fade-in overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b sticky top-0 bg-white z-10">
          <div className="flex items-center gap-3">
            {(currentStep === 'customer' || currentStep === 'success' || currentStep === 'error') && (
              <button
                onClick={handleBack}
                className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center hover:bg-neutral-200 transition-colors"
              >
                <ArrowLeft size={18} />
              </button>
            )}
            <h2 className="text-lg font-semibold">
              {currentStep === 'cart' && 'Checkout'}
              {currentStep === 'customer' && 'Datos del cliente'}
              {currentStep === 'success' && '¡Pedido confirmado!'}
              {currentStep === 'error' && 'Error en el pedido'}
            </h2>
          </div>
          <button
            onClick={handleClose}
            className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center hover:bg-neutral-200 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 p-4 space-y-6">
          {currentStep === 'cart' && (
            <>
              {/* Order Summary */}
              <div>
                <h3 className="font-semibold text-neutral-900 mb-3">Resumen del pedido</h3>
                <div className="space-y-3">
                  {items.map(item => (
                    <div key={item.id} className="flex items-center space-x-3 bg-neutral-50 rounded-lg p-3">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-neutral-900 truncate text-sm">{item.name}</h4>
                        <p className="text-sm text-neutral-600">{formatPrice(item.price)} x {item.quantity}</p>
                      </div>
                      <div className="text-sm font-semibold text-neutral-900">
                        {formatPrice(item.price * item.quantity)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Coupon Section */}
              <div className="border rounded-lg p-4 bg-neutral-50">
                <div className="flex items-center gap-2 mb-3">
                  <Tag size={18} className="text-primary-500" />
                  <h3 className="font-semibold text-neutral-900">Cupón de descuento</h3>
                </div>
                
                {!appliedCoupon ? (
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                        placeholder="Ingresa tu código"
                        className="flex-1 px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                        onKeyPress={(e) => e.key === 'Enter' && handleApplyCoupon()}
                      />
                      <button
                        onClick={handleApplyCoupon}
                        className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors text-sm font-medium"
                      >
                        Aplicar
                      </button>
                    </div>
                    {couponError && (
                      <p className="text-red-500 text-sm">{couponError}</p>
                    )}
                    <div className="text-xs text-neutral-500">
                      <p>Cupones disponibles: DESCUENTO10, PRIMERA20, VERANO15</p>
                    </div>
                  </div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg p-3"
                  >
                    <div>
                      <p className="font-medium text-green-800">{appliedCoupon}</p>
                      <p className="text-sm text-green-600">-{discount}% de descuento aplicado</p>
                    </div>
                    <button
                      onClick={handleRemoveCoupon}
                      className="text-green-600 hover:text-green-800 transition-colors"
                    >
                      <X size={18} />
                    </button>
                  </motion.div>
                )}
              </div>

              {/* Price Summary */}
              <div className="space-y-2 border-t pt-4">
                <div className="flex justify-between text-neutral-600">
                  <span>Subtotal:</span>
                  <span>{formatPrice(total)}</span>
                </div>
                {appliedCoupon && (
                  <div className="flex justify-between text-green-600">
                    <span>Descuento ({discount}%):</span>
                    <span>-{formatPrice(discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-lg font-bold text-neutral-900 border-t pt-2">
                  <span>Total:</span>
                  <span>{formatPrice(finalTotal)}</span>
                </div>
              </div>
            </>
          )}

          {currentStep === 'customer' && (
            <CustomerForm 
              onSubmit={handleCustomerSubmit}
              isLoading={isLoading}
            />
          )}

          {currentStep === 'success' && (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-green-600 text-2xl">✓</span>
              </div>
              <h3 className="text-xl font-semibold text-neutral-900 mb-2">
                ¡Pedido confirmado!
              </h3>
              <p className="text-neutral-600 mb-4">
                Tu pedido #{orderNumber} ha sido creado exitosamente
              </p>
              <div className="text-lg font-bold text-primary-600 mb-6">
                Total: {formatPrice(finalTotal)}
              </div>
            </div>
          )}

          {currentStep === 'error' && (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-red-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-red-600 text-2xl">✗</span>
              </div>
              <h3 className="text-xl font-semibold text-neutral-900 mb-2">
                Error en el pedido
              </h3>
              <p className="text-neutral-600 mb-4">
                {error || 'Ocurrió un error al procesar tu pedido'}
              </p>
              <button
                onClick={() => setCurrentStep('cart')}
                className="bg-primary-500 text-white px-6 py-2 rounded-lg hover:bg-primary-600 transition-colors"
              >
                Intentar de nuevo
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t p-4 bg-white sticky bottom-0">
          {currentStep === 'cart' && (
            <button
              onClick={() => setCurrentStep('customer')}
              className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold py-3 rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-200 flex items-center justify-center space-x-2"
              disabled={items.length === 0}
            >
              <span>Continuar</span>
              <span>{formatPrice(finalTotal)}</span>
            </button>
          )}
          
          {currentStep === 'success' && (
            <button
              onClick={handleWhatsAppCheckout}
              className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold py-3 rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-200 flex items-center justify-center space-x-2"
            >
              <span>Enviar por WhatsApp</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
