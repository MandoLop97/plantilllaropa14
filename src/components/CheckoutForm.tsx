import React, { useState } from 'react';
import { useCart } from '../contexts/CartContext';
import { Tag, X } from 'lucide-react';
import { motion } from 'framer-motion';

interface CheckoutFormProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CheckoutForm: React.FC<CheckoutFormProps> = ({ isOpen, onClose }) => {
  const { items, total, clearCart } = useCart();
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [discount, setDiscount] = useState(0);
  const [couponError, setCouponError] = useState('');

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

  const handleWhatsAppCheckout = () => {
    if (items.length === 0) return;

    const orderSummary = items.map(item => 
      `- ${item.quantity}x ${item.name} ($${item.price * item.quantity})`
    ).join('\n');

    let message = `Hola, quiero hacer este pedido:\n${orderSummary}\n\nSubtotal: $${total}`;
    
    if (appliedCoupon) {
      message += `\nCupón aplicado: ${appliedCoupon} (-${discount}%)\nDescuento: -$${discountAmount.toFixed(2)}`;
    }
    
    message += `\nTotal: $${finalTotal.toFixed(2)}`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/5491234567890?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
    clearCart();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose}></div>
      
      {/* Checkout Panel */}
      <div className="relative ml-auto w-full max-w-md bg-white h-full flex flex-col animate-fade-in overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b sticky top-0 bg-white z-10">
          <h2 className="text-lg font-semibold">Checkout</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 p-4 space-y-6">
          {/* Order Summary */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Resumen del pedido</h3>
            <div className="space-y-3">
              {items.map(item => (
                <div key={item.id} className="flex items-center space-x-3 bg-gray-50 rounded-lg p-3">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 truncate text-sm">{item.name}</h4>
                    <p className="text-sm text-gray-600">${item.price} x {item.quantity}</p>
                  </div>
                  <div className="text-sm font-semibold text-gray-900">
                    ${(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Coupon Section */}
          <div className="border rounded-lg p-4 bg-gray-50">
            <div className="flex items-center gap-2 mb-3">
              <Tag size={18} className="text-urban-500" />
              <h3 className="font-semibold text-gray-900">Cupón de descuento</h3>
            </div>
            
            {!appliedCoupon ? (
              <div className="space-y-3">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    placeholder="Ingresa tu código"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-urban-500 text-sm"
                    onKeyPress={(e) => e.key === 'Enter' && handleApplyCoupon()}
                  />
                  <button
                    onClick={handleApplyCoupon}
                    className="px-4 py-2 bg-urban-500 text-white rounded-lg hover:bg-urban-600 transition-colors text-sm font-medium"
                  >
                    Aplicar
                  </button>
                </div>
                {couponError && (
                  <p className="text-red-500 text-sm">{couponError}</p>
                )}
                <div className="text-xs text-gray-500">
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
            <div className="flex justify-between text-gray-600">
              <span>Subtotal:</span>
              <span>${total.toFixed(2)}</span>
            </div>
            {appliedCoupon && (
              <div className="flex justify-between text-green-600">
                <span>Descuento ({discount}%):</span>
                <span>-${discountAmount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-lg font-bold text-gray-900 border-t pt-2">
              <span>Total:</span>
              <span>${finalTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t p-4 bg-white sticky bottom-0">
          <button
            onClick={handleWhatsAppCheckout}
            className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold py-3 rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-200 flex items-center justify-center space-x-2"
            disabled={items.length === 0}
          >
            <span>Continuar con WhatsApp</span>
            <span>${finalTotal.toFixed(2)}</span>
          </button>
        </div>
      </div>
    </div>
  );
};