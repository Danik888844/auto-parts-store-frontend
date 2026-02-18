export class NavigationLinkModel {
  title: string = "";
  icon?: string = "";
  link: string = "";
  id?: string;
}

export interface NavigationDropdownSection {
  sectionTitle: string;
  items: NavigationLinkModel[];
}

export interface NavigationDropdownModel {
  title: string;
  icon?: string;
  id?: string;
  sections: NavigationDropdownSection[];
}

export type NavigationItem =
  | NavigationLinkModel
  | (NavigationDropdownModel & { type: 'dropdown' });

export const navigationLinks: NavigationLinkModel[] = [
  {
    title: 'Dashboard',
    icon: 'dashboard',
    link: '/dashboard',
    id: 'navbar_dashboard',
  },
  {
    title: 'Clients',
    icon: 'people',
    link: '/clients',
    id: 'navbar_clients',
  },
  {
    title: 'Warehouse',
    icon: 'warehouse',
    link: '/warehouse',
    id: 'navbar_warehouse',
  },
  {
    title: 'Sales',
    icon: 'point_of_sale',
    link: '/sales',
    id: 'navbar_sales',
  },
  {
    title: 'Reports',
    icon: 'assessment',
    link: '/reports',
    id: 'navbar_reports',
  },
];

const catalogSections: NavigationDropdownSection[] = [
  {
    sectionTitle: 'ProductsCatalog',
    items: [
      { title: 'Products', link: '/products', id: 'nav_products' },
      { title: 'Categories', link: '/categories', id: 'nav_categories' },
      {
        title: 'Manufacturers',
        link: '/manufacturers',
        id: 'nav_manufacturers',
      },
      { title: 'Suppliers', link: '/suppliers', id: 'nav_suppliers' },
    ],
  },
  {
    sectionTitle: 'CarCatalog',
    items: [
      {
        title: 'VehicleBrands',
        link: '/vehicle-brands',
        id: 'nav_vehicle_brands',
      },
      {
        title: 'VehicleModels',
        link: '/vehicle-models',
        id: 'nav_vehicle_models',
      },
      { title: 'Vehicles', link: '/vehicles', id: 'nav_vehicles' },
    ],
  },
  {
    sectionTitle: 'Users',
    items: [
      { title: 'SystemUsers', link: '/system-users', id: 'nav_system_users' },
    ],
  },
];

export const catalogRoutePaths: string[] = catalogSections.flatMap((s) =>
  s.items.map((i) => i.link)
);

export const navigationItems: NavigationItem[] = [
  {
    title: 'Dashboard',
    icon: 'dashboard',
    link: '/dashboard',
    id: 'navbar_dashboard',
  },
  { title: 'Clients', icon: 'people', link: '/clients', id: 'navbar_clients' },
  {
    title: 'Warehouse',
    icon: 'warehouse',
    link: '/warehouse',
    id: 'navbar_warehouse',
  },
  { title: 'Sales', icon: 'point_of_sale', link: '/sales', id: 'navbar_sales' },
  {
    title: 'Reports',
    icon: 'assessment',
    link: '/reports',
    id: 'navbar_reports',
  },
  {
    type: 'dropdown',
    title: 'Catalog',
    icon: 'menu_book',
    id: 'navbar_catalog',
    sections: catalogSections,
  },
];
