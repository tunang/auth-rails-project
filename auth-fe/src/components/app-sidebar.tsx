import { BarChart3, BookOpen, Calendar, Crown, Home, Inbox, Search, Settings, ShoppingCart, Tags } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Link } from "react-router-dom";

// Menu items grouped by functionality
const dashboardItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: Home,
  },
  {
    title: "Analytics",
    url: "/admin/analytics", 
    icon: BarChart3,
  },
];

const managementItems = [
  // {
  //   title: "Users",
  //   url: "/admin/users",
  //   icon: Users,
  //   badge: null,
  // },
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
];

const orderItems = [
  {
    title: "Orders",
    url: "/admin/orders",
    icon: ShoppingCart,
  },
];

const settingsItems = [
  {
    title: "Settings",
    url: "/admin/settings",
    icon: Settings,
  },
];

export function AppSidebar() {
  return (
    <Sidebar collapsible="icon" className="bg-white ">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {managementItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link to={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}