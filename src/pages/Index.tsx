
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

  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return <Dashboard onNewPrescription={() => setIsNewPrescriptionOpen(true)} />;
      case "orders":
        return <Orders onNewPrescription={() => setIsNewPrescriptionOpen(true)} />;
      case "customers":
        return <Customers />;
      case "settings":
        return <Settings onPersonalInfo={() => setIsPersonalInfoOpen(true)} />;
      default:
        return <Dashboard onNewPrescription={() => setIsNewPrescriptionOpen(true)} />;
    }
  };

  return (
    <div className="min-h-screen flex w-full bg-gray-50">
      <SidebarProvider>
        <AppSidebar 
          activeSection={activeSection} 
          onSectionChange={setActiveSection}
          onNewPrescription={() => setIsNewPrescriptionOpen(true)}
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
