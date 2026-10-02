export interface SubMenuItem {
  label: string;
  path: string;
}

export interface MenuItem {
  label: string;
  path?: string;
  subItems?: SubMenuItem[];
}

export type RadioGroupMenuProp = {
  item: MenuItem;
};

export type NavDropdownProps = RadioGroupMenuProp & {
  checkIsActive: (path: string) => boolean;
};
