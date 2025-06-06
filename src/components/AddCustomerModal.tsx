
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCustomers } from "@/hooks/useCustomers";

interface AddCustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddCustomerModal({ isOpen, onClose }: AddCustomerModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const { addCustomer, isAddingCustomer } = useCustomers();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addCustomer(formData);
    setFormData({ name: "", email: "", phone: "" });
    onClose();
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Add New Customer</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              required
              className="mt-1"
              placeholder="Customer's full name"
            />
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              required
              className="mt-1"
              placeholder="customer@email.com"
            />
          </div>

          <div>
            <Label htmlFor="phone">Phone (Optional)</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => handleInputChange("phone", e.target.value)}
              className="mt-1"
              placeholder="(555) 123-4567"
            />
          </div>

          <div className="flex justify-end space-x-3">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isAddingCustomer}
              className="bg-blue-500 hover:bg-blue-600 text-white"
            >
              {isAddingCustomer ? "Adding..." : "Add Customer"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
