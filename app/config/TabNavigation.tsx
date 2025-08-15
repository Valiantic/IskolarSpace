// TabNavigation.ts
// Centralized navigation config for sidebar tabs
import React from 'react';

export interface TabNavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  match: (pathname: string) => boolean;
}

import { Rocket, Orbit, Settings, LogOut } from 'lucide-react';

export const TAB_NAVIGATION: TabNavItem[] = [
  {
    label: 'Explore universe',
    href: '/space',
    icon: <Rocket size={25} className="mr-3" />,
    match: (pathname) => pathname.startsWith('/space'),
  },
  {
    label: 'My Space',
    href: '/dashboard',
    icon: <Orbit size={25} className="mr-3" />,
    match: (pathname) => pathname.startsWith('/dashboard'),
  },
  {
    label: 'Settings',
    href: '/settings',
    icon: <Settings size={25} className="mr-3" />,
    match: (pathname) => pathname.startsWith('/settings'),
  },
  // LogOut is handled separately
];
