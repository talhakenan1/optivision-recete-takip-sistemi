
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface PersonalInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PersonalInfoModal({ isOpen, onClose }: PersonalInfoModalProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const handleChangePassword = async () => {
    if (!user?.email) return;
    
    setIsChangingPassword(true);
    
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;

      toast({
        title: "Password Reset Email Sent",
        description: "Please check your email for the password reset link.",
      });
      
      onClose();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-4 sm:mx-0">
        <DialogHeader>
          <div className="text-sm text-gray-500 mb-2">Settings / Personal Information</div>
          <DialogTitle className="text-xl sm:text-2xl font-bold">Personal Information</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={user?.email || ""}
              readOnly
              className="mt-1 bg-gray-50"
            />
          </div>

          <div>
            <Label htmlFor="password">Password</Label>
            <div className="relative mt-1">
              <Input
                id="password"
                type="password"
                value="••••••••"
                readOnly
                className="bg-gray-50 pr-10"
              />
              <div className="absolute right-3 top-3 text-gray-400 text-sm">
                Hidden for security
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-between gap-3">
            <Button 
              variant="outline"
              onClick={handleChangePassword}
              disabled={isChangingPassword}
              className="w-full sm:w-auto"
            >
              {isChangingPassword ? "Sending..." : "Change Password"}
            </Button>
            <Button 
              onClick={onClose} 
              className="bg-blue-500 hover:bg-blue-600 text-white w-full sm:w-auto"
            >
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
