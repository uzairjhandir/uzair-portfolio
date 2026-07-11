import { Sidebar } from '@/components/admin/layout/Sidebar';
import { Header } from '@/components/admin/layout/Header';
import { Breadcrumbs } from '@/components/admin/layout/Breadcrumbs';
import { AuthGuard } from '@/components/admin/layout/AuthGuard';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-background text-foreground flex">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden ml-64">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-muted/20 p-6">
          <Breadcrumbs />
          {children}
        </main>
      </div>
    </div>
    </AuthGuard>
  );
}
