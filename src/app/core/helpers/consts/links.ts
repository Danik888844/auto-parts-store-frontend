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
];
