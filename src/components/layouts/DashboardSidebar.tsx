
import React from 'react';
import { 
  Sidebar, 
  SidebarContent, 
  SidebarMenu, 
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarHeader,
  SidebarFooter,
  SidebarTrigger,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import { ChartBar, DollarSign, AreaChart, Database, Upload } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import FileUploadButton from '@/components/dashboard/FileUploadButton';

interface DashboardSidebarProps {
  onUploadComplete?: (data: any) => void;
}

const DashboardSidebar: React.FC<DashboardSidebarProps> = ({ onUploadComplete }) => {
  const location = useLocation();
  
  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2">
          <DollarSign className="h-6 w-6" />
          <h1 className="font-bold text-lg">MoneyMind Pro</h1>
        </div>
        <SidebarTrigger />
      </SidebarHeader>
      
      <SidebarContent className="pt-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={location.pathname === '/'}>
              <Link to="/" className="flex items-center gap-3">
                <ChartBar className="h-4 w-4" />
                <span>Dashboard</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link to="/" className="flex items-center gap-3">
                <AreaChart className="h-4 w-4" />
                <span>Analytics</span>
                <Badge variant="outline" className="ml-auto text-xs font-normal py-0">Soon</Badge>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link to="/" className="flex items-center gap-3">
                <Database className="h-4 w-4" />
                <span>Reports</span>
                <Badge variant="outline" className="ml-auto text-xs font-normal py-0">Soon</Badge>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        
        <SidebarSeparator className="my-4" />
        
        <div className="px-4 mt-2">
          <FileUploadButton 
            onUploadComplete={onUploadComplete} 
            className="w-full justify-center"
          />
        </div>
      </SidebarContent>
      
      <SidebarFooter className="p-4">
        <div className="text-xs text-sidebar-foreground/70">
          MoneyMind Pro v1.0
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default DashboardSidebar;
