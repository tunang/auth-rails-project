import { Outlet } from "react-router-dom";
import Header from "@/components/Header";

const AdminLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        <Outlet />
      </main>
    
    </div>
  );
};

export default AdminLayout;