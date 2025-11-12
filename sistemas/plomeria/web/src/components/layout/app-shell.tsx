'use client';

import { useEffect, useState } from 'react';
import { Sidebar } from './sidebar';
import { Topbar } from './topbar';
import { SettingsRecord } from '@/lib/types';
import { useTheme } from 'next-themes';

interface AppShellProps {
  children: React.ReactNode;
  settings: SettingsRecord;
}

export function AppShell({ children, settings }: AppShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { setTheme } = useTheme();

  useEffect(() => {
    if (settings.theme) {
      setTheme(settings.theme);
    }
  }, [settings.theme, setTheme]);

  useEffect(() => {
    if (settings.palette) {
      document.body.dataset.palette = settings.palette;
    } else {
      delete document.body.dataset.palette;
    }
  }, [settings.palette]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <Topbar companyName={settings.company_name} onToggleSidebar={() => setSidebarOpen((prev) => !prev)} />
      <main className="min-h-screen px-4 pb-10 pt-24 lg:pl-72 lg:pr-10">{children}</main>
    </div>
  );
}
