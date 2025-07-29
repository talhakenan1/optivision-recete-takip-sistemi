
import { Home, Package, Users, Settings, HelpCircle, CreditCard, MessageSquare } from "lucide-react";
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
import { BarChart3 } from "lucide-react";

interface AppSidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  onNewPrescription: () => void;
}

const menuItems = [
  {
    id: "dashboard",
    title: "Ana Sayfa",
    icon: Home,
  },
  {
    id: "orders",
    title: "Siparişler",
    icon: Package,
  },
  {
    id: "customers",
    title: "Müşteriler",
    icon: Users,
  },
  {
    id: "revenue",
    title: "Ciro",
    icon: BarChart3,
  },
  {
    id: "debts",
    title: "Borç Yönetimi",
    icon: CreditCard,
  },
  {
    id: "telegram",
    title: "Telegram Yönetimi",
    icon: MessageSquare,
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
      <SidebarHeader className="p-4 sm:p-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-black rounded-md flex items-center justify-center">
            <span className="text-white font-bold text-sm">M</span>
          </div>
          <span className="font-semibold text-base sm:text-lg">Melis Optik</span>
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
                    className="w-full"
                  >
                    <div className="flex items-center gap-3">
                      <item.icon className="w-5 h-5 flex-shrink-0" />
                      <span className="truncate">{item.title}</span>
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
            className="w-full bg-blue-500 hover:bg-blue-600 text-white text-sm sm:text-base"
          >
            Yeni Reçete
          </Button>
        </div>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton 
              isActive={activeSection === "settings"}
              onClick={handleSettingsClick}
              className="w-full"
            >
              <div className="flex items-center gap-3">
                <Settings className="w-5 h-5 flex-shrink-0" />
                <span className="truncate">Ayarlar</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton className="w-full">
              <div className="flex items-center gap-3">
                <HelpCircle className="w-5 h-5 flex-shrink-0" />
                <span className="truncate">Yardım</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
