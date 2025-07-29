
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
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto bg-background dark:bg-[#4f5450]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-foreground dark:text-white">Help & Documentation</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="getting-started" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-gray-100 dark:bg-gray-700">
            <TabsTrigger value="getting-started" className="text-gray-700 dark:text-gray-300 data-[state=active]:bg-white data-[state=active]:text-gray-900 dark:data-[state=active]:bg-gray-600 dark:data-[state=active]:text-white">Getting Started</TabsTrigger>
            <TabsTrigger value="prescriptions" className="text-gray-700 dark:text-gray-300 data-[state=active]:bg-white data-[state=active]:text-gray-900 dark:data-[state=active]:bg-gray-600 dark:data-[state=active]:text-white">Prescriptions</TabsTrigger>
            <TabsTrigger value="customers" className="text-gray-700 dark:text-gray-300 data-[state=active]:bg-white data-[state=active]:text-gray-900 dark:data-[state=active]:bg-gray-600 dark:data-[state=active]:text-white">Customers</TabsTrigger>
            <TabsTrigger value="orders" className="text-gray-700 dark:text-gray-300 data-[state=active]:bg-white data-[state=active]:text-gray-900 dark:data-[state=active]:bg-gray-600 dark:data-[state=active]:text-white">Orders</TabsTrigger>
          </TabsList>
          
          <TabsContent value="getting-started" className="space-y-4 mt-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border dark:border-gray-700">
              <h3 className="text-lg font-semibold mb-4 text-foreground dark:text-white">Welcome to Melis Optik</h3>
              <div className="space-y-4 text-gray-700 dark:text-gray-300">
                <p>
                  This application helps you manage your optical business efficiently. Here's what you can do:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Manage customer information and prescriptions</li>
                  <li>Create and track orders</li>
                  <li>View business analytics on the dashboard</li>
                  <li>Customize your experience through settings</li>
                </ul>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border dark:border-gray-700">
              <h3 className="text-lg font-semibold mb-4 text-foreground dark:text-white">Quick Start Guide</h3>
              <div className="space-y-4 text-gray-700 dark:text-gray-300">
                <div>
                  <h4 className="font-medium text-foreground dark:text-white">1. Add Your First Customer</h4>
                  <p>Navigate to the Customers page and click "Add Customer" to get started.</p>
                </div>
                <div>
                  <h4 className="font-medium text-foreground dark:text-white">2. Create a Prescription</h4>
                  <p>Use the "New Prescription" button to create prescriptions for your customers.</p>
                </div>
                <div>
                  <h4 className="font-medium text-foreground dark:text-white">3. Track Orders</h4>
                  <p>Monitor all orders and their status from the Orders page.</p>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="prescriptions" className="space-y-4 mt-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border dark:border-gray-700">
              <h3 className="text-lg font-semibold mb-4 text-foreground dark:text-white">Creating Prescriptions</h3>
              <div className="space-y-4 text-gray-700 dark:text-gray-300">
                <p>To create a new prescription:</p>
                <ol className="list-decimal pl-6 space-y-2">
                  <li>Click the "New Prescription" button</li>
                  <li>Select or create a customer</li>
                  <li>Fill in the prescription details including lens measurements</li>
                  <li>Add any special notes or requirements</li>
                  <li>Set the price and save</li>
                </ol>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="customers" className="space-y-4 mt-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border dark:border-gray-700">
              <h3 className="text-lg font-semibold mb-4 text-foreground dark:text-white">Managing Customers</h3>
              <div className="space-y-4 text-gray-700 dark:text-gray-300">
                <p>Customer management features include:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Adding new customers with contact information</li>
                  <li>Viewing customer order history</li>
                  <li>Searching customers by name, email, or ID</li>
                  <li>Tracking prescription history for each customer</li>
                </ul>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="orders" className="space-y-4 mt-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border dark:border-gray-700">
              <h3 className="text-lg font-semibold mb-4 text-foreground dark:text-white">Order Management</h3>
              <div className="space-y-4 text-gray-700 dark:text-gray-300">
                <p>Order tracking includes:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>New:</strong> Orders placed within the last 7 days</li>
                  <li><strong>Shipped:</strong> Orders older than 7 days</li>
                  <li><strong>Returned:</strong> Orders marked as returned</li>
                </ul>
                <p>You can filter orders by status and search by customer name or order ID.</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end pt-4 border-t dark:border-gray-600">
          <Button onClick={onClose} className="bg-blue-500 hover:bg-blue-600 text-white">
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
