
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function HelpModal({ isOpen, onClose }: HelpModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Help & Documentation</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="getting-started" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="getting-started">Getting Started</TabsTrigger>
            <TabsTrigger value="prescriptions">Prescriptions</TabsTrigger>
            <TabsTrigger value="customers">Customers</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
          </TabsList>

          <TabsContent value="getting-started" className="mt-6 space-y-4">
            <h3 className="text-lg font-semibold">Welcome to Visionary Optics</h3>
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Quick Start Guide</h4>
                <ol className="list-decimal list-inside space-y-2 text-sm">
                  <li>Navigate through the system using the sidebar menu</li>
                  <li>Create new prescriptions by clicking "New Prescription"</li>
                  <li>View and manage customers in the Customers section</li>
                  <li>Track orders and their status in the Orders section</li>
                  <li>Monitor your business statistics on the Dashboard</li>
                </ol>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Key Features</h4>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Real-time dashboard statistics</li>
                  <li>Automatic customer data filling for returning customers</li>
                  <li>Order status tracking (New, Shipped, Returned)</li>
                  <li>Complete prescription management</li>
                  <li>Customer history and order details</li>
                </ul>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="prescriptions" className="mt-6 space-y-4">
            <h3 className="text-lg font-semibold">Managing Prescriptions</h3>
            <div className="space-y-4">
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Creating a New Prescription</h4>
                <ol className="list-decimal list-inside space-y-2 text-sm">
                  <li>Click the "New Prescription" button</li>
                  <li>Enter the customer's ID number first - this will auto-fill existing customer data</li>
                  <li>Fill in customer information (Name, Email, Phone)</li>
                  <li>Add product information and purchase details</li>
                  <li>Enter prescription details (SPH, CYL, Axis, Vision types)</li>
                  <li>Click "Save Prescription" to complete</li>
                </ol>
              </div>
              
              <div className="bg-yellow-50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Auto-Fill Feature</h4>
                <p className="text-sm">
                  When entering an ID number for an existing customer, the system will automatically fill:
                </p>
                <ul className="list-disc list-inside space-y-1 text-sm mt-2">
                  <li>Customer name and contact information</li>
                  <li>Previous prescription details from their last order</li>
                </ul>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="customers" className="mt-6 space-y-4">
            <h3 className="text-lg font-semibold">Customer Management</h3>
            <div className="space-y-4">
              <div className="bg-purple-50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Viewing Customer Details</h4>
                <ul className="list-disc list-inside space-y-2 text-sm">
                  <li>Browse all customers in the Customers section</li>
                  <li>Use the search bar to find specific customers by name, email, or ID</li>
                  <li>Click on any customer card to view their complete order history</li>
                  <li>View detailed prescription information for each order</li>
                </ul>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Customer Information</h4>
                <p className="text-sm">Each customer profile includes:</p>
                <ul className="list-disc list-inside space-y-1 text-sm mt-2">
                  <li>Personal details (Name, Email, Phone, ID Number)</li>
                  <li>Registration date</li>
                  <li>Complete order history with prescription details</li>
                  <li>Order status and timeline</li>
                </ul>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="orders" className="mt-6 space-y-4">
            <h3 className="text-lg font-semibold">Order Management</h3>
            <div className="space-y-4">
              <div className="bg-orange-50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Order Status System</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span><strong>New:</strong> Orders placed within the last 7 days</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span><strong>Shipped:</strong> Orders older than 7 days</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span><strong>Returned:</strong> Orders marked as returned by customer</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Managing Orders</h4>
                <ul className="list-disc list-inside space-y-2 text-sm">
                  <li>View all orders in the Orders section</li>
                  <li>Click on any order to view detailed information</li>
                  <li>Mark orders as "Returned" when customers return products</li>
                  <li>Track order timeline and status changes</li>
                  <li>View associated customer and prescription information</li>
                </ul>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end pt-4 border-t">
          <Button onClick={onClose}>Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
