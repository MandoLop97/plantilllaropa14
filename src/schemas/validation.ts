
/**
 * Esquemas de validación con Zod para mayor robustez de datos
 * @module Validation
 */

import { z } from 'zod';

/**
 * Schema para validación de productos
 */
export const ProductSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string()
    .min(1, 'El nombre es requerido')
    .max(100, 'El nombre debe tener máximo 100 caracteres')
    .transform(val => val.trim()),
  description: z.string()
    .max(500, 'La descripción debe tener máximo 500 caracteres')
    .optional()
    .transform(val => val?.trim()),
  price: z.number()
    .min(0, 'El precio debe ser mayor o igual a 0')
    .max(999999, 'El precio es demasiado alto'),
  originalPrice: z.number()
    .min(0, 'El precio original debe ser mayor o igual a 0')
    .optional(),
  image: z.string()
    .url('La imagen debe ser una URL válida')
    .or(z.string().startsWith('/placeholder'))
    .transform(val => val.trim()),
  category: z.string()
    .min(1, 'La categoría es requerida')
    .transform(val => val.trim()),
  sku: z.string().optional(),
  discount: z.number()
    .min(0, 'El descuento debe ser mayor o igual a 0')
    .max(100, 'El descuento no puede ser mayor al 100%')
    .optional()
});

/**
 * Schema para validación de categorías
 */
export const CategorySchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string()
    .min(1, 'El nombre es requerido')
    .max(50, 'El nombre debe tener máximo 50 caracteres')
    .transform(val => val.trim()),
  icon: z.string()
    .min(1, 'El icono es requerido')
    .max(10, 'El icono debe tener máximo 10 caracteres')
    .optional()
});

/**
 * Schema para filtros de productos
 */
export const ProductFiltersSchema = z.object({
  category: z.string().optional(),
  priceRange: z.tuple([z.number().min(0), z.number().min(0)]),
  sortBy: z.enum(['name', 'price-asc', 'price-desc', 'discount']),
  searchQuery: z.string().max(100, 'La búsqueda debe tener máximo 100 caracteres').optional()
});

/**
 * Schema para configuración de negocio
 */
export const BusinessConfigSchema = z.object({
  name: z.string()
    .min(1, 'El nombre es requerido')
    .max(100, 'El nombre debe tener máximo 100 caracteres'),
  description: z.string()
    .max(500, 'La descripción debe tener máximo 500 caracteres')
    .optional(),
  whatsapp: z.string()
    .regex(/^\+?[1-9]\d{1,14}$/, 'Número de WhatsApp inválido'),
  logo: z.object({
    url: z.string().url('La URL del logo debe ser válida'),
    alt: z.string().min(1, 'El texto alternativo es requerido')
  })
});

/**
 * Función helper para validación segura
 */
export function validateData<T>(schema: z.ZodSchema<T>, data: unknown): {
  success: boolean;
  data?: T;
  errors?: string[];
} {
  try {
    const validatedData = schema.parse(data);
    return { success: true, data: validatedData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.errors.map(err => `${err.path.join('.')}: ${err.message}`);
      return { success: false, errors };
    }
    return { success: false, errors: ['Error de validación desconocido'] };
  }
}

/**
 * Función para sanitizar datos de entrada
 */
export function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remover caracteres HTML básicos
    .replace(/javascript:/gi, '') // Remover javascript: URLs
    .slice(0, 1000); // Limitar longitud
}

/**
 * Función para validar URLs de manera segura
 */
export function isValidUrl(url: string): boolean {
  try {
    const urlObj = new URL(url);
    return ['http:', 'https:'].includes(urlObj.protocol);
  } catch {
    return false;
  }
}
