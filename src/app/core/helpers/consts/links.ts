export class NavigationLinkModel {
  title: string = "";
  icon?: string = "";
  link: string = "";
  id?: string;
}

export const navigationLinks: NavigationLinkModel[] = [
  {
    title: 'Главная',
    icon: "dashboard",
    link: "/dashboard",
    id: "navbar_dashboard"
  },
  {
    title: 'Товары',
    icon: "inventory_2",
    link: "/products",
    id: "navbar_products"
  },
  {
    title: 'Клиенты',
    icon: "people",
    link: "/clients",
    id: "navbar_clients"
  },
  {
    title: 'Склад',
    icon: "warehouse",
    link: "/warehouse",
    id: "navbar_warehouse"
  },
  {
    title: 'Продажи',
    icon: "point_of_sale",
    link: "/sales",
    id: "navbar_sales"
  },
  {
    title: 'Отчеты',
    icon: "assessment",
    link: "/reports",
    id: "navbar_reports"
  },
];
