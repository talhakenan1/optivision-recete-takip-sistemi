
import { useState } from "react";
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

interface NewPrescriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NewPrescriptionModal({ isOpen, onClose }: NewPrescriptionModalProps) {
  const [date, setDate] = useState<Date>();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    idNumber: "",
    productInfo: "",
    visionType: "",
    sph: "",
    cyl: "",
    axis: "",
    distanceVision: "",
    nearVision: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    console.log("Saving prescription:", { ...formData, purchaseDate: date });
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
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">Name</Label>
                <Input
                  id="firstName"
                  placeholder="Enter customer's first name"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange("firstName", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="lastName">Surname</Label>
                <Input
                  id="lastName"
                  placeholder="Enter customer's last name"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange("lastName", e.target.value)}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="idNumber">ID Number</Label>
                <Input
                  id="idNumber"
                  placeholder="Enter customer's ID number"
                  value={formData.idNumber}
                  onChange={(e) => handleInputChange("idNumber", e.target.value)}
                />
              </div>
              <div>
                <Label>Purchase Date</Label>
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
                placeholder="Enter product details"
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

          <div className="flex justify-end">
            <Button onClick={handleSave} className="bg-blue-500 hover:bg-blue-600 text-white">
              Save Prescription
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
