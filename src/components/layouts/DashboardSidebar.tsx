
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
import { ChartBar, AreaChart, Database, DollarSign, Home } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import FileUploadButton from '@/components/dashboard/FileUploadButton';

interface DashboardSidebarProps {
  onUploadComplete?: (data: any) => void;
}

const DashboardSidebar: React.FC<DashboardSidebarProps> = ({ onUploadComplete }) => {
  const location = useLocation();
  
  return (
    <Sidebar className="bg-[#003366] text-white">
      <SidebarHeader className="p-4 bg-[#003366] text-white border-b border-blue-800">
        <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <DollarSign className="h-6 w-6" />
          <h1 className="font-bold text-lg">MoneyMind Pro</h1>
        </Link>
        <SidebarTrigger />
      </SidebarHeader>
      
      <SidebarContent className="pt-4 bg-[#003366]">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={location.pathname === '/'} className="text-white hover:bg-blue-800">
              <Link to="/" className="flex items-center gap-3">
                <Home className="h-4 w-4" />
                <span>Home</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={location.pathname === '/dashboard'} className="text-white hover:bg-blue-800">
              <Link to="/dashboard" className="flex items-center gap-3">
                <ChartBar className="h-4 w-4" />
                <span>Dashboard</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="text-white hover:bg-blue-800">
              <Link to="/" className="flex items-center gap-3">
                <AreaChart className="h-4 w-4" />
                <span>Analytics</span>
                <Badge variant="outline" className="ml-auto text-xs font-normal py-0 border-blue-400 text-blue-200">Soon</Badge>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="text-white hover:bg-blue-800">
              <Link to="/" className="flex items-center gap-3">
                <Database className="h-4 w-4" />
                <span>Reports</span>
                <Badge variant="outline" className="ml-auto text-xs font-normal py-0 border-blue-400 text-blue-200">Soon</Badge>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        
        <SidebarSeparator className="my-4 bg-blue-800" />
        
        <div className="px-4 mt-2">
          <FileUploadButton 
            onUploadComplete={onUploadComplete} 
            className="w-full justify-center bg-blue-500 hover:bg-blue-600"
          />
        </div>
      </SidebarContent>
      
      <SidebarFooter className="p-4 bg-[#003366] border-t border-blue-800">
        <div className="text-xs text-blue-300">
          MoneyMind Pro v1.0
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default DashboardSidebar;
