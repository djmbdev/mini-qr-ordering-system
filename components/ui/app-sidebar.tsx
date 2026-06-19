import * as React from "react";

import { ThemeMenu } from "@/components/ui/theme-menu";
import { Hamburger } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
} from "@/components/ui/sidebar";

type SidebarNavItem = {
  title: string;
  url: string;
  isActive?: boolean;
};

type SidebarNavGroup = {
  title: string;
  hasLabel: boolean;
  items: SidebarNavItem[];
};

const data: { navMain: SidebarNavGroup[] } = {
  navMain: [
    {
      title: "Dashboard",
      hasLabel: false,
      items: [
        {
          title: "Dashboard",
          url: "#",
          isActive: true,
        },
      ],
    },
    {
      title: "Customization",
      hasLabel: true,
      items: [
        {
          title: "Pages",
          url: "#",
        },
        {
          title: "Components",
          url: "#",
        },
        {
          title: "Metadata",
          url: "#",
        },
      ],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar {...props}>
      <SidebarHeader className="flex flex-row text-md text-primary-foreground bg-primary justify-center items-center gap-3 p-5 mb-2">
        <Hamburger className="size-5" />
        <div className="font-bold">DJMBurgers</div>
        <Hamburger className="size-5" />
      </SidebarHeader>

      <SidebarContent>
        {data.navMain.map((item, index) => (
          <React.Fragment key={item.title || index}>
            <SidebarGroup>
              {item.hasLabel && (
                <SidebarGroupLabel>{item.title}</SidebarGroupLabel>
              )}
              <SidebarGroupContent>
                <SidebarMenu>
                  {item.items.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild isActive={item.isActive}>
                        <a href={item.url}>{item.title}</a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
            {index === 0 && <SidebarSeparator className="mx-2" />}
          </React.Fragment>
        ))}
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-2">
        <ThemeMenu
          variant="outline"
          label="Theme"
          className="w-full justify-start"
        />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
