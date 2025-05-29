
import { useEffect } from 'react';
import { PaletaService } from '../api/supabase/paleta';
import { BUSINESS_ID } from '../config/business';

export const useBusinessPalette = () => {
  useEffect(() => {
    const load = async () => {
      console.log('🎨 Loading business palette for business ID:', BUSINESS_ID);
      console.log('🎨 Expected business ID should be:', 'b73218d6-186e-4bc0-8956-4b3db300abb4');
      
      // First check all palettes to see what's in the database
      const allPalettes = await PaletaService.getAllPalettes();
      console.log('🎨 Total palettes found:', allPalettes.length);
      
      const data = await PaletaService.getByBusinessId(BUSINESS_ID);
      console.log('📊 Raw palette data received:', JSON.stringify(data, null, 2));
      
      if (!data) {
        console.log('❌ No palette data found for business ID:', BUSINESS_ID);
        console.log('🔧 Applying default gray colors as fallback...');
        
        // Set default colors as fallback
        const root = document.documentElement;
        const defaultColors = {
          '--picton-blue-50': '#f6f6f6',
          '--picton-blue-100': '#e7e7e7',
          '--picton-blue-200': '#d1d1d1',
          '--picton-blue-300': '#b0b0b0',
          '--picton-blue-400': '#888888',
          '--picton-blue-500': '#6d6d6d',
          '--picton-blue-600': '#5c5c5c',
          '--picton-blue-700': '#4f4f4f',
          '--picton-blue-800': '#454545',
          '--picton-blue-900': '#3d3d3d',
          '--picton-blue-950': '#2a2a2a',
        };
        
        Object.entries(defaultColors).forEach(([cssVar, value]) => {
          root.style.setProperty(cssVar, value);
          console.log(`🎯 Setting fallback ${cssVar} to ${value}`);
        });
        return;
      }

      console.log('✅ Palette data found! Applying colors...');
      const root = document.documentElement;
      
      // Map the numeric keys to CSS variables
      const colorMap = {
        '50': '--picton-blue-50',
        '100': '--picton-blue-100',
        '200': '--picton-blue-200',
        '300': '--picton-blue-300',
        '400': '--picton-blue-400',
        '500': '--picton-blue-500',
        '600': '--picton-blue-600',
        '700': '--picton-blue-700',
        '800': '--picton-blue-800',
        '900': '--picton-blue-900',
        '950': '--picton-blue-950',
      };

      console.log('🔄 Applying color mappings from database...');
      let colorsApplied = 0;
      
      Object.entries(colorMap).forEach(([key, cssVar]) => {
        const value = data[key as keyof typeof colorMap];
        if (value && value.trim() !== '') {
          console.log(`✅ Setting ${cssVar} to ${value} (from database key "${key}")`);
          root.style.setProperty(cssVar, value);
          colorsApplied++;
        } else {
          console.log(`⚠️ No value found for key "${key}" in database`);
        }
      });
      
      console.log(`🎨 Palette applied successfully! ${colorsApplied} colors set from database.`);
      
      // Force a style recalculation
      document.body.style.display = 'none';
      document.body.offsetHeight; // trigger reflow
      document.body.style.display = '';
      
      console.log('🔄 Style recalculation forced');
    };

    load();
  }, []);
};
