
import { useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Dashboard } from "@/components/Dashboard";
import { Orders } from "@/components/Orders";
import { Customers } from "@/components/Customers";
import { Settings } from "@/components/Settings";
import { NewPrescriptionModal } from "@/components/NewPrescriptionModal";
import { PersonalInfoModal } from "@/components/PersonalInfoModal";
import { AuthModal } from "@/components/AuthModal";
import { LandingPage } from "@/components/LandingPage";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Loader2, Menu } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

const Index = () => {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [isNewPrescriptionOpen, setIsNewPrescriptionOpen] = useState(false);
  const [isPersonalInfoOpen, setIsPersonalInfoOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [showLanding, setShowLanding] = useState(true);
  const { user, loading } = useAuth();
  const isMobile = useIsMobile();

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
    setShowLanding(false);
  };

  const handleGetStarted = () => {
    if (!user) {
      setIsAuthModalOpen(true);
    } else {
      setShowLanding(false);
    }
  };

  const renderContent = () => {
    if (!user) {
      if (showLanding) {
        return <LandingPage onGetStarted={handleGetStarted} />;
      }
      return (
        <div className="flex items-center justify-center h-full px-4">
          <div className="text-center space-y-6 max-w-md">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Visionary Optics'e Hoş Geldiniz</h2>
            <p className="text-gray-600">Sisteme erişim için lütfen giriş yapın.</p>
            <div className="space-y-3">
              <Button 
                onClick={() => setIsAuthModalOpen(true)}
                className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 w-full sm:w-auto"
              >
                Giriş Yap
              </Button>
              <div className="text-center">
                <button
                  onClick={() => setShowLanding(true)}
                  className="text-blue-500 hover:text-blue-600 text-sm underline"
                >
                  Ana sayfaya dön
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (showLanding) {
      return <LandingPage onGetStarted={() => setShowLanding(false)} />;
    }

    switch (activeSection) {
      case "dashboard":
        return <Dashboard onNewPrescription={handleNewPrescription} onNavigate={handleSectionChange} />;
      case "orders":
        return <Orders />;
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
    <div className="min-h-screen flex bg-gray-50 dark:bg-[#1f2937]">
      <SidebarProvider defaultOpen={!isMobile}>
        {user && !showLanding && (
          <AppSidebar 
            activeSection={activeSection} 
            onSectionChange={handleSectionChange}
            onNewPrescription={handleNewPrescription}
          />
        )}
        <main className="flex-1 flex flex-col">
          {user && !showLanding && isMobile && (
            <div className="flex items-center p-3 border-b bg-white dark:bg-[#1f2937]">
              <SidebarTrigger>
                <Menu className="w-6 h-6" />
              </SidebarTrigger>
              <h1 className="ml-3 text-lg font-semibold">Visionary Optics</h1>
            </div>
          )}
          <div className="flex-1">
            {renderContent()}
          </div>
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
