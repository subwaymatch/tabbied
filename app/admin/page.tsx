import type { Metadata } from 'next';
import AdminPage from 'components/admin/AdminPage';
import { OverviewPanel } from 'components/admin/panels';

export const metadata: Metadata = { title: 'Admin - Tabbied', robots: { index: false, follow: false } };

export default function Page() {
  return (
    <AdminPage eyebrow="Users" title="User overview" lede="Track audience growth and how people use Studio.">
      <OverviewPanel />
    </AdminPage>
  );
}
