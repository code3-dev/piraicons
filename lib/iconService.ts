import { IconFile, IconCategory, IconSubcategory, IconTag, SearchResult } from '@/types/icons';
import { logger } from './logger';
import { DbIconService } from './dbService';

/**
 * IconService - MongoDB-based icon service
 * 
 * This class is a wrapper around DbIconService to maintain compatibility with existing code
 * while ensuring all data is sourced from MongoDB.
 */
export class IconService {
  /**
   * Get all icons from the database
   */
  static async getAllIcons(): Promise<IconFile[]> {
    logger.info('Getting all icons from MongoDB');
    return DbIconService.getAllIcons();
  }

  /**
   * Get all categories with their subcategories and tags from the database
   */
  static async getCategories(): Promise<IconCategory[]> {
    logger.info('Getting categories from MongoDB');
    return DbIconService.getCategories();
  }

  /**
   * Get category structure without loading icons (faster)
   */
  static async getCategoryStructure(): Promise<IconCategory[]> {
    logger.info('Getting category structure from MongoDB');
    return DbIconService.getCategoryStructure();
  }

  /**
   * Search icons in the database
   */
  static async searchIcons(query: string, filters?: {
    category?: string;
    subcategory?: string;
    tag?: string;
    page?: number;
    limit?: number;
  }): Promise<SearchResult> {
    logger.info('Searching icons in MongoDB');
    return DbIconService.searchIcons(query, filters);
  }

  /**
   * Fast search icons in the database (optimized version)
   */
  static async fastSearchIcons(query: string, filters?: {
    category?: string;
    subcategory?: string;
    tag?: string;
    page?: number;
    limit?: number;
  }): Promise<SearchResult> {
    logger.info('Fast searching icons in MongoDB');
    return DbIconService.fastSearchIcons(query, filters);
  }

  /**
   * Get icon SVG from the database
   */
  static async getIconSvg(iconPath: string): Promise<string | null> {
    return DbIconService.getIconSvg(iconPath);
  }

  /**
   * Get lightweight categories (no subcategories or icons)
   */
  static async getLightCategories() {
    return DbIconService.getLightCategories();
  }

  /**
   * Get lightweight subcategories for a specific category
   */
  static async getLightSubcategories(categoryName?: string) {
    return DbIconService.getLightSubcategories(categoryName);
  }

  /**
   * Get lightweight tags for a specific category and/or subcategory
   */
  static async getLightTags(categoryName?: string, subcategoryName?: string) {
    return DbIconService.getLightTags(categoryName, subcategoryName);
  }
}