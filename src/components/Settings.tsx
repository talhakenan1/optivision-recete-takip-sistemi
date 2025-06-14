
import { Button } from "@/components/ui/button";
import { User, Sun, Moon, Bell, HelpCircle, Headphones, LogOut, Monitor } from "lucide-react";
import { useState, useEffect } from "react";
import { HelpModal } from "@/components/HelpModal";
import { useAuth } from "@/hooks/useAuth";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface SettingsProps {
  onPersonalInfo: () => void;
}

export function Settings({ onPersonalInfo }: SettingsProps) {
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const [theme, setTheme] = useState("light");
  const [emailNotifications, setEmailNotifications] = useState(() => {
    const saved = localStorage.getItem('emailNotifications');
    return saved ? JSON.parse(saved) : true;
  });
  const [pushNotifications, setPushNotifications] = useState(() => {
    const saved = localStorage.getItem('pushNotifications');
    return saved ? JSON.parse(saved) : false;
  });
  const [orderUpdates, setOrderUpdates] = useState(() => {
    const saved = localStorage.getItem('orderUpdates');
    return saved ? JSON.parse(saved) : true;
  });
  const [marketingEmails, setMarketingEmails] = useState(() => {
    const saved = localStorage.getItem('marketingEmails');
    return saved ? JSON.parse(saved) : false;
  });
  const { signOut } = useAuth();

  useEffect(() => {
    localStorage.setItem('emailNotifications', JSON.stringify(emailNotifications));
  }, [emailNotifications]);

  useEffect(() => {
    localStorage.setItem('pushNotifications', JSON.stringify(pushNotifications));
  }, [pushNotifications]);

  useEffect(() => {
    localStorage.setItem('orderUpdates', JSON.stringify(orderUpdates));
  }, [orderUpdates]);

  useEffect(() => {
    localStorage.setItem('marketingEmails', JSON.stringify(marketingEmails));
  }, [marketingEmails]);

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  return (
    <div className="min-h-screen bg-background dark:bg-[#4f5450]">
      <div className="space-y-8 p-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground dark:text-white">Ayarlar</h1>

        {/* Account Section */}
        <div className="space-y-4">
          <h2 className="text-lg sm:text-xl font-semibold text-foreground dark:text-white">Hesap</h2>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700 space-y-0">
            <Button
              variant="ghost"
              className="w-full justify-start p-4 sm:p-6 h-auto border-b dark:border-gray-700 rounded-none text-left text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700"
              onClick={onPersonalInfo}
            >
              <User className="w-5 h-5 mr-3 sm:mr-4 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <div className="font-medium">Kişisel Bilgiler</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Kişisel bilgilerinizi yönetin</div>
              </div>
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start p-4 sm:p-6 h-auto rounded-none text-left text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700"
              onClick={signOut}
            >
              <LogOut className="w-5 h-5 mr-3 sm:mr-4 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <div className="font-medium">Çıkış Yap</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Hesabınızdan çıkış yapın</div>
              </div>
            </Button>
          </div>
        </div>

        {/* Display Section */}
        <div className="space-y-4">
          <h2 className="text-lg sm:text-xl font-semibold text-foreground dark:text-white">Görünüm</h2>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700 p-4 sm:p-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Sun className="w-5 h-5 text-foreground dark:text-white" />
                <span className="font-medium text-foreground dark:text-white">Tema</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <Button
                  variant={theme === "light" ? "default" : "outline"}
                  onClick={() => handleThemeChange("light")}
                  className={`flex items-center justify-center space-x-2 h-auto py-3 ${
                    theme === "light" 
                      ? "bg-blue-500 text-white hover:bg-blue-600" 
                      : "text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white"
                  }`}
                >
                  <Sun className="w-4 h-4" />
                  <span>Aydınlık</span>
                </Button>
                <Button
                  variant={theme === "dark" ? "default" : "outline"}
                  onClick={() => handleThemeChange("dark")}
                  className={`flex items-center justify-center space-x-2 h-auto py-3 ${
                    theme === "dark" 
                      ? "bg-blue-500 text-white hover:bg-blue-600" 
                      : "text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white"
                  }`}
                >
                  <Moon className="w-4 h-4" />
                  <span>Karanlık</span>
                </Button>
                <Button
                  variant={theme === "system" ? "default" : "outline"}
                  onClick={() => handleThemeChange("system")}
                  className={`flex items-center justify-center space-x-2 h-auto py-3 ${
                    theme === "system" 
                      ? "bg-blue-500 text-white hover:bg-blue-600" 
                      : "text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white"
                  }`}
                >
                  <Monitor className="w-4 h-4" />
                  <span>Sistem</span>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Notifications Section */}
        <div className="space-y-4">
          <h2 className="text-lg sm:text-xl font-semibold text-foreground dark:text-white">Bildirim Tercihleri</h2>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700 p-4 sm:p-6">
            <div className="space-y-6">
              <div className="flex items-center space-x-2 mb-4">
                <Bell className="w-5 h-5 text-foreground dark:text-white" />
                <span className="font-medium text-foreground dark:text-white">Bildirimler</span>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="email-notifications" className="text-base font-medium text-foreground dark:text-white">
                      Email Bildirimleri
                    </Label>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Email ile bildirim alın
                    </div>
                  </div>
                  <Switch
                    id="email-notifications"
                    checked={emailNotifications}
                    onCheckedChange={setEmailNotifications}
                    className="data-[state=checked]:bg-blue-500 data-[state=unchecked]:bg-gray-200 dark:data-[state=unchecked]:bg-gray-600"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="push-notifications" className="text-base font-medium text-foreground dark:text-white">
                      Anlık Bildirimler
                    </Label>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Tarayıcıda anlık bildirim alın
                    </div>
                  </div>
                  <Switch
                    id="push-notifications"
                    checked={pushNotifications}
                    onCheckedChange={setPushNotifications}
                    className="data-[state=checked]:bg-blue-500 data-[state=unchecked]:bg-gray-200 dark:data-[state=unchecked]:bg-gray-600"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="order-updates" className="text-base font-medium text-foreground dark:text-white">
                      Sipariş Güncellemesi
                    </Label>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Sipariş durumu değişikliklerinden haberdar olun
                    </div>
                  </div>
                  <Switch
                    id="order-updates"
                    checked={orderUpdates}
                    onCheckedChange={setOrderUpdates}
                    className="data-[state=checked]:bg-blue-500 data-[state=unchecked]:bg-gray-200 dark:data-[state=unchecked]:bg-gray-600"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="marketing-emails" className="text-base font-medium text-foreground dark:text-white">
                      Pazarlama Mailleri
                    </Label>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Promosyon emaillerini ve güncellemeleri alın
                    </div>
                  </div>
                  <Switch
                    id="marketing-emails"
                    checked={marketingEmails}
                    onCheckedChange={setMarketingEmails}
                    className="data-[state=checked]:bg-blue-500 data-[state=unchecked]:bg-gray-200 dark:data-[state=unchecked]:bg-gray-600"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Help & Support Section */}
        <div className="space-y-4">
          <h2 className="text-lg sm:text-xl font-semibold text-foreground dark:text-white">Yardım ve Destek</h2>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700 space-y-0">
            <Button
              variant="ghost"
              className="w-full justify-start p-4 sm:p-6 h-auto border-b dark:border-gray-700 rounded-none text-left text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700"
              onClick={() => setIsHelpModalOpen(true)}
            >
              <HelpCircle className="w-5 h-5 mr-3 sm:mr-4 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <div className="font-medium">Yardım</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Kullanıcı kılavuzunu ve dokümantasyonu görüntüleyin</div>
              </div>
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start p-4 sm:p-6 h-auto rounded-none text-left text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <Headphones className="w-5 h-5 mr-3 sm:mr-4 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <div className="font-medium">Destek</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Müşteri desteğiyle iletişime geçin</div>
              </div>
            </Button>
          </div>
        </div>

        <HelpModal 
          isOpen={isHelpModalOpen}
          onClose={() => setIsHelpModalOpen(false)}
        />
      </div>
    </div>
  );
}
