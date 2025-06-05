
import { Button } from "@/components/ui/button";
import { User, Sun, Bell, HelpCircle, Headphones } from "lucide-react";

interface SettingsProps {
  onPersonalInfo: () => void;
}

export function Settings({ onPersonalInfo }: SettingsProps) {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-900">Settings</h1>

      {/* Account Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900">Account</h2>
        <div className="bg-white rounded-lg shadow-sm border">
          <Button
            variant="ghost"
            className="w-full justify-start p-6 h-auto"
            onClick={onPersonalInfo}
          >
            <User className="w-5 h-5 mr-4" />
            <div className="text-left">
              <div className="font-medium">Personal Information</div>
              <div className="text-sm text-gray-500">Manage your personal information</div>
            </div>
          </Button>
        </div>
      </div>

      {/* Display Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900">Display</h2>
        <div className="bg-white rounded-lg shadow-sm border">
          <Button
            variant="ghost"
            className="w-full justify-start p-6 h-auto"
          >
            <Sun className="w-5 h-5 mr-4" />
            <div className="text-left">
              <div className="font-medium">Display Mode</div>
              <div className="text-sm text-gray-500">Choose your preferred display mode</div>
            </div>
          </Button>
        </div>
      </div>

      {/* Notifications Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900">Notifications</h2>
        <div className="bg-white rounded-lg shadow-sm border">
          <Button
            variant="ghost"
            className="w-full justify-start p-6 h-auto"
          >
            <Bell className="w-5 h-5 mr-4" />
            <div className="text-left">
              <div className="font-medium">Notification Preferences</div>
              <div className="text-sm text-gray-500">Manage your notification preferences</div>
            </div>
          </Button>
        </div>
      </div>

      {/* Help & Support Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900">Help & Support</h2>
        <div className="bg-white rounded-lg shadow-sm border space-y-0">
          <Button
            variant="ghost"
            className="w-full justify-start p-6 h-auto border-b rounded-none"
          >
            <HelpCircle className="w-5 h-5 mr-4" />
            <div className="text-left">
              <div className="font-medium">Help Center</div>
              <div className="text-sm text-gray-500">Get help with your account</div>
            </div>
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start p-6 h-auto rounded-none"
          >
            <Headphones className="w-5 h-5 mr-4" />
            <div className="text-left">
              <div className="font-medium">Contact Support</div>
              <div className="text-sm text-gray-500">Contact customer support</div>
            </div>
          </Button>
        </div>
      </div>
    </div>
  );
}
