
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { usePrescriptions } from "@/hooks/usePrescriptions";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { PrescriptionForm } from "@/components/PrescriptionForm";

interface NewPrescriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const initialFormData = {
  firstName: "",
  lastName: "",
  idNumber: "",
  email: "",
  phone: "",
  address: "",
  productInfo: "",
  visionType: "",
  sph: "",
  cyl: "",
  axis: "",
  distanceVision: "",
  nearVision: "",
  nearGlassPrice: "",
  farGlassPrice: "",
  nearFramePrice: "",
  farFramePrice: "",
  add: "",
  pd: "",
  lensType: "",
  rightEye: {
    sph: "",
    cyl: "",
    axis: "",
  },
  leftEye: {
    sph: "",
    cyl: "",
    axis: "",
  },
  rightEyeFar: {
    sph: "",
    cyl: "",
    axis: "",
    lensType: "",
    lensColor: "",
  },
  rightEyeNear: {
    sph: "",
    cyl: "",
    axis: "",
    lensType: "",
    lensColor: "",
  },
  leftEyeFar: {
    sph: "",
    cyl: "",
    axis: "",
    lensType: "",
    lensColor: "",
  },
  leftEyeNear: {
    sph: "",
    cyl: "",
    axis: "",
    lensType: "",
    lensColor: "",
  },
};

export function NewPrescriptionModal({ isOpen, onClose }: NewPrescriptionModalProps) {
  const [date, setDate] = useState<Date>();
  const { addPrescription, isAddingPrescription } = usePrescriptions();
  const { user } = useAuth();
  const [formData, setFormData] = useState(initialFormData);

  // Clear form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setFormData(initialFormData);
      setDate(undefined);
    }
  }, [isOpen]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleEyeChange = (eye: 'rightEye' | 'leftEye', field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [eye]: {
        ...prev[eye],
        [field]: value
      }
    }));
  };

  const handleComplexEyeChange = (eye: 'rightEyeFar' | 'rightEyeNear' | 'leftEyeFar' | 'leftEyeNear', field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [eye]: {
        ...prev[eye],
        [field]: value
      }
    }));
  };

  // Auto-fill customer data when ID number is entered
  useEffect(() => {
    const fetchCustomerData = async () => {
      if (formData.idNumber && formData.idNumber.length > 0 && user) {
        try {
          console.log("Fetching customer data for ID:", formData.idNumber, "and user:", user.id);
          
          // Find customer by ID number for this specific user
          const { data: customer } = await supabase
            .from("customers")
            .select("*")
            .eq("id_number", formData.idNumber)
            .eq("user_id", user.id)
            .maybeSingle();

          console.log("Found customer:", customer);

          if (customer) {
            // Split the name into first and last name
            const nameParts = customer.name.split(" ");
            const firstName = nameParts[0] || "";
            const lastName = nameParts.slice(1).join(" ") || "";

            // Get the most recent prescription for this customer and user
            const { data: lastPrescription } = await supabase
              .from("prescriptions")
              .select("prescription_data")
              .eq("customer_id", customer.id)
              .eq("user_id", user.id)
              .order("created_at", { ascending: false })
              .limit(1)
              .maybeSingle();

            console.log("Found last prescription:", lastPrescription);

            let prescriptionData: any = {};
            if (lastPrescription && lastPrescription.prescription_data) {
              // Safely parse prescription data
              try {
                if (typeof lastPrescription.prescription_data === 'string') {
                  prescriptionData = JSON.parse(lastPrescription.prescription_data);
                } else if (typeof lastPrescription.prescription_data === 'object') {
                  prescriptionData = lastPrescription.prescription_data;
                }
              } catch (error) {
                console.error("Error parsing prescription data:", error);
                prescriptionData = {};
              }
            }

            setFormData(prev => ({
              ...prev,
              firstName,
              lastName,
              email: customer.email || "",
              phone: customer.phone || "",
              address: customer.address || "",
              // Fill prescription details from last prescription if available
              visionType: prescriptionData.visionType || "",
              sph: prescriptionData.sph || "",
              cyl: prescriptionData.cyl || "",
              axis: prescriptionData.axis || "",
              distanceVision: prescriptionData.distanceVision || "",
              nearVision: prescriptionData.nearVision || "",
              add: prescriptionData.add || "",
              pd: prescriptionData.pd || "",
              lensType: prescriptionData.lensType || "",
              rightEye: prescriptionData.rightEye || { sph: "", cyl: "", axis: "" },
              leftEye: prescriptionData.leftEye || { sph: "", cyl: "", axis: "" },
              rightEyeFar: prescriptionData.rightEyeFar || { sph: "", cyl: "", axis: "", lensType: "", lensColor: "" },
              rightEyeNear: prescriptionData.rightEyeNear || { sph: "", cyl: "", axis: "", lensType: "", lensColor: "" },
              leftEyeFar: prescriptionData.leftEyeFar || { sph: "", cyl: "", axis: "", lensType: "", lensColor: "" },
              leftEyeNear: prescriptionData.leftEyeNear || { sph: "", cyl: "", axis: "", lensType: "", lensColor: "" },
            }));
          }
        } catch (error) {
          console.error("Error fetching customer data:", error);
        }
      }
    };

    const timeoutId = setTimeout(fetchCustomerData, 500); // Debounce the API call
    return () => clearTimeout(timeoutId);
  }, [formData.idNumber, user]);

  const calculateTotalPrice = () => {
    const nearGlass = parseFloat(formData.nearGlassPrice) || 0;
    const farGlass = parseFloat(formData.farGlassPrice) || 0;
    const nearFrame = parseFloat(formData.nearFramePrice) || 0;
    const farFrame = parseFloat(formData.farFramePrice) || 0;
    return nearGlass + farGlass + nearFrame + farFrame;
  };

  const handleSave = () => {
    if (!date) {
      alert("Please select a purchase date");
      return;
    }

    if (!formData.firstName || !formData.lastName || !formData.idNumber || !formData.email) {
      alert("Please fill in all required fields");
      return;
    }

    const totalPrice = calculateTotalPrice();

    console.log("Saving prescription with form data:", formData);
    addPrescription({
      ...formData,
      price: totalPrice,
      purchaseDate: date,
    });
    
    // Reset form
    setFormData(initialFormData);
    setDate(undefined);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl sm:text-2xl font-bold">New Prescription</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Customer Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Customer Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="idNumber">ID Number *</Label>
                <Input
                  id="idNumber"
                  placeholder="Enter ID number"
                  value={formData.idNumber}
                  onChange={(e) => handleInputChange("idNumber", e.target.value)}
                  required
                />
                <p className="text-xs text-gray-500 mt-1">Enter ID to auto-fill existing customer data</p>
              </div>
              <div>
                <Label htmlFor="firstName">Name *</Label>
                <Input
                  id="firstName"
                  placeholder="Enter customer's first name"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange("firstName", e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="lastName">Surname *</Label>
                <Input
                  id="lastName"
                  placeholder="Enter customer's last name"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange("lastName", e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="customer@email.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  placeholder="0545297..."
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                placeholder="Enter customer's address"
                value={formData.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label>Purchase Date *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : <span>Select purchase date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>

          {/* Product Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Product Information</h3>
            <div>
              <Label htmlFor="productInfo">Product Information</Label>
              <Textarea
                id="productInfo"
                placeholder="Enter product details (e.g., Purchased glasses)"
                value={formData.productInfo}
                onChange={(e) => handleInputChange("productInfo", e.target.value)}
              />
            </div>
          </div>

          {/* Price Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Price Information</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="nearGlassPrice">Near Glass Price</Label>
                <Input
                  id="nearGlassPrice"
                  type="number"
                  placeholder="0.00"
                  value={formData.nearGlassPrice}
                  onChange={(e) => handleInputChange("nearGlassPrice", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="farGlassPrice">Far Glass Price</Label>
                <Input
                  id="farGlassPrice"
                  type="number"
                  placeholder="0.00"
                  value={formData.farGlassPrice}
                  onChange={(e) => handleInputChange("farGlassPrice", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="nearFramePrice">Near Frame Price</Label>
                <Input
                  id="nearFramePrice"
                  type="number"
                  placeholder="0.00"
                  value={formData.nearFramePrice}
                  onChange={(e) => handleInputChange("nearFramePrice", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="farFramePrice">Far Frame Price</Label>
                <Input
                  id="farFramePrice"
                  type="number"
                  placeholder="0.00"
                  value={formData.farFramePrice}
                  onChange={(e) => handleInputChange("farFramePrice", e.target.value)}
                />
              </div>
            </div>
            <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="font-semibold">Total Price:</span>
                <span className="text-xl font-bold">${calculateTotalPrice().toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Prescription Details using new form */}
          <PrescriptionForm 
            formData={formData}
            onChange={handleInputChange}
            onEyeChange={handleEyeChange}
            onComplexEyeChange={handleComplexEyeChange}
          />

          <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3">
            <Button type="button" variant="outline" onClick={onClose} className="w-full sm:w-auto">
              Cancel
            </Button>
            <Button 
              onClick={handleSave}
              disabled={isAddingPrescription}
              className="bg-blue-500 hover:bg-blue-600 text-white w-full sm:w-auto"
            >
              {isAddingPrescription ? "Saving..." : "Save Prescription"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
