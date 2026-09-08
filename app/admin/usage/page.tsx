import type { Metadata } from 'next';
import AdminPage from 'components/admin/AdminPage';
import { UsagePanel } from 'components/admin/panels';

export const metadata: Metadata = { title: 'AI usage - Admin', robots: { index: false, follow: false } };

export default function Page() {
  return (
    <AdminPage eyebrow="Spending" title="AI usage" lede="Calls, tokens and estimated cost by day, and who is making them.">
      <UsagePanel />
    </AdminPage>
  );
}
