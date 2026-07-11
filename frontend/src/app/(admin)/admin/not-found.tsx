import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { FileQuestion } from 'lucide-react';

export default function AdminNotFound() {
  return (
    <div className="h-[80vh] flex flex-col items-center justify-center space-y-4 px-4 text-center">
      <div className="w-16 h-16 bg-muted text-muted-foreground rounded-full flex items-center justify-center mb-2">
        <FileQuestion className="w-8 h-8" />
      </div>
      <h2 className="text-2xl font-bold tracking-tight">Page Not Found</h2>
      <p className="text-muted-foreground max-w-md">
        The page you are looking for doesn&apos;t exist or has been moved.
      </p>
      <div className="pt-4">
        <Button asChild variant="default">
          <Link href="/admin/dashboard">Return to Dashboard</Link>
        </Button>
      </div>
    </div>
  );
}
