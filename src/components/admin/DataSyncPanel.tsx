import React, { useState } from 'react';
import { Download, Upload, Trash2, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

export const DataSyncPanel: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [syncStats, setSyncStats] = useState<{ success: number; errors: number } | null>(null);

  const handleSyncProducts = async () => {
    setLoading(true);
    try {
      // Mock sync functionality - replace with actual implementation
      const stats = { success: 10, errors: 0 };
      setSyncStats(stats);
      toast.success(`Productos sincronizados: ${stats.success} éxitos, ${stats.errors} errores`);
    } catch (error) {
      toast.error('Error sincronizando productos');
    } finally {
      setLoading(false);
    }
  };

  const handleSyncCategories = async () => {
    setLoading(true);
    try {
      // Mock sync functionality - replace with actual implementation
      const stats = { success: 5, errors: 0 };
      setSyncStats(stats);
      toast.success(`Categorías sincronizadas: ${stats.success} éxitos, ${stats.errors} errores`);
    } catch (error) {
      toast.error('Error sincronizando categorías');
    } finally {
      setLoading(false);
    }
  };

  const handleExportData = async () => {
    setLoading(true);
    try {
      // Mock export functionality - replace with actual implementation
      toast.success('Datos exportados correctamente');
    } catch (error) {
      toast.error('Error exportando datos');
    } finally {
      setLoading(false);
    }
  };

  const handleClearData = async () => {
    if (!confirm('¿Estás seguro de que quieres eliminar todos los datos de Supabase?')) {
      return;
    }
    
    setLoading(true);
    try {
      // Mock clear functionality - replace with actual implementation
      toast.success('Datos eliminados correctamente');
    } catch (error) {
      toast.error('Error eliminando datos');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 max-w-2xl mx-auto">
      <h3 className="text-xl font-bold text-neutral-900 mb-6">Panel de Sincronización de Datos</h3>
      
      {syncStats && (
        <div className="mb-6 p-4 bg-primary-50 rounded-lg">
          <p className="text-sm text-primary-800">
            Última sincronización: {syncStats.success} éxitos, {syncStats.errors} errores
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button
          onClick={handleSyncProducts}
          disabled={loading}
          className="flex items-center justify-center gap-2 px-4 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50 transition-colors"
        >
          {loading ? <RefreshCw className="animate-spin" size={16} /> : <Upload size={16} />}
          Sincronizar Productos
        </button>

        <button
          onClick={handleSyncCategories}
          disabled={loading}
          className="flex items-center justify-center gap-2 px-4 py-3 bg-secondary-500 text-white rounded-lg hover:bg-secondary-600 disabled:opacity-50 transition-colors"
        >
          {loading ? <RefreshCw className="animate-spin" size={16} /> : <Upload size={16} />}
          Sincronizar Categorías
        </button>

        <button
          onClick={handleExportData}
          disabled={loading}
          className="flex items-center justify-center gap-2 px-4 py-3 bg-accent-500 text-white rounded-lg hover:bg-accent-600 disabled:opacity-50 transition-colors"
        >
          {loading ? <RefreshCw className="animate-spin" size={16} /> : <Download size={16} />}
          Exportar Datos
        </button>

        <button
          onClick={handleClearData}
          disabled={loading}
          className="flex items-center justify-center gap-2 px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 transition-colors"
        >
          {loading ? <RefreshCw className="animate-spin" size={16} /> : <Trash2 size={16} />}
          Limpiar Datos
        </button>
      </div>

      <div className="mt-6 p-4 bg-neutral-50 rounded-lg">
        <h4 className="font-semibold text-neutral-800 mb-2">Instrucciones:</h4>
        <ul className="text-sm text-neutral-600 space-y-1">
          <li>• <strong>Sincronizar:</strong> Sube los datos locales a Supabase</li>
          <li>• <strong>Exportar:</strong> Descarga todos los datos como JSON</li>
          <li>• <strong>Limpiar:</strong> Elimina todos los datos de Supabase</li>
        </ul>
      </div>
    </div>
  );
};
