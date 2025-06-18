
import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, Check, CreditCard, User, ShoppingBag, Package, Sparkles } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useDynamicBusinessConfig } from '../hooks/useDynamicBusinessConfig';
import { formatPrice } from '../utils/currency';
import { Link, useNavigate } from 'react-router-dom';

type CheckoutPhase = 'customer' | 'payment' | 'confirmation';

interface CustomerData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  notes: string;
}

interface PaymentData {
  method: 'cash' | 'transfer' | 'card';
  cardNumber?: string;
  cardName?: string;
  cardExpiry?: string;
  cardCvc?: string;
}

export default function Checkout() {
  const { items, total, itemCount, clearCart } = useCart();
  const businessConfig = useDynamicBusinessConfig();
  const navigate = useNavigate();
  
  const [currentPhase, setCurrentPhase] = useState<CheckoutPhase>('customer');
  const [customerData, setCustomerData] = useState<CustomerData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    notes: ''
  });
  
  const [paymentData, setPaymentData] = useState<PaymentData>({
    method: 'cash'
  });

  const [orderNumber] = useState(() => 
    `ORD-${Date.now().toString().slice(-6)}`
  );

  const handleCustomerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPhase('payment');
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPhase('confirmation');
  };

  const handleFinishOrder = () => {
    clearCart();
    navigate('/');
  };

  if (items.length === 0 && currentPhase !== 'confirmation') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-3">
        <div className="bg-white rounded-xl shadow-sm p-6 text-center max-w-sm w-full">
          <div className="w-12 h-12 bg-gray-100 rounded-full mx-auto mb-3 flex items-center justify-center">
            <ShoppingBag size={24} className="text-gray-400" />
          </div>
          <h2 className="text-lg font-bold text-gray-900 mb-2">Carrito vacío</h2>
          <p className="text-sm text-gray-600 mb-4">No hay productos en tu carrito.</p>
          <Link
            to="/productos"
            className="inline-flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors text-sm"
          >
            <ArrowLeft size={16} />
            <span>Continuar Comprando</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header compacto */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-3 py-3">
          <div className="flex items-center justify-between">
            <Link
              to="/productos"
              className="flex items-center gap-1 text-gray-600 hover:text-primary-600 transition-colors"
            >
              <ArrowLeft size={18} />
              <span className="text-sm font-medium">Volver</span>
            </Link>
            
            <h1 className="text-lg font-bold text-gray-900">Checkout</h1>
            
            <div className="flex items-center gap-1 text-sm text-gray-500">
              <Package size={14} />
              <span>{itemCount}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Pasos de progreso minimalistas */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-3 py-2">
          <div className="flex items-center justify-center gap-4">
            {/* Paso 1 */}
            <div className="flex items-center gap-1">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                currentPhase === 'customer' ? 'bg-primary-500 text-white' : 
                currentPhase === 'payment' || currentPhase === 'confirmation' ? 'bg-green-500 text-white' : 
                'bg-gray-200 text-gray-600'
              }`}>
                {currentPhase === 'payment' || currentPhase === 'confirmation' ? <Check size={12} /> : <User size={12} />}
              </div>
              <span className={`text-xs font-medium ${
                currentPhase === 'customer' ? 'text-primary-600' : 
                currentPhase === 'payment' || currentPhase === 'confirmation' ? 'text-green-600' : 
                'text-gray-500'
              }`}>
                Datos
              </span>
            </div>

            <div className="w-6 h-0.5 bg-gray-200 rounded-full"></div>

            {/* Paso 2 */}
            <div className="flex items-center gap-1">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                currentPhase === 'payment' ? 'bg-primary-500 text-white' : 
                currentPhase === 'confirmation' ? 'bg-green-500 text-white' : 
                'bg-gray-200 text-gray-600'
              }`}>
                {currentPhase === 'confirmation' ? <Check size={12} /> : <CreditCard size={12} />}
              </div>
              <span className={`text-xs font-medium ${
                currentPhase === 'payment' ? 'text-primary-600' : 
                currentPhase === 'confirmation' ? 'text-green-600' : 
                'text-gray-500'
              }`}>
                Pago
              </span>
            </div>

            <div className="w-6 h-0.5 bg-gray-200 rounded-full"></div>

            {/* Paso 3 */}
            <div className="flex items-center gap-1">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                currentPhase === 'confirmation' ? 'bg-primary-500 text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                <Sparkles size={12} />
              </div>
              <span className={`text-xs font-medium ${
                currentPhase === 'confirmation' ? 'text-primary-600' : 'text-gray-500'
              }`}>
                Listo
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-3 py-4">
        <div className="max-w-4xl mx-auto grid lg:grid-cols-3 gap-4">
          {/* Contenido principal más compacto */}
          <div className="lg:col-span-2">
            {/* Fase 1: Datos del cliente */}
            {currentPhase === 'customer' && (
              <div className="bg-white rounded-lg shadow-sm border p-4">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
                    <User className="text-primary-600" size={16} />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">Información de Entrega</h2>
                    <p className="text-xs text-gray-600">Completa tus datos</p>
                  </div>
                </div>

                <form onSubmit={handleCustomerSubmit} className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Nombre *
                      </label>
                      <input
                        type="text"
                        required
                        value={customerData.firstName}
                        onChange={(e) => setCustomerData(prev => ({...prev, firstName: e.target.value}))}
                        className="w-full px-2.5 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-colors"
                        placeholder="Tu nombre"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Apellido *
                      </label>
                      <input
                        type="text"
                        required
                        value={customerData.lastName}
                        onChange={(e) => setCustomerData(prev => ({...prev, lastName: e.target.value}))}
                        className="w-full px-2.5 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-colors"
                        placeholder="Tu apellido"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Email *
                      </label>
                      <input
                        type="email"
                        required
                        value={customerData.email}
                        onChange={(e) => setCustomerData(prev => ({...prev, email: e.target.value}))}
                        className="w-full px-2.5 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-colors"
                        placeholder="tu@email.com"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Teléfono *
                      </label>
                      <input
                        type="tel"
                        required
                        value={customerData.phone}
                        onChange={(e) => setCustomerData(prev => ({...prev, phone: e.target.value}))}
                        className="w-full px-2.5 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-colors"
                        placeholder="123 456 7890"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Dirección de Envío *
                    </label>
                    <input
                      type="text"
                      required
                      value={customerData.address}
                      onChange={(e) => setCustomerData(prev => ({...prev, address: e.target.value}))}
                      className="w-full px-2.5 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-colors"
                      placeholder="Calle, número, colonia"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Ciudad *
                      </label>
                      <input
                        type="text"
                        required
                        value={customerData.city}
                        onChange={(e) => setCustomerData(prev => ({...prev, city: e.target.value}))}
                        className="w-full px-2.5 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-colors"
                        placeholder="Tu ciudad"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        C.P.
                      </label>
                      <input
                        type="text"
                        value={customerData.postalCode}
                        onChange={(e) => setCustomerData(prev => ({...prev, postalCode: e.target.value}))}
                        className="w-full px-2.5 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-colors"
                        placeholder="12345"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Notas (Opcional)
                    </label>
                    <textarea
                      value={customerData.notes}
                      onChange={(e) => setCustomerData(prev => ({...prev, notes: e.target.value}))}
                      rows={2}
                      className="w-full px-2.5 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-colors"
                      placeholder="Instrucciones especiales..."
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-primary-600 text-white font-semibold py-2.5 px-4 rounded-md hover:bg-primary-700 transition-colors flex items-center justify-center gap-2 text-sm"
                  >
                    <span>Continuar</span>
                    <ArrowRight size={16} />
                  </button>
                </form>
              </div>
            )}

            {/* Fase 2: Pago más compacto */}
            {currentPhase === 'payment' && (
              <div className="bg-white rounded-lg shadow-sm border p-4">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
                    <CreditCard className="text-primary-600" size={16} />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">Método de Pago</h2>
                    <p className="text-xs text-gray-600">Elige cómo pagar</p>
                  </div>
                </div>

                <form onSubmit={handlePaymentSubmit} className="space-y-3">
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 p-2.5 border border-gray-200 rounded-md cursor-pointer hover:bg-gray-50 transition-colors">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="cash"
                        checked={paymentData.method === 'cash'}
                        onChange={(e) => setPaymentData(prev => ({...prev, method: e.target.value as 'cash'}))}
                        className="text-primary-600"
                      />
                      <div>
                        <div className="font-medium text-gray-900 text-sm">Efectivo</div>
                        <div className="text-xs text-gray-600">Paga al recibir</div>
                      </div>
                    </label>

                    <label className="flex items-center gap-2 p-2.5 border border-gray-200 rounded-md cursor-pointer hover:bg-gray-50 transition-colors">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="transfer"
                        checked={paymentData.method === 'transfer'}
                        onChange={(e) => setPaymentData(prev => ({...prev, method: e.target.value as 'transfer'}))}
                        className="text-primary-600"
                      />
                      <div>
                        <div className="font-medium text-gray-900 text-sm">Transferencia</div>
                        <div className="text-xs text-gray-600">Te enviaremos los datos</div>
                      </div>
                    </label>

                    <label className="flex items-center gap-2 p-2.5 border border-gray-200 rounded-md cursor-pointer hover:bg-gray-50 transition-colors">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="card"
                        checked={paymentData.method === 'card'}
                        onChange={(e) => setPaymentData(prev => ({...prev, method: e.target.value as 'card'}))}
                        className="text-primary-600"
                      />
                      <div>
                        <div className="font-medium text-gray-900 text-sm">Tarjeta</div>
                        <div className="text-xs text-gray-600">Pago seguro</div>
                      </div>
                    </label>
                  </div>

                  {paymentData.method === 'card' && (
                    <div className="space-y-2 mt-3 p-3 bg-gray-50 rounded-md">
                      <input
                        type="text"
                        placeholder="1234 5678 9012 3456"
                        className="w-full px-2.5 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      />
                      <input
                        type="text"
                        placeholder="Juan Pérez"
                        className="w-full px-2.5 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          placeholder="MM/AA"
                          className="px-2.5 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        />
                        <input
                          type="text"
                          placeholder="CVC"
                          className="px-2.5 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        />
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setCurrentPhase('customer')}
                      className="flex-1 bg-gray-200 text-gray-700 font-medium py-2.5 px-3 rounded-md hover:bg-gray-300 transition-colors flex items-center justify-center gap-1 text-sm"
                    >
                      <ArrowLeft size={14} />
                      Volver
                    </button>
                    <button
                      type="submit"
                      className="flex-1 bg-primary-600 text-white font-medium py-2.5 px-3 rounded-md hover:bg-primary-700 transition-colors flex items-center justify-center gap-1 text-sm"
                    >
                      Confirmar
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Fase 3: Confirmación más compacta */}
            {currentPhase === 'confirmation' && (
              <div className="bg-white rounded-lg shadow-sm border p-4">
                <div className="text-center mb-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Check className="text-green-600" size={24} />
                  </div>
                  <h2 className="text-lg font-bold text-gray-900 mb-1">¡Pedido Confirmado!</h2>
                  <p className="text-sm text-gray-600">Tu pedido ha sido procesado</p>
                  <div className="bg-primary-50 rounded-md px-3 py-1.5 inline-block mt-3">
                    <span className="text-xs font-medium text-gray-700">Orden: </span>
                    <span className="font-bold text-primary-600 text-sm">{orderNumber}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="border border-gray-200 rounded-md p-3">
                    <h3 className="font-semibold text-gray-900 mb-1 text-sm">Entrega</h3>
                    <div className="text-xs text-gray-600 space-y-0.5">
                      <p>{customerData.firstName} {customerData.lastName}</p>
                      <p>{customerData.address}, {customerData.city}</p>
                      <p>{customerData.phone}</p>
                    </div>
                  </div>

                  <div className="border border-gray-200 rounded-md p-3">
                    <h3 className="font-semibold text-gray-900 mb-1 text-sm">Pago</h3>
                    <p className="text-xs text-gray-600">
                      {paymentData.method === 'cash' && 'Efectivo al entregar'}
                      {paymentData.method === 'transfer' && 'Transferencia bancaria'}
                      {paymentData.method === 'card' && 'Tarjeta de crédito'}
                    </p>
                  </div>

                  <div className="bg-green-50 border border-green-200 rounded-md p-3">
                    <h3 className="font-semibold text-green-800 mb-1 text-sm">Siguiente paso</h3>
                    <p className="text-xs text-green-700">Te contactaremos por WhatsApp para coordinar la entrega.</p>
                  </div>

                  <button
                    onClick={handleFinishOrder}
                    className="w-full bg-primary-600 text-white font-semibold py-2.5 rounded-md hover:bg-primary-700 transition-colors text-sm"
                  >
                    Finalizar
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Resumen del pedido compacto */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border p-3 sticky top-20">
              <div className="flex items-center gap-1.5 mb-3">
                <Package className="text-primary-600" size={16} />
                <h3 className="font-bold text-gray-900 text-sm">Tu Pedido</h3>
              </div>
              
              <div className="space-y-2 mb-3">
                {items.map(item => (
                  <div key={item.id} className="flex items-center gap-2 p-2 bg-gray-50 rounded-md">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-8 h-8 object-cover rounded-md"
                      loading="lazy"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 text-xs truncate">{item.name}</h4>
                      <p className="text-xs text-gray-500">x{item.quantity}</p>
                    </div>
                    <div className="text-xs font-semibold text-primary-600">
                      {formatPrice(item.price * item.quantity)}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="border-t pt-3">
                <div className="bg-primary-50 rounded-md p-2.5">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-gray-900 text-sm">Total:</span>
                    <span className="text-lg font-bold text-primary-600">{formatPrice(total)}</span>
                  </div>
                  <p className="text-xs text-gray-600 mt-0.5">
                    {itemCount} producto{itemCount !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>

              {/* Info del negocio compacta */}
              <div className="pt-3 border-t mt-3">
                <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-md">
                  {businessConfig.logo.url ? (
                    <img
                      src={businessConfig.logo.url}
                      alt={businessConfig.logo.alt}
                      className="w-6 h-6 object-contain rounded"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-6 h-6 bg-primary-100 rounded flex items-center justify-center">
                      <span className="text-primary-600 font-bold text-xs">
                        {businessConfig.name.charAt(0)}
                      </span>
                    </div>
                  )}
                  <div>
                    <h4 className="font-medium text-gray-900 text-xs">{businessConfig.name}</h4>
                    <p className="text-xs text-gray-500">Vendedor verificado</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
