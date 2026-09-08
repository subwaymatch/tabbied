import { Suspense } from 'react';
import type { Metadata } from 'next';
import AdminPage from 'components/admin/AdminPage';
import UsersRoute from 'components/admin/UsersRoute';

export const metadata: Metadata = { title: 'Users - Admin', robots: { index: false, follow: false } };

export default function Page() {
  return (
    <AdminPage eyebrow="Directory" title="Users" lede="Every account, with what each has made and whether it may still sign in.">
      {/* ?id= selects one; the export cannot enumerate ids, so it is a query. */}
      <Suspense>
        <UsersRoute />
      </Suspense>
    </AdminPage>
  );
}
