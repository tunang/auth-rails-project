import { Outlet } from "react-router-dom";
import Header from "@/components/Header";

const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="border-t bg-background">
        <div className="container mx-auto px-4 py-6 text-center text-muted-foreground">
          <p>&copy; 2024 BookStore. Tất cả quyền được bảo lưu.</p>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
