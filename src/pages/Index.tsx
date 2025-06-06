
import { useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Dashboard } from "@/components/Dashboard";
import { Orders } from "@/components/Orders";
import { Customers } from "@/components/Customers";
import { Settings } from "@/components/Settings";
import { NewPrescriptionModal } from "@/components/NewPrescriptionModal";
import { PersonalInfoModal } from "@/components/PersonalInfoModal";
import { AuthModal } from "@/components/AuthModal";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { LogOut, Loader2 } from "lucide-react";

const Index = () => {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [isNewPrescriptionOpen, setIsNewPrescriptionOpen] = useState(false);
  const [isPersonalInfoOpen, setIsPersonalInfoOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { user, loading, signOut } = useAuth();

  const handleSectionChange = (section: string) => {
    setActiveSection(section);
  };

  const handleNewPrescription = () => {
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }
    setIsNewPrescriptionOpen(true);
  };

  const handlePersonalInfo = () => {
    setIsPersonalInfoOpen(true);
  };

  const handleAuthSuccess = () => {
    setIsAuthModalOpen(false);
  };

  const renderContent = () => {
    if (!user) {
      return (
        <div className="flex items-center justify-center h-full">
          <div className="text-center space-y-6 max-w-md">
            <h2 className="text-3xl font-bold text-gray-900">Welcome to Visionary Optics</h2>
            <p className="text-gray-600">Please sign in to access the management system.</p>
            <Button 
              onClick={() => setIsAuthModalOpen(true)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3"
            >
              Sign In
            </Button>
          </div>
        </div>
      );
    }

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex w-full bg-gray-50">
      <SidebarProvider>
        {user && (
          <AppSidebar 
            activeSection={activeSection} 
            onSectionChange={handleSectionChange}
            onNewPrescription={handleNewPrescription}
          />
        )}
        <main className={`flex-1 p-6 ${!user ? 'w-full' : ''}`}>
          {user && (
            <div className="flex justify-end mb-4">
              <Button
                onClick={signOut}
                variant="outline"
                className="flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </Button>
            </div>
          )}
          {renderContent()}
        </main>
        
        {user && (
          <>
            <NewPrescriptionModal 
              isOpen={isNewPrescriptionOpen}
              onClose={() => setIsNewPrescriptionOpen(false)}
            />
            
            <PersonalInfoModal 
              isOpen={isPersonalInfoOpen}
              onClose={() => setIsPersonalInfoOpen(false)}
            />
          </>
        )}

        <AuthModal 
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          onSuccess={handleAuthSuccess}
        />
      </SidebarProvider>
    </div>
  );
};

export default Index;
