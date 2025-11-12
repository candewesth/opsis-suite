import { AppShell } from '@/components/layout/app-shell';
import { getSettings } from '@/lib/data/settings';

export default async function PlatformLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSettings();
  return <AppShell settings={settings}>{children}</AppShell>;
}
