
import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, Building2 } from 'lucide-react';

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

interface CustomerFormProps {
  onSubmit: (customerData: CustomerData) => void;
  isLoading?: boolean;
}

export const CustomerForm: React.FC<CustomerFormProps> = ({ onSubmit, isLoading = false }) => {
  const [formData, setFormData] = useState<CustomerData>({
    nombre: '',
    apellido: '',
    telefono: '',
    email: '',
    direccion_envio: '',
    ciudad: '',
    codigo_postal: '',
    pais: 'México'
  });

  const [errors, setErrors] = useState<Partial<CustomerData>>({});

  const validateForm = () => {
    const newErrors: Partial<CustomerData> = {};

    if (!formData.nombre.trim()) newErrors.nombre = 'El nombre es requerido';
    if (!formData.apellido.trim()) newErrors.apellido = 'El apellido es requerido';
    if (!formData.telefono.trim()) newErrors.telefono = 'El teléfono es requerido';
    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'El email no es válido';
    }
    if (!formData.direccion_envio.trim()) newErrors.direccion_envio = 'La dirección es requerida';
    if (!formData.ciudad.trim()) newErrors.ciudad = 'La ciudad es requerida';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleChange = (field: keyof CustomerData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="text-lg font-semibold text-neutral-900 mb-4">Datos de contacto</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1">
            <User size={16} className="inline mr-1" />
            Nombre *
          </label>
          <input
            type="text"
            value={formData.nombre}
            onChange={(e) => handleChange('nombre', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
              errors.nombre ? 'border-red-500' : 'border-neutral-300'
            }`}
            placeholder="Tu nombre"
          />
          {errors.nombre && <p className="text-red-500 text-xs mt-1">{errors.nombre}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1">
            <User size={16} className="inline mr-1" />
            Apellido *
          </label>
          <input
            type="text"
            value={formData.apellido}
            onChange={(e) => handleChange('apellido', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
              errors.apellido ? 'border-red-500' : 'border-neutral-300'
            }`}
            placeholder="Tu apellido"
          />
          {errors.apellido && <p className="text-red-500 text-xs mt-1">{errors.apellido}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1">
            <Phone size={16} className="inline mr-1" />
            Teléfono *
          </label>
          <input
            type="tel"
            value={formData.telefono}
            onChange={(e) => handleChange('telefono', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
              errors.telefono ? 'border-red-500' : 'border-neutral-300'
            }`}
            placeholder="Tu número de teléfono"
          />
          {errors.telefono && <p className="text-red-500 text-xs mt-1">{errors.telefono}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1">
            <Mail size={16} className="inline mr-1" />
            Email *
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
              errors.email ? 'border-red-500' : 'border-neutral-300'
            }`}
            placeholder="tu@email.com"
          />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
        </div>
      </div>

      <h3 className="text-lg font-semibold text-neutral-900 mb-4 mt-6">Datos de envío</h3>

      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-1">
          <MapPin size={16} className="inline mr-1" />
          Dirección de envío *
        </label>
        <input
          type="text"
          value={formData.direccion_envio}
          onChange={(e) => handleChange('direccion_envio', e.target.value)}
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
            errors.direccion_envio ? 'border-red-500' : 'border-neutral-300'
          }`}
          placeholder="Calle, número, colonia"
        />
        {errors.direccion_envio && <p className="text-red-500 text-xs mt-1">{errors.direccion_envio}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1">
            <Building2 size={16} className="inline mr-1" />
            Ciudad *
          </label>
          <input
            type="text"
            value={formData.ciudad}
            onChange={(e) => handleChange('ciudad', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
              errors.ciudad ? 'border-red-500' : 'border-neutral-300'
            }`}
            placeholder="Tu ciudad"
          />
          {errors.ciudad && <p className="text-red-500 text-xs mt-1">{errors.ciudad}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1">
            Código Postal
          </label>
          <input
            type="text"
            value={formData.codigo_postal}
            onChange={(e) => handleChange('codigo_postal', e.target.value)}
            className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="12345"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1">
            País
          </label>
          <select
            value={formData.pais}
            onChange={(e) => handleChange('pais', e.target.value)}
            className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="México">México</option>
            <option value="Estados Unidos">Estados Unidos</option>
            <option value="Guatemala">Guatemala</option>
            <option value="Colombia">Colombia</option>
            <option value="Argentina">Argentina</option>
          </select>
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-primary-500 text-white font-semibold py-3 rounded-xl hover:bg-primary-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed mt-6"
      >
        {isLoading ? 'Procesando...' : 'Continuar con el pedido'}
      </button>
    </form>
  );
};
