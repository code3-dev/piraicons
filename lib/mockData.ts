import { IconCategory, IconFile } from '@/types/icons';

// Mock data for the debug page to avoid GitHub API calls during build
export const mockCategories: IconCategory[] = [
  {
    name: 'Rounded',
    path: '/rounded',
    iconCount: 120,
    subcategories: [
      {
        name: 'Linear',
        path: '/rounded/linear',
        iconCount: 40,
        tags: [
          {
            name: 'Home',
            path: '/rounded/linear/home',
            iconCount: 10,
            icons: Array(10).fill(0).map((_, i) => ({
              name: `home-${i + 1}`,
              filename: `home-${i + 1}.svg`,
              path: `/rounded/linear/home/home-${i + 1}.svg`,
              category: 'Rounded',
              subcategory: 'Linear',
              tag: 'Home'
            }))
          },
          {
            name: 'User',
            path: '/rounded/linear/user',
            iconCount: 15,
            icons: Array(15).fill(0).map((_, i) => ({
              name: `user-${i + 1}`,
              filename: `user-${i + 1}.svg`,
              path: `/rounded/linear/user/user-${i + 1}.svg`,
              category: 'Rounded',
              subcategory: 'Linear',
              tag: 'User'
            }))
          },
          {
            name: 'Settings',
            path: '/rounded/linear/settings',
            iconCount: 15,
            icons: Array(15).fill(0).map((_, i) => ({
              name: `settings-${i + 1}`,
              filename: `settings-${i + 1}.svg`,
              path: `/rounded/linear/settings/settings-${i + 1}.svg`,
              category: 'Rounded',
              subcategory: 'Linear',
              tag: 'Settings'
            }))
          }
        ]
      },
      {
        name: 'Bulk',
        path: '/rounded/bulk',
        iconCount: 40,
        tags: [
          {
            name: 'Home',
            path: '/rounded/bulk/home',
            iconCount: 10,
            icons: Array(10).fill(0).map((_, i) => ({
              name: `home-${i + 1}`,
              filename: `home-${i + 1}.svg`,
              path: `/rounded/bulk/home/home-${i + 1}.svg`,
              category: 'Rounded',
              subcategory: 'Bulk',
              tag: 'Home'
            }))
          },
          {
            name: 'User',
            path: '/rounded/bulk/user',
            iconCount: 15,
            icons: Array(15).fill(0).map((_, i) => ({
              name: `user-${i + 1}`,
              filename: `user-${i + 1}.svg`,
              path: `/rounded/bulk/user/user-${i + 1}.svg`,
              category: 'Rounded',
              subcategory: 'Bulk',
              tag: 'User'
            }))
          },
          {
            name: 'Settings',
            path: '/rounded/bulk/settings',
            iconCount: 15,
            icons: Array(15).fill(0).map((_, i) => ({
              name: `settings-${i + 1}`,
              filename: `settings-${i + 1}.svg`,
              path: `/rounded/bulk/settings/settings-${i + 1}.svg`,
              category: 'Rounded',
              subcategory: 'Bulk',
              tag: 'Settings'
            }))
          }
        ]
      }
    ]
  },
  {
    name: 'Sharp',
    path: '/sharp',
    iconCount: 120,
    subcategories: [
      {
        name: 'Linear',
        path: '/sharp/linear',
        iconCount: 40,
        tags: [
          {
            name: 'Home',
            path: '/sharp/linear/home',
            iconCount: 10,
            icons: Array(10).fill(0).map((_, i) => ({
              name: `home-${i + 1}`,
              filename: `home-${i + 1}.svg`,
              path: `/sharp/linear/home/home-${i + 1}.svg`,
              category: 'Sharp',
              subcategory: 'Linear',
              tag: 'Home'
            }))
          },
          {
            name: 'User',
            path: '/sharp/linear/user',
            iconCount: 15,
            icons: Array(15).fill(0).map((_, i) => ({
              name: `user-${i + 1}`,
              filename: `user-${i + 1}.svg`,
              path: `/sharp/linear/user/user-${i + 1}.svg`,
              category: 'Sharp',
              subcategory: 'Linear',
              tag: 'User'
            }))
          },
          {
            name: 'Settings',
            path: '/sharp/linear/settings',
            iconCount: 15,
            icons: Array(15).fill(0).map((_, i) => ({
              name: `settings-${i + 1}`,
              filename: `settings-${i + 1}.svg`,
              path: `/sharp/linear/settings/settings-${i + 1}.svg`,
              category: 'Sharp',
              subcategory: 'Linear',
              tag: 'Settings'
            }))
          }
        ]
      },
      {
        name: 'Bulk',
        path: '/sharp/bulk',
        iconCount: 40,
        tags: [
          {
            name: 'Home',
            path: '/sharp/bulk/home',
            iconCount: 10,
            icons: Array(10).fill(0).map((_, i) => ({
              name: `home-${i + 1}`,
              filename: `home-${i + 1}.svg`,
              path: `/sharp/bulk/home/home-${i + 1}.svg`,
              category: 'Sharp',
              subcategory: 'Bulk',
              tag: 'Home'
            }))
          },
          {
            name: 'User',
            path: '/sharp/bulk/user',
            iconCount: 15,
            icons: Array(15).fill(0).map((_, i) => ({
              name: `user-${i + 1}`,
              filename: `user-${i + 1}.svg`,
              path: `/sharp/bulk/user/user-${i + 1}.svg`,
              category: 'Sharp',
              subcategory: 'Bulk',
              tag: 'User'
            }))
          },
          {
            name: 'Settings',
            path: '/sharp/bulk/settings',
            iconCount: 15,
            icons: Array(15).fill(0).map((_, i) => ({
              name: `settings-${i + 1}`,
              filename: `settings-${i + 1}.svg`,
              path: `/sharp/bulk/settings/settings-${i + 1}.svg`,
              category: 'Sharp',
              subcategory: 'Bulk',
              tag: 'Settings'
            }))
          }
        ]
      }
    ]
  }
];

export const mockIcons: IconFile[] = mockCategories.flatMap(category => 
  category.subcategories.flatMap(subcategory => 
    subcategory.tags.flatMap(tag => tag.icons)
  )
);