
import { Home, Package, Users, Settings, User, HelpCircle } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

interface AppSidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  onNewPrescription: () => void;
}

const menuItems = [
  {
    id: "dashboard",
    title: "Dashboard",
    icon: Home,
  },
  {
    id: "orders",
    title: "Orders",
    icon: Package,
  },
  {
    id: "customers",
    title: "Customers",
    icon: Users,
  },
];

export function AppSidebar({ activeSection, onSectionChange, onNewPrescription }: AppSidebarProps) {
  const handleMenuClick = (itemId: string) => {
    onSectionChange(itemId);
  };

  const handleNewPrescriptionClick = () => {
    onNewPrescription();
  };

  const handleSettingsClick = () => {
    onSectionChange("settings");
  };

  return (
    <Sidebar className="border-r border-gray-200">
      <SidebarHeader className="p-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-black rounded-md flex items-center justify-center">
            <span className="text-white font-bold text-sm">V</span>
          </div>
          <span className="font-semibold text-lg">OptiVision</span>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton 
                    isActive={activeSection === item.id}
                    onClick={() => handleMenuClick(item.id)}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon className="w-5 h-5" />
                      <span>{item.title}</span>
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <div className="px-4 mt-6">
          <Button 
            onClick={handleNewPrescriptionClick}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white"
          >
            New Prescription
          </Button>
        </div>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton 
              isActive={activeSection === "settings"}
              onClick={handleSettingsClick}
            >
              <div className="flex items-center gap-3">
                <Settings className="w-5 h-5" />
                <span>Settings</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton>
              <div className="flex items-center gap-3">
                <HelpCircle className="w-5 h-5" />
                <span>Help and docs</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
