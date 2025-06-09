import { useQuery } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface CustomerDetailsModalProps {
  customer: any;
  isOpen: boolean;
  onClose: () => void;
}

export function CustomerDetailsModal({ customer, isOpen, onClose }: CustomerDetailsModalProps) {
  const { user } = useAuth();
  
  const { data: customerOrders = [], isLoading } = useQuery({
    queryKey: ["customer-orders", customer.id, user?.id],
    queryFn: async () => {
      if (!user) throw new Error("User not authenticated");
      
      console.log("Fetching orders for customer:", customer.id, "and user:", user.id);
      
      const { data, error } = await supabase
        .from("orders")
        .select(`
          *,
          prescriptions (
            prescription_data,
            notes
          )
        `)
        .eq("customer_id", customer.id)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching customer orders:", error);
        throw error;
      }
      
      console.log("Fetched customer orders:", data);
      return data || [];
    },
    enabled: isOpen && !!user,
  });

  const getOrderStatus = (orderDate: string, status: string) => {
    if (status === "returned") return "returned";
    
    const today = new Date();
    const orderDateTime = new Date(orderDate);
    const diffInDays = Math.floor((today.getTime() - orderDateTime.getTime()) / (1000 * 60 * 60 * 24));
    
    return diffInDays <= 7 ? "new" : "shipped";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "new": return "bg-blue-100 text-blue-800";
      case "shipped": return "bg-green-100 text-green-800";
      case "returned": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Customer Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Customer Information */}
          <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Customer Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="font-medium text-gray-700 dark:text-gray-300">Name:</span>
                <p className="text-gray-900 dark:text-gray-100">{customer.name}</p>
              </div>
              <div>
                <span className="font-medium text-gray-700 dark:text-gray-300">Email:</span>
                <p className="text-gray-900 dark:text-gray-100">{customer.email}</p>
              </div>
              <div>
                <span className="font-medium text-gray-700 dark:text-gray-300">Phone:</span>
                <p className="text-gray-900 dark:text-gray-100">{customer.phone || 'N/A'}</p>
              </div>
              <div>
                <span className="font-medium text-gray-700 dark:text-gray-300">ID Number:</span>
                <p className="text-gray-900 dark:text-gray-100">{customer.id_number || 'N/A'}</p>
              </div>
              <div>
                <span className="font-medium text-gray-700 dark:text-gray-300">Customer Since:</span>
                <p className="text-gray-900 dark:text-gray-100">{formatDate(customer.created_at)}</p>
              </div>
            </div>
          </div>

          {/* Order History */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Order History</h3>
            {isLoading ? (
              <div className="flex items-center justify-center p-8">
                <Loader2 className="w-6 h-6 animate-spin" />
              </div>
            ) : customerOrders.length > 0 ? (
              <div className="space-y-4">
                {customerOrders.map((order) => {
                  const orderStatus = getOrderStatus(order.order_date, order.status);
                  return (
                    <div key={order.id} className="border dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-gray-800">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-gray-100">Order #{order.id.slice(0, 8)}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Date: {formatDate(order.order_date)}</p>
                        </div>
                        <div className="text-right">
                          <Badge className={getStatusColor(orderStatus)}>
                            {orderStatus.charAt(0).toUpperCase() + orderStatus.slice(1)}
                          </Badge>
                          <p className="text-lg font-semibold mt-1 dark:text-gray-100">{formatCurrency(Number(order.total))}</p>
                        </div>
                      </div>
                      
                      {order.prescriptions && order.prescriptions.length > 0 && (
                        <div className="mt-3 pt-3 border-t dark:border-gray-700">
                          <h5 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Prescription Details:</h5>
                          {order.prescriptions.map((prescription: any, index: number) => (
                            <div key={index} className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
                              {prescription.prescription_data?.productInfo && (
                                <p><span className="font-medium">Product:</span> {prescription.prescription_data.productInfo}</p>
                              )}
                              {prescription.prescription_data?.lensType && (
                                <p><span className="font-medium">Lens Type:</span> {prescription.prescription_data.lensType}</p>
                              )}
                              
                              {/* New Vision Details Grid - prioritize new format */}
                              {prescription.prescription_data?.rightEye || prescription.prescription_data?.leftEye ? (
                                <div className="grid grid-cols-2 gap-4 mt-2 p-3 bg-gray-50 dark:bg-gray-700 rounded">
                                  <div className="space-y-1">
                                    <h6 className="font-medium text-gray-700 dark:text-gray-300">Right Eye (OD)</h6>
                                    {prescription.prescription_data?.rightEye?.sph && (
                                      <p><span className="font-medium">SPH:</span> {prescription.prescription_data.rightEye.sph}</p>
                                    )}
                                    {prescription.prescription_data?.rightEye?.cyl && (
                                      <p><span className="font-medium">CYL:</span> {prescription.prescription_data.rightEye.cyl}</p>
                                    )}
                                    {prescription.prescription_data?.rightEye?.axis && (
                                      <p><span className="font-medium">AXIS:</span> {prescription.prescription_data.rightEye.axis}</p>
                                    )}
                                    {prescription.prescription_data?.add && (
                                      <p><span className="font-medium">ADD:</span> {prescription.prescription_data.add}</p>
                                    )}
                                  </div>
                                  <div className="space-y-1">
                                    <h6 className="font-medium text-gray-700 dark:text-gray-300">Left Eye (OS)</h6>
                                    {prescription.prescription_data?.leftEye?.sph && (
                                      <p><span className="font-medium">SPH:</span> {prescription.prescription_data.leftEye.sph}</p>
                                    )}
                                    {prescription.prescription_data?.leftEye?.cyl && (
                                      <p><span className="font-medium">CYL:</span> {prescription.prescription_data.leftEye.cyl}</p>
                                    )}
                                    {prescription.prescription_data?.leftEye?.axis && (
                                      <p><span className="font-medium">AXIS:</span> {prescription.prescription_data.leftEye.axis}</p>
                                    )}
                                    {prescription.prescription_data?.pd && (
                                      <p><span className="font-medium">PD:</span> {prescription.prescription_data.pd}</p>
                                    )}
                                  </div>
                                </div>
                              ) : (
                                // Fallback to old format if new format not available
                                <div className="grid grid-cols-2 gap-4 mt-2 p-3 bg-gray-50 dark:bg-gray-700 rounded">
                                  <div className="space-y-1">
                                    {prescription.prescription_data?.sph && (
                                      <p><span className="font-medium">SPH:</span> {prescription.prescription_data.sph}</p>
                                    )}
                                    {prescription.prescription_data?.cyl && (
                                      <p><span className="font-medium">CYL:</span> {prescription.prescription_data.cyl}</p>
                                    )}
                                    {prescription.prescription_data?.axis && (
                                      <p><span className="font-medium">Axis:</span> {prescription.prescription_data.axis}</p>
                                    )}
                                  </div>
                                  <div className="space-y-1">
                                    {prescription.prescription_data?.distanceVision && (
                                      <p><span className="font-medium">Distance Vision:</span> {prescription.prescription_data.distanceVision}</p>
                                    )}
                                    {prescription.prescription_data?.nearVision && (
                                      <p><span className="font-medium">Near Vision:</span> {prescription.prescription_data.nearVision}</p>
                                    )}
                                  </div>
                                </div>
                              )}

                              {prescription.notes && (
                                <p><span className="font-medium">Notes:</span> {prescription.notes}</p>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                No orders found for this customer.
              </div>
            )}
          </div>

          <div className="flex justify-end pt-4 border-t dark:border-gray-700">
            <Button onClick={onClose}>Close</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
