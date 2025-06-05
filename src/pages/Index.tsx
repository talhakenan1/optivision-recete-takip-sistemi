
import { useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Dashboard } from "@/components/Dashboard";
import { Orders } from "@/components/Orders";
import { Customers } from "@/components/Customers";
import { Settings } from "@/components/Settings";
import { NewPrescriptionModal } from "@/components/NewPrescriptionModal";
import { PersonalInfoModal } from "@/components/PersonalInfoModal";

const Index = () => {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [isNewPrescriptionOpen, setIsNewPrescriptionOpen] = useState(false);
  const [isPersonalInfoOpen, setIsPersonalInfoOpen] = useState(false);

  const handleSectionChange = (section: string) => {
    setActiveSection(section);
  };

  const handleNewPrescription = () => {
    setIsNewPrescriptionOpen(true);
  };

  const handlePersonalInfo = () => {
    setIsPersonalInfoOpen(true);
  };

  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return <Dashboard onNewPrescription={handleNewPrescription} onNavigate={handleSectionChange} />;
      case "orders":
        return <Orders onNewPrescription={handleNewPrescription} />;
      case "customers":
        return <Customers />;
      case "settings":
        return <Settings onPersonalInfo={handlePersonalInfo} />;
      default:
        return <Dashboard onNewPrescription={handleNewPrescription} onNavigate={handleSectionChange} />;
    }
  };

  return (
    <div className="min-h-screen flex w-full bg-gray-50">
      <SidebarProvider>
        <AppSidebar 
          activeSection={activeSection} 
          onSectionChange={handleSectionChange}
          onNewPrescription={handleNewPrescription}
        />
        <main className="flex-1 p-6">
          {renderContent()}
        </main>
        
        <NewPrescriptionModal 
          isOpen={isNewPrescriptionOpen}
          onClose={() => setIsNewPrescriptionOpen(false)}
        />
        
        <PersonalInfoModal 
          isOpen={isPersonalInfoOpen}
          onClose={() => setIsPersonalInfoOpen(false)}
        />
      </SidebarProvider>
    </div>
  );
};

export default Index;
