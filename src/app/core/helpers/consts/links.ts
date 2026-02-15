export class NavigationLinkModel {
  title: string = "";
  icon?: string = "";
  link: string = "";
  id?: string;
}

export const navigationLinks: NavigationLinkModel[] = [
  {
    title: 'Dashboard',
    icon: "dashboard",
    link: "/dashboard",
    id: "navbar_dashboard"
  },
  {
    title: 'Products',
    icon: "inventory_2",
    link: "/products",
    id: "navbar_products"
  },
  {
    title: 'Clients',
    icon: "people",
    link: "/clients",
    id: "navbar_clients"
  },
  {
    title: 'Warehouse',
    icon: "warehouse",
    link: "/warehouse",
    id: "navbar_warehouse"
  },
  {
    title: 'Sales',
    icon: "point_of_sale",
    link: "/sales",
    id: "navbar_sales"
  },
  {
    title: 'Reports',
    icon: "assessment",
    link: "/reports",
    id: "navbar_reports"
  },
];
