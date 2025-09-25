import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Button } from "@/components/ui/button";
import { Bell, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

const AdminLayout = () => {
  return (
    <div className="min-h-screen bg-amber-50/30">
      <SidebarProvider>
        <AppSidebar />
        <main className="flex-1 flex flex-col">
          {/* Header */}
          <header className="bg-white border-b border-amber-100 shadow-sm">
            <div className="flex items-center justify-between px-6 py-4">
              <div className="flex items-center gap-4">
                <SidebarTrigger className="h-10 w-10 text-amber-700 hover:bg-amber-50" />
                <div className="h-6 w-px bg-amber-200" />
                <h1 className="text-2xl font-bold text-amber-800">Admin Dashboard</h1>
              </div>
              
              <div className="flex items-center gap-4">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-amber-500" />
                  <Input
                    placeholder="Search..."
                    className="pl-10 w-64 border-amber-200 focus:border-amber-400"
                  />
                </div>
                
                {/* Notifications */}
                <Button variant="ghost" size="sm" className="relative text-amber-700 hover:bg-amber-50">
                  <Bell className="h-5 w-5" />
                  <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full text-xs flex items-center justify-center text-white">
                    3
                  </span>
                </Button>
              </div>
            </div>
          </header>
          
          {/* Content */}
          <div className="flex-1 p-6">
            <Outlet />
          </div>
        </main>
      </SidebarProvider>
    </div>
  );
};

export default AdminLayout;
