import { BookOpen, Crown, ShoppingCartIcon, Tags } from "lucide-react"

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
  {
    title: "Orders",
    url: "/admin/orders",
    icon: ShoppingCartIcon,
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