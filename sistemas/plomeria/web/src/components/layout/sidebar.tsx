'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { LucideIcon } from 'lucide-react';
import {
  Boxes,
  ClipboardList,
  LayoutDashboard,
  LineChart,
  Settings,
  Users,
} from 'lucide-react';
import { useLanguage } from '@/contexts/language-context';
import { translate, TranslationKey } from '@/lib/i18n';
import { cn } from '@/lib/utils';

const navItems: Array<{ href: string; labelKey: TranslationKey; icon: LucideIcon }> = [
  { href: '/dashboard', labelKey: 'dashboard', icon: LayoutDashboard },
  { href: '/orders', labelKey: 'orders', icon: ClipboardList },
  { href: '/customers', labelKey: 'customers', icon: Users },
  { href: '/inventory', labelKey: 'inventory', icon: Boxes },
  { href: '/reports', labelKey: 'reports', icon: LineChart },
  { href: '/settings', labelKey: 'settings', icon: Settings },
];

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export function Sidebar({ open, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { locale } = useLanguage();

  return (
    <aside
      className={cn(
        'fixed inset-y-0 left-0 z-40 w-64 transform border-r border-slate-200 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-slate-900/80 transition-transform duration-200 ease-in-out lg:translate-x-0',
        open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
      )}
    >
      <div className="flex h-16 items-center gap-2 border-b border-slate-200 px-6 dark:border-slate-800">
        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-sky-500 via-blue-500 to-indigo-500 p-0.5">
          <div className="flex h-full w-full items-center justify-center rounded-lg bg-white text-xl font-black text-slate-900 dark:bg-slate-900 dark:text-white">
            ◉
          </div>
        </div>
        <div>
          <p className="text-lg font-semibold text-slate-900 dark:text-white">Opsis</p>
          <p className="text-xs uppercase tracking-widest text-slate-500 dark:text-slate-400">Plumbing</p>
        </div>
      </div>
      <nav className="space-y-1 px-3 py-6">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = pathname?.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={cn(
                'flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-slate-500 transition hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800',
                active && 'bg-slate-900 text-white shadow-lg shadow-slate-900/10 dark:bg-white dark:text-slate-900',
              )}
            >
              <Icon className="h-5 w-5" />
              <span>{translate(locale, item.labelKey)}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
