/**
 * Configuration for icon services
 * This file uses MongoDB as the only data source
 */

// Import icon services
import { DbIconService } from './dbService';

/**
 * Get the icon service (MongoDB only)
 */
export function getIconService() {
  return DbIconService;
}