
/**
 * Sistema de backup automático de configuraciones
 * @module Backup
 */

import { logger } from './logger';
import { analytics } from './analytics';

export interface BackupData {
  timestamp: Date;
  version: string;
  data: {
    theme?: any;
    userPreferences?: any;
    cartData?: any;
    analytics?: any;
  };
}

class BackupManager {
  private readonly BACKUP_KEY = 'app-backup-data';
  private readonly MAX_BACKUPS = 5;

  /**
   * Crear backup de la configuración actual
   */
  async createBackup(): Promise<boolean> {
    try {
      const backupData: BackupData = {
        timestamp: new Date(),
        version: '2.1.0',
        data: {
          theme: this.getThemeData(),
          userPreferences: this.getUserPreferences(),
          cartData: this.getCartData(),
          analytics: analytics.getSessionMetrics()
        }
      };

      await this.saveBackup(backupData);
      logger.info('Backup creado exitosamente', { timestamp: backupData.timestamp });
      return true;
    } catch (error) {
      logger.error('Error al crear backup', { error });
      return false;
    }
  }

  /**
   * Restaurar configuración desde backup
   */
  async restoreBackup(backupId: string): Promise<boolean> {
    try {
      const backups = await this.getBackups();
      const backup = backups.find(b => b.timestamp.toISOString() === backupId);
      
      if (!backup) {
        throw new Error('Backup no encontrado');
      }

      await this.applyBackup(backup);
      logger.info('Backup restaurado exitosamente', { backupId });
      return true;
    } catch (error) {
      logger.error('Error al restaurar backup', { error, backupId });
      return false;
    }
  }

  /**
   * Obtener lista de backups disponibles
   */
  async getBackups(): Promise<BackupData[]> {
    try {
      const stored = localStorage.getItem(this.BACKUP_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      logger.warn('Error al obtener backups', { error });
      return [];
    }
  }

  /**
   * Limpiar backups antiguos
   */
  async cleanOldBackups(): Promise<void> {
    try {
      const backups = await this.getBackups();
      const sortedBackups = backups.sort((a, b) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );

      if (sortedBackups.length > this.MAX_BACKUPS) {
        const keepBackups = sortedBackups.slice(0, this.MAX_BACKUPS);
        localStorage.setItem(this.BACKUP_KEY, JSON.stringify(keepBackups));
        logger.info(`Limpiados ${sortedBackups.length - this.MAX_BACKUPS} backups antiguos`);
      }
    } catch (error) {
      logger.error('Error al limpiar backups antiguos', { error });
    }
  }

  /**
   * Exportar backup como archivo
   */
  exportBackup(backup: BackupData): void {
    try {
      const blob = new Blob([JSON.stringify(backup, null, 2)], { 
        type: 'application/json' 
      });
      
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `picton-blue-style-backup-${backup.timestamp.toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      logger.info('Backup exportado exitosamente');
    } catch (error) {
      logger.error('Error al exportar backup', { error });
    }
  }

  /**
   * Programar backup automático
   */
  scheduleAutoBackup(): void {
    // Crear backup cada 24 horas
    const BACKUP_INTERVAL = 24 * 60 * 60 * 1000; // 24 horas

    setInterval(async () => {
      await this.createBackup();
      await this.cleanOldBackups();
    }, BACKUP_INTERVAL);

    logger.info('Backup automático programado cada 24 horas');
  }

  private async saveBackup(backup: BackupData): Promise<void> {
    const backups = await this.getBackups();
    backups.push(backup);
    localStorage.setItem(this.BACKUP_KEY, JSON.stringify(backups));
  }

  private async applyBackup(backup: BackupData): Promise<void> {
    const { data } = backup;

    // Restaurar tema
    if (data.theme) {
      localStorage.setItem('theme-config', JSON.stringify(data.theme));
    }

    // Restaurar preferencias
    if (data.userPreferences) {
      localStorage.setItem('user-preferences', JSON.stringify(data.userPreferences));
    }

    // Nota: El carrito se maneja en el contexto, no se restaura automáticamente
    // por seguridad
  }

  private getThemeData(): any {
    try {
      const saved = localStorage.getItem('theme-config');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  }

  private getUserPreferences(): any {
    try {
      const saved = localStorage.getItem('user-preferences');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  }

  private getCartData(): any {
    try {
      const saved = localStorage.getItem('cart-items');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  }
}

export const backupManager = new BackupManager();

/**
 * Hook para usar el sistema de backup
 */
export function useBackup() {
  return {
    createBackup: () => backupManager.createBackup(),
    restoreBackup: (id: string) => backupManager.restoreBackup(id),
    getBackups: () => backupManager.getBackups(),
    exportBackup: (backup: BackupData) => backupManager.exportBackup(backup),
    scheduleAutoBackup: () => backupManager.scheduleAutoBackup()
  };
}
