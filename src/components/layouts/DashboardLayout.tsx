
import React from 'react';
import { SidebarProvider } from "@/components/ui/sidebar";
import DashboardSidebar from './DashboardSidebar';

interface DashboardLayoutProps {
  children: React.ReactNode;
  onUploadComplete?: (data: any) => void;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, onUploadComplete }) => {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <DashboardSidebar onUploadComplete={onUploadComplete} />
        <div className="flex-1 overflow-auto">
          <div className="container py-6">
            {children}
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;
