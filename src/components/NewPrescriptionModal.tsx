
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

interface NewPrescriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NewPrescriptionModal({ isOpen, onClose }: NewPrescriptionModalProps) {
  const [date, setDate] = useState<Date>();
  const { addPrescription, isAddingPrescription } = usePrescriptions();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    idNumber: "",
    email: "",
    phone: "",
    productInfo: "",
    visionType: "",
    sph: "",
    cyl: "",
    axis: "",
    distanceVision: "",
    nearVision: "",
    price: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Auto-fill customer data when ID number is entered
  useEffect(() => {
    const fetchCustomerData = async () => {
      if (formData.idNumber && formData.idNumber.length > 0) {
        try {
          // Find customer by ID number
          const { data: customer } = await supabase
            .from("customers")
            .select("*")
            .eq("id_number", formData.idNumber)
            .maybeSingle();

          if (customer) {
            // Split the name into first and last name
            const nameParts = customer.name.split(" ");
            const firstName = nameParts[0] || "";
            const lastName = nameParts.slice(1).join(" ") || "";

            // Get the most recent prescription for this customer
            const { data: lastPrescription } = await supabase
              .from("prescriptions")
              .select("prescription_data")
              .eq("customer_id", customer.id)
              .order("created_at", { ascending: false })
              .limit(1)
              .maybeSingle();

            setFormData(prev => ({
              ...prev,
              firstName,
              lastName,
              email: customer.email || "",
              phone: customer.phone || "",
              // Fill prescription details from last prescription if available
              visionType: lastPrescription?.prescription_data?.visionType || "",
              sph: lastPrescription?.prescription_data?.sph || "",
              cyl: lastPrescription?.prescription_data?.cyl || "",
              axis: lastPrescription?.prescription_data?.axis || "",
              distanceVision: lastPrescription?.prescription_data?.distanceVision || "",
              nearVision: lastPrescription?.prescription_data?.nearVision || "",
            }));
          }
        } catch (error) {
          console.error("Error fetching customer data:", error);
        }
      }
    };

    const timeoutId = setTimeout(fetchCustomerData, 500); // Debounce the API call
    return () => clearTimeout(timeoutId);
  }, [formData.idNumber]);

  const handleSave = () => {
    if (!date) {
      alert("Please select a purchase date");
      return;
    }

    if (!formData.firstName || !formData.lastName || !formData.idNumber || !formData.email) {
      alert("Please fill in all required fields");
      return;
    }

    console.log("Saving prescription with form data:", formData);
    addPrescription({
      ...formData,
      price: formData.price ? parseFloat(formData.price) : undefined,
      purchaseDate: date,
    });
    
    // Reset form
    setFormData({
      firstName: "",
      lastName: "",
      idNumber: "",
      email: "",
      phone: "",
      productInfo: "",
      visionType: "",
      sph: "",
      cyl: "",
      axis: "",
      distanceVision: "",
      nearVision: "",
      price: "",
    });
    setDate(undefined);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">New Prescription</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Customer Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Customer Information</h3>
            <div className="grid grid-cols-3 gap-4">
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
            <div className="grid grid-cols-2 gap-4">
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
            <div className="grid grid-cols-2 gap-4">
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
              <div>
                <Label htmlFor="price">Price</Label>
                <Input
                  id="price"
                  type="number"
                  placeholder="0.00"
                  value={formData.price}
                  onChange={(e) => handleInputChange("price", e.target.value)}
                />
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

          {/* Prescription Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Prescription Details</h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="visionType">Vision Type</Label>
                <Input
                  id="visionType"
                  value={formData.visionType}
                  onChange={(e) => handleInputChange("visionType", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="sph">SPH</Label>
                <Input
                  id="sph"
                  value={formData.sph}
                  onChange={(e) => handleInputChange("sph", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="cyl">CYL</Label>
                <Input
                  id="cyl"
                  value={formData.cyl}
                  onChange={(e) => handleInputChange("cyl", e.target.value)}
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="axis">Axis</Label>
                <Input
                  id="axis"
                  value={formData.axis}
                  onChange={(e) => handleInputChange("axis", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="distanceVision">Distance Vision</Label>
                <Input
                  id="distanceVision"
                  value={formData.distanceVision}
                  onChange={(e) => handleInputChange("distanceVision", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="nearVision">Near Vision</Label>
                <Input
                  id="nearVision"
                  value={formData.nearVision}
                  onChange={(e) => handleInputChange("nearVision", e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              onClick={handleSave}
              disabled={isAddingPrescription}
              className="bg-blue-500 hover:bg-blue-600 text-white"
            >
              {isAddingPrescription ? "Saving..." : "Save Prescription"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
