import { ReactNode } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="h-16 border-b border-border bg-card flex items-center px-6 gap-4">
            <SidebarTrigger className="hover:bg-sidebar-accent p-2 rounded-lg transition-colors" />
            
            <div className="flex-1">
              <h1 className="text-lg font-semibold text-foreground">AI Career Platform</h1>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2">
              <div className="text-sm text-muted-foreground">
                Welcome back! 👋
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 p-6 bg-muted/30">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}