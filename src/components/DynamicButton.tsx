
import React from 'react';
import { motion } from 'framer-motion';
import { useThemeConfigData } from '../contexts/ThemeConfigContext';

interface DynamicButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  title?: string; // Add title prop
}

export const DynamicButton: React.FC<DynamicButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  onClick,
  className = '',
  disabled = false,
  title
}) => {
  const { config } = useThemeConfigData();

  // Default button styles
  const baseStyles = "font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";
  
  // Size variations
  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  };

  // Variant styles (can be overridden by theme config)
  const variantStyles = {
    primary: 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500',
    secondary: 'bg-neutral-200 text-neutral-900 hover:bg-neutral-300 focus:ring-neutral-500',
    outline: 'border-2 border-primary-600 text-primary-600 hover:bg-primary-600 hover:text-white focus:ring-primary-500'
  };

  // Apply theme config if available
  const customStyles = config?.buttons?.variants?.[variant] || '';
  const customSizeStyles = config?.buttons?.sizes?.[size] || '';

  const buttonClasses = `
    ${baseStyles}
    ${customSizeStyles || sizeStyles[size]}
    ${customStyles || variantStyles[variant]}
    ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
    ${className}
  `.trim();

  return (
    <motion.button
      whileHover={disabled ? {} : { scale: 1.02 }}
      whileTap={disabled ? {} : { scale: 0.98 }}
      className={buttonClasses}
      onClick={onClick}
      disabled={disabled}
      title={title}
    >
      {children}
    </motion.button>
  );
};
