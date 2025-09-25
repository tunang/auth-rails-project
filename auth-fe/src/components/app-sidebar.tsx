import { 
  BookOpen, 
  Crown, 
  ShoppingCartIcon, 
  Tags, 
  Home, 
  Settings, 
  Wrench, 
  LogOut,
  ArrowLeft,
  User
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar"
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAppSelector, useAppDispatch } from "@/hooks/useAppDispatch";
import { logoutRequest } from "@/store/slices/authSlice";

// Menu items grouped by functionality
const mainItems = [
  {
    title: "Dashboard",
    url: "/admin",
    icon: Home,
  },
  // {
  //   title: "Posts",
  //   url: "/admin/posts",
  //   icon: FileText,
  // },
  // {
  //   title: "Media",
  //   url: "/admin/media",
  //   icon: Image,
  // },
  // {
  //   title: "Pages",
  //   url: "/admin/pages",
  //   icon: FileText,
  // },
  // {
  //   title: "Comments",
  //   url: "/admin/comments",
  //   icon: MessageSquare,
  //   badge: "1",
  // },
  // {
  //   title: "Appearance",
  //   url: "/admin/appearance",
  //   icon: Grid3X3,
  // },
  // {
  //   title: "Plugins",
  //   url: "/admin/plugins",
  //   icon: Package,
  // },
  // {
  //   title: "Users",
  //   url: "/admin/users",
  //   icon: Users,
  // },
];

const managementItems = [
  {
    title: "Authors",
    url: "/admin/authors",
    icon: Crown,
  },
  {
    title: "Books",
    url: "/admin/books",
    icon: BookOpen,
  },
  {
    title: "Categories",
    url: "/admin/categories",
    icon: Tags,
  },
  {
    title: "Orders",
    url: "/admin/orders",
    icon: ShoppingCartIcon,
  },
];

const settingsItems = [
  {
    title: "Settings",
    url: "/admin/settings",
    icon: Settings,
  },
  {
    title: "Tools",
    url: "/admin/tools",
    icon: Wrench,
  },
];





export function AppSidebar() {
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { state } = useSidebar();

  const handleLogout = () => {
    dispatch(logoutRequest());
  };

  const isActive = (url: string) => {
    return location.pathname === url || location.pathname.startsWith(url + "/");
  };

  const renderMenuItem = (item: any) => (
    <SidebarMenuItem key={item.title}>
      <SidebarMenuButton 
        asChild 
        className={`h-12 px-4 text-sm font-medium transition-all duration-200 ${
          isActive(item.url) 
            ? "bg-amber-100 text-amber-800 border-r-2 border-amber-600" 
            : "text-gray-700 hover:bg-amber-50 hover:text-amber-700"
        }`}
      >
        <Link to={item.url} className="flex items-center gap-3">
          <item.icon className="h-5 w-5" />
          <span className="flex-1">{item.title}</span>
          {item.badge && (
            <span className="bg-amber-600 text-white text-xs px-2 py-1 rounded-full">
              {item.badge}
            </span>
          )}
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );

  return (
    <Sidebar collapsible="icon" className="bg-white border-r border-amber-100">
      {state === "expanded" && (
        <SidebarHeader className="p-6 border-b border-amber-100">
          <div className="flex items-center gap-3">
            <div className="bg-amber-600 text-white p-2 rounded-lg shadow-md">
              <BookOpen className="h-6 w-6" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold text-amber-800">FAHASA</span>
              <span className="text-xs text-amber-600 font-medium">Admin Panel</span>
            </div>
          </div>
        </SidebarHeader>
      )}

      <SidebarContent className="flex-1">
        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel className="px-4 py-2 text-xs font-semibold text-amber-600 uppercase tracking-wider">
            Main
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems.map(renderMenuItem)}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Management Section */}
        <SidebarGroup>
          <SidebarGroupLabel className="px-4 py-2 text-xs font-semibold text-amber-600 uppercase tracking-wider">
            Management
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {managementItems.map(renderMenuItem)}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Settings Section */}
        <SidebarGroup>
          <SidebarGroupLabel className="px-4 py-2 text-xs font-semibold text-amber-600 uppercase tracking-wider">
            Settings
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {settingsItems.map(renderMenuItem)}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {state === "expanded" && (
        <SidebarFooter className="p-4 border-t border-amber-100">
          {/* User Profile */}
          <div className="flex items-center gap-3 p-3 bg-amber-50 rounded-lg mb-4">
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-amber-100 text-amber-700 font-semibold">
                {user?.name?.charAt(0) || <User className="h-5 w-5" />}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-amber-800 truncate">
                {user?.name || "Admin User"}
              </p>
              <p className="text-xs text-amber-600 truncate">
                {user?.email || "admin@fahasa.com"}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2">
            <Button
              asChild
              variant="ghost"
              className="w-full justify-start text-gray-700 hover:bg-amber-50 hover:text-amber-700 h-10"
            >
              <Link to="/" className="flex items-center gap-3">
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Store</span>
              </Link>
            </Button>
            
            <Button
              variant="ghost"
              onClick={handleLogout}
              className="w-full justify-start text-red-600 hover:bg-red-50 hover:text-red-700 h-10"
            >
              <LogOut className="h-4 w-4 mr-3" />
              <span>Logout</span>
            </Button>
          </div>
        </SidebarFooter>
      )}
    </Sidebar>
  )
}