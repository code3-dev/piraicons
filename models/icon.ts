import mongoose, { Schema } from 'mongoose';
import { IconFile, IconCategory, IconSubcategory, IconTag } from '@/types/icons';

// Icon Schema
const IconFileSchema = new Schema<IconFile>({
  name: { type: String, required: true },
  filename: { type: String, required: true },
  path: { type: String, required: true },
  githubPath: { type: String },
  category: { type: String, required: true },
  subcategory: { type: String, required: true },
  tag: { type: String, required: true },
  svg: { type: String }
}, { timestamps: true });

// Tag Schema
const IconTagSchema = new Schema<IconTag>({
  name: { type: String, required: true },
  path: { type: String, required: true },
  iconCount: { type: Number, required: true, default: 0 }
}, { timestamps: true });

// Subcategory Schema
const IconSubcategorySchema = new Schema<IconSubcategory>({
  name: { type: String, required: true },
  path: { type: String, required: true },
  iconCount: { type: Number, required: true, default: 0 }
}, { timestamps: true });

// Category Schema
const IconCategorySchema = new Schema<IconCategory>({
  name: { type: String, required: true },
  path: { type: String, required: true },
  iconCount: { type: Number, required: true, default: 0 }
}, { timestamps: true });

// Export models
export const IconFileModel = mongoose.models.IconFile || mongoose.model<IconFile>('IconFile', IconFileSchema);
export const IconTagModel = mongoose.models.IconTag || mongoose.model<IconTag>('IconTag', IconTagSchema);
export const IconSubcategoryModel = mongoose.models.IconSubcategory || mongoose.model<IconSubcategory>('IconSubcategory', IconSubcategorySchema);
export const IconCategoryModel = mongoose.models.IconCategory || mongoose.model<IconCategory>('IconCategory', IconCategorySchema);