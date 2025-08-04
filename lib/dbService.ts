import { connectToDatabase } from './mongodb';
import { IconCategoryModel, IconSubcategoryModel, IconTagModel, IconFileModel } from '@/models/icon';
import { IconFile, IconCategory, IconSubcategory, IconTag, SearchResult } from '@/types/icons';
import { logger } from './logger';

// Define lightweight interfaces for faster loading
interface LightCategory {
  name: string;
  path: string;
  iconCount: number;
}

interface LightSubcategory {
  name: string;
  path: string;
  iconCount: number;
  categoryName: string;
}

interface LightTag {
  name: string;
  path: string;
  iconCount: number;
  categoryName: string;
  subcategoryName: string;
}

export class DbIconService {
  // Get all icons from the database
  static async getAllIcons(): Promise<IconFile[]> {
    try {
      await connectToDatabase();
      const icons = await IconFileModel.find({}).lean();
      
      // Map Mongoose documents to IconFile interface
      return icons.map(icon => ({
        name: icon.name,
        filename: icon.filename,
        path: icon.path,
        githubPath: this.transformIconPathToGithubUrl(icon.path),
        category: icon.category,
        subcategory: icon.subcategory,
        tag: icon.tag,
        svg: icon.svg
      }));
    } catch (error) {
      logger.error('Error getting all icons from DB:', error);
      return [];
    }
  }

  // Get all categories from the database
  static async getCategories(): Promise<IconCategory[]> {
    try {
      await connectToDatabase();
      
      // Get all categories
      const categories = await IconCategoryModel.find({}).lean();
      
      // For each category, get its subcategories
      const result: IconCategory[] = [];
      
      for (const category of categories) {
        // Get subcategories for this category
        const subcategories = await IconSubcategoryModel.find({
          path: new RegExp(`^\/${category.name.toLowerCase()}\/.+`)
        }).lean();
        
        const subcategoryResults: IconSubcategory[] = [];
        
        // For each subcategory, get its tags
        for (const subcategory of subcategories) {
          // Get tags for this subcategory
          const tags = await IconTagModel.find({
            path: new RegExp(`^${subcategory.path}\/.+`)
          }).lean();
          
          const tagResults: IconTag[] = [];
          
          // For each tag, get its icons
          for (const tag of tags) {
            // Get icons for this tag
            const icons = await IconFileModel.find({
              category: category.name,
              subcategory: subcategory.name.split('/').pop(),
              tag: tag.name
            }).lean();
            
            // Map Mongoose documents to IconFile interface
            const mappedIcons = icons.map(icon => ({
              name: icon.name,
              filename: icon.filename,
              path: icon.path,
              githubPath: this.transformIconPathToGithubUrl(icon.path),
              category: icon.category,
              subcategory: icon.subcategory,
              tag: icon.tag,
              svg: icon.svg
            }));
            
            tagResults.push({
              name: tag.name,
              path: tag.path,
              icons: mappedIcons,
              iconCount: icons.length
            });
          }
          
          subcategoryResults.push({
            name: subcategory.name,
            path: subcategory.path,
            tags: tagResults,
            iconCount: tagResults.reduce((sum, tag) => sum + tag.iconCount, 0)
          });
        }
        
        result.push({
          name: category.name,
          path: category.path,
          subcategories: subcategoryResults,
          iconCount: subcategoryResults.reduce((sum, sub) => sum + sub.iconCount, 0)
        });
      }
      
      return result;
    } catch (error) {
      logger.error('Error getting categories from DB:', error);
      return [];
    }
  }

  // Search icons in the database
  static async searchIcons(query: string, filters?: {
    category?: string;
    subcategory?: string;
    tag?: string;
  }): Promise<SearchResult> {
    try {
      await connectToDatabase();
      
      // Build the search query
      const searchQuery: any = {};
      
      if (filters?.category) {
        searchQuery.category = new RegExp(filters.category, 'i');
      }
      
      if (filters?.subcategory) {
        searchQuery.subcategory = new RegExp(filters.subcategory, 'i');
      }
      
      if (filters?.tag) {
        searchQuery.tag = new RegExp(filters.tag.replace(/-/g, ' '), 'i');
      }
      
      if (query) {
        // Escape special regex characters to handle searches with +, ., *, etc.
        const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        searchQuery.$or = [
          { name: new RegExp(escapedQuery, 'i') },
          { category: new RegExp(escapedQuery, 'i') },
          { subcategory: new RegExp(escapedQuery, 'i') },
          { tag: new RegExp(escapedQuery, 'i') }
        ];
      }
      
      // Execute the search
      const icons = await IconFileModel.find(searchQuery).lean();
      
      // Map Mongoose documents to IconFile interface
      const mappedIcons = icons.map(icon => ({
        name: icon.name,
        filename: icon.filename,
        path: icon.path,
        githubPath: this.transformIconPathToGithubUrl(icon.path),
        category: icon.category,
        subcategory: icon.subcategory,
        tag: icon.tag,
        svg: icon.svg
      }));
      
      return {
        icons: mappedIcons,
        totalCount: icons.length,
        categories: Array.from(new Set(icons.map(icon => icon.category))),
        tags: Array.from(new Set(icons.map(icon => icon.tag)))
      };
    } catch (error) {
      logger.error('Error searching icons in DB:', error);
      return {
        icons: [],
        totalCount: 0,
        categories: [],
        tags: []
      };
    }
  }

  // Get icon SVG from the database
  static async getIconSvg(iconPath: string): Promise<string | null> {
    try {
      await connectToDatabase();
      const icon = await IconFileModel.findOne({ path: iconPath }).lean();
      return icon && 'svg' in icon ? icon.svg || null : null;
    } catch (error) {
      logger.error('Error getting icon SVG from DB:', error);
      return null;
    }
  }
  
  // Transform local icon path to GitHub URL
  static transformIconPathToGithubUrl(iconPath: string): string {
    // Remove '/assets/' prefix if present
    const cleanPath = iconPath.replace(/^\/assets\//, '');
    
    // Construct GitHub raw URL
    return `https://raw.githubusercontent.com/code3-dev/piraicons-assets/refs/heads/master/${cleanPath}`;
  }

  // Fast search icons in the database (optimized version that doesn't load SVG content)
  static async fastSearchIcons(query: string, filters?: {
    category?: string;
    subcategory?: string;
    tag?: string;
  }): Promise<SearchResult> {
    try {
      await connectToDatabase();
      
      // Build the search query
      const searchQuery: any = {};
      
      if (filters?.category) {
        searchQuery.category = new RegExp(filters.category, 'i');
      }
      
      if (filters?.subcategory) {
        searchQuery.subcategory = new RegExp(filters.subcategory, 'i');
      }
      
      if (filters?.tag) {
        searchQuery.tag = new RegExp(filters.tag.replace(/-/g, ' '), 'i');
      }
      
      if (query) {
        // Escape special regex characters to handle searches with +, ., *, etc.
        const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        searchQuery.$or = [
          { name: new RegExp(escapedQuery, 'i') },
          { category: new RegExp(escapedQuery, 'i') },
          { subcategory: new RegExp(escapedQuery, 'i') },
          { tag: new RegExp(escapedQuery, 'i') }
        ];
      }
      
      // Execute the search but exclude the SVG content for faster loading
      const icons = await IconFileModel.find(searchQuery, { svg: 0 }).lean();
      
      // Map Mongoose documents to IconFile interface
      const mappedIcons = icons.map(icon => ({
        name: icon.name,
        filename: icon.filename,
        path: icon.path,
        githubPath: this.transformIconPathToGithubUrl(icon.path),
        category: icon.category,
        subcategory: icon.subcategory,
        tag: icon.tag
        // SVG is intentionally excluded for faster loading
      }));
      
      return {
        icons: mappedIcons,
        totalCount: icons.length,
        categories: Array.from(new Set(icons.map(icon => icon.category))),
        tags: Array.from(new Set(icons.map(icon => icon.tag)))
      };
    } catch (error) {
      logger.error('Error fast searching icons in DB:', error);
      return {
        icons: [],
        totalCount: 0,
        categories: [],
        tags: []
      };
    }
  }

  // Fast loading methods for categories, subcategories, and tags
  
  // Get all categories with minimal data (no subcategories or icons)
  static async getLightCategories(): Promise<LightCategory[]> {
    try {
      await connectToDatabase();
      const categories = await IconCategoryModel.find({}).lean();
      
      return categories.map(category => ({
        name: category.name,
        path: category.path,
        iconCount: category.iconCount
      }));
    } catch (error) {
      logger.error('Error getting light categories from DB:', error);
      return [];
    }
  }

  // Get all subcategories for a specific category with minimal data
  static async getLightSubcategories(categoryName?: string): Promise<LightSubcategory[]> {
    try {
      await connectToDatabase();
      
      let query = {};
      if (categoryName) {
        // If category name is provided, filter subcategories by category path
        query = { path: new RegExp(`^\/${categoryName.toLowerCase()}\/`) };
      }
      
      const subcategories = await IconSubcategoryModel.find(query).lean();
      
      return subcategories.map(subcategory => {
        // Extract category name from path (e.g., /rounded/action -> rounded)
        const pathParts = subcategory.path.split('/');
        const categoryName = pathParts[1] || '';
        
        return {
          name: subcategory.name,
          path: subcategory.path,
          iconCount: subcategory.iconCount,
          categoryName: categoryName
        };
      });
    } catch (error) {
      logger.error('Error getting light subcategories from DB:', error);
      return [];
    }
  }

  // Get all tags for a specific category and/or subcategory with minimal data
  static async getLightTags(categoryName?: string, subcategoryName?: string): Promise<LightTag[]> {
    try {
      await connectToDatabase();
      
      let query = {};
      if (categoryName && subcategoryName) {
        // If both category and subcategory names are provided
        query = { path: new RegExp(`^\/${categoryName.toLowerCase()}\/${subcategoryName.toLowerCase()}\/`) };
      } else if (categoryName) {
        // If only category name is provided
        query = { path: new RegExp(`^\/${categoryName.toLowerCase()}\/`) };
      }
      
      const tags = await IconTagModel.find(query).lean();
      
      return tags.map(tag => {
        // Extract category and subcategory names from path (e.g., /rounded/action/basic -> rounded, action)
        const pathParts = tag.path.split('/');
        const categoryName = pathParts[1] || '';
        const subcategoryName = pathParts[2] || '';
        
        return {
          name: tag.name,
          path: tag.path,
          iconCount: tag.iconCount,
          categoryName: categoryName,
          subcategoryName: subcategoryName
        };
      });
    } catch (error) {
      logger.error('Error getting light tags from DB:', error);
      return [];
    }
  }
  
  // Get structure with categories, subcategories, and tags (without icons)
  static async getCategoryStructure(): Promise<IconCategory[]> {
    try {
      await connectToDatabase();
      
      // Get all categories
      const categories = await IconCategoryModel.find({}).lean();
      
      // For each category, get its subcategories
      const result: IconCategory[] = [];
      
      for (const category of categories) {
        // Get subcategories for this category
        const subcategories = await IconSubcategoryModel.find({
          path: new RegExp(`^\/${category.name.toLowerCase()}\/`)
        }).lean();
        
        const subcategoryResults: IconSubcategory[] = [];
        
        // For each subcategory, get its tags
        for (const subcategory of subcategories) {
          // Get tags for this subcategory
          const tags = await IconTagModel.find({
            path: new RegExp(`^${subcategory.path}\/`)
          }).lean();
          
          const tagResults: IconTag[] = [];
          
          // Add tags without loading icons
          for (const tag of tags) {
            tagResults.push({
              name: tag.name,
              path: tag.path,
              icons: [], // Empty array instead of loading icons
              iconCount: tag.iconCount
            });
          }
          
          subcategoryResults.push({
            name: subcategory.name,
            path: subcategory.path,
            tags: tagResults,
            iconCount: subcategory.iconCount
          });
        }
        
        result.push({
          name: category.name,
          path: category.path,
          subcategories: subcategoryResults,
          iconCount: category.iconCount
        });
      }
      
      return result;
    } catch (error) {
      logger.error('Error getting category structure from DB:', error);
      return [];
    }
  }
}