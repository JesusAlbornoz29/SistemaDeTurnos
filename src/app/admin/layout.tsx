'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Hospital, LayoutDashboard } from 'lucide-react';
import {
  Sidebar,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';

function AdminHeader() {
  const { toggleSidebar } = useSidebar();
  return (
    <header className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-30 flex h-16 items-center gap-4 px-4 sm:px-6">
      <SidebarTrigger className="md:hidden" />
      <div className="flex-1">
        <h1 className="font-semibold text-lg">Panel de Administración</h1>
      </div>
    </header>
  );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <Sidebar className="hidden md:block border-r" collapsible="icon">
          <SidebarHeader className="flex items-center gap-2 px-4 lg:px-6 h-16">
            <Link href="/" className="flex items-center gap-2 font-semibold">
              <Hospital className="h-6 w-6 text-primary" />
            </Link>
            <span className="group-data-[collapsible=icon]:hidden font-bold">
              CitaPresto
            </span>
          </SidebarHeader>
          <SidebarMenu className="flex-1 px-2 lg:px-4">
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                tooltip="Dashboard"
                isActive={pathname.startsWith('/admin')}
              >
                <Link href="/admin">
                  <LayoutDashboard />
                  <span className="group-data-[collapsible=icon]:hidden">
                    Dashboard
                  </span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Vista del Paciente">
                <Link href="/">
                  <Home />
                  <span className="group-data-[collapsible=icon]:hidden">
                    Vista del Paciente
                  </span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </Sidebar>
        <div className="flex flex-col flex-1">
          <AdminHeader />
          <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 bg-muted/40">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
