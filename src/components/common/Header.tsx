import Link from 'next/link';
import Image from 'next/image';
import { Hospital } from 'lucide-react';

export function Header() {
  return (
    <header className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-40">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2">
          <Hospital className="h-6 w-6 text-primary" />
          <span className="font-bold text-lg">CitaPresto</span>
        </Link>
        <nav className="flex items-center gap-4">
          <Link
            href="/"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            Paciente
          </Link>
          <Link
            href="/admin"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            Admin
          </Link>
        </nav>
      </div>
    </header>
  );
}
