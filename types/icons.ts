export interface IconFile {
  name: string;
  filename: string;
  path: string;
  githubPath?: string;
  category: string;
  subcategory: string;
  tag: string;
  svg?: string;
}

export interface IconCategory {
  name: string;
  path: string;
  subcategories: IconSubcategory[];
  iconCount: number;
}

export interface IconSubcategory {
  name: string;
  path: string;
  tags: IconTag[];
  iconCount: number;
}

export interface IconTag {
  name: string;
  path: string;
  icons: IconFile[];
  iconCount: number;
}

export interface SearchResult {
  icons: IconFile[];
  totalCount: number;
  categories: string[];
  tags: string[];
  pagination?: {
    page: number;
    limit: number;
    totalPages: number;
  };
}
