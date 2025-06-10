
import { Button } from "@/components/ui/button";
import { User, Sun, Moon, Bell, HelpCircle, Headphones, LogOut, Monitor } from "lucide-react";
import { useState } from "react";
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
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(false);
  const [orderUpdates, setOrderUpdates] = useState(true);
  const [marketingEmails, setMarketingEmails] = useState(false);
  const { signOut } = useAuth();

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme);
    // Here you would implement actual theme switching
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  return (
    <div className="space-y-8 bg-background dark:bg-[#4f5450] min-h-screen p-6">
      <h1 className="text-2xl sm:text-3xl font-bold text-foreground dark:text-white">Settings</h1>

      {/* Account Section */}
      <div className="space-y-4">
        <h2 className="text-lg sm:text-xl font-semibold text-foreground dark:text-white">Account</h2>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700 space-y-0">
          <Button
            variant="ghost"
            className="w-full justify-start p-4 sm:p-6 h-auto border-b dark:border-gray-700 rounded-none text-left text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700"
            onClick={onPersonalInfo}
          >
            <User className="w-5 h-5 mr-3 sm:mr-4 flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <div className="font-medium">Personal Information</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Manage your personal information</div>
            </div>
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start p-4 sm:p-6 h-auto rounded-none text-left text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700"
            onClick={signOut}
          >
            <LogOut className="w-5 h-5 mr-3 sm:mr-4 flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <div className="font-medium">Sign Out</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Sign out of your account</div>
            </div>
          </Button>
        </div>
      </div>

      {/* Display Section */}
      <div className="space-y-4">
        <h2 className="text-lg sm:text-xl font-semibold text-foreground dark:text-white">Display</h2>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700 p-4 sm:p-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Sun className="w-5 h-5 text-foreground dark:text-white" />
              <span className="font-medium text-foreground dark:text-white">Theme</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Button
                variant={theme === "light" ? "default" : "outline"}
                onClick={() => handleThemeChange("light")}
                className="flex items-center justify-center space-x-2 h-auto py-3 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <Sun className="w-4 h-4" />
                <span>Light</span>
              </Button>
              <Button
                variant={theme === "dark" ? "default" : "outline"}
                onClick={() => handleThemeChange("dark")}
                className="flex items-center justify-center space-x-2 h-auto py-3 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <Moon className="w-4 h-4" />
                <span>Dark</span>
              </Button>
              <Button
                variant={theme === "system" ? "default" : "outline"}
                onClick={() => handleThemeChange("system")}
                className="flex items-center justify-center space-x-2 h-auto py-3 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <Monitor className="w-4 h-4" />
                <span>System</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Notifications Section */}
      <div className="space-y-4">
        <h2 className="text-lg sm:text-xl font-semibold text-foreground dark:text-white">Notification Preferences</h2>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700 p-4 sm:p-6">
          <div className="space-y-6">
            <div className="flex items-center space-x-2 mb-4">
              <Bell className="w-5 h-5 text-foreground dark:text-white" />
              <span className="font-medium text-foreground dark:text-white">Notifications</span>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="email-notifications" className="text-base font-medium text-foreground dark:text-white">
                    Email Notifications
                  </Label>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Receive notifications via email
                  </div>
                </div>
                <Switch
                  id="email-notifications"
                  checked={emailNotifications}
                  onCheckedChange={setEmailNotifications}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="push-notifications" className="text-base font-medium text-foreground dark:text-white">
                    Push Notifications
                  </Label>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Receive push notifications in browser
                  </div>
                </div>
                <Switch
                  id="push-notifications"
                  checked={pushNotifications}
                  onCheckedChange={setPushNotifications}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="order-updates" className="text-base font-medium text-foreground dark:text-white">
                    Order Updates
                  </Label>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Get notified about order status changes
                  </div>
                </div>
                <Switch
                  id="order-updates"
                  checked={orderUpdates}
                  onCheckedChange={setOrderUpdates}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="marketing-emails" className="text-base font-medium text-foreground dark:text-white">
                    Marketing Emails
                  </Label>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Receive promotional emails and updates
                  </div>
                </div>
                <Switch
                  id="marketing-emails"
                  checked={marketingEmails}
                  onCheckedChange={setMarketingEmails}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Help & Support Section */}
      <div className="space-y-4">
        <h2 className="text-lg sm:text-xl font-semibold text-foreground dark:text-white">Help & Support</h2>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700 space-y-0">
          <Button
            variant="ghost"
            className="w-full justify-start p-4 sm:p-6 h-auto border-b dark:border-gray-700 rounded-none text-left text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700"
            onClick={() => setIsHelpModalOpen(true)}
          >
            <HelpCircle className="w-5 h-5 mr-3 sm:mr-4 flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <div className="font-medium">Help & Documentation</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">View user guide and documentation</div>
            </div>
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start p-4 sm:p-6 h-auto rounded-none text-left text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            <Headphones className="w-5 h-5 mr-3 sm:mr-4 flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <div className="font-medium">Contact Support</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Contact customer support</div>
            </div>
          </Button>
        </div>
      </div>

      <HelpModal 
        isOpen={isHelpModalOpen}
        onClose={() => setIsHelpModalOpen(false)}
      />
    </div>
  );
}
