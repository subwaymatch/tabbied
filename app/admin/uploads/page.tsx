import type { Metadata } from 'next';
import AdminPage from 'components/admin/AdminPage';
import { UploadsPanel } from 'components/admin/panels';

export const metadata: Metadata = { title: 'Uploads - Admin', robots: { index: false, follow: false } };

export default function Page() {
  return (
    <AdminPage eyebrow="Media" title="Uploads" lede="Reference pictures people have added, newest first.">
      <UploadsPanel />
    </AdminPage>
  );
}
