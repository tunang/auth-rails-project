import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
const AdminLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <SidebarProvider>
        <AppSidebar />
        <main className="flex-1">
          <div className="flex justify-between items-center border-b border-gray-200 gap-4">
            <div>
              <SidebarTrigger className="size-12 border-r-1 border-grey rounded-none pr-2" />
            </div>
            <div className="flex-1">
              <h1 className="text-xl ">admin</h1>
            </div>
          </div>
          <div className="flex-1">
            <Outlet />
          </div>
        </main>
      </SidebarProvider>
    </div>
  );
};

export default AdminLayout;
