
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useOrders } from "@/hooks/useOrders";

interface OrderDetailsModalProps {
  order: any;
  isOpen: boolean;
  onClose: () => void;
}

export function OrderDetailsModal({ order, isOpen, onClose }: OrderDetailsModalProps) {
  const { updateOrderStatus, isUpdatingOrder } = useOrders();

  const handleReturnOrder = () => {
    updateOrderStatus({ id: order.id, status: "returned" });
    onClose();
  };

  const getOrderStatus = (orderDate: string) => {
    const today = new Date();
    const orderDateTime = new Date(orderDate);
    const diffInDays = Math.floor((today.getTime() - orderDateTime.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays <= 7) {
      return "new";
    } else {
      return "shipped";
    }
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

  const displayStatus = order.status === "returned" ? "returned" : getOrderStatus(order.order_date);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl mx-4 sm:mx-0">
        <DialogHeader>
          <DialogTitle className="text-xl sm:text-2xl font-bold">Order Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Order Information</h3>
              <div className="space-y-3">
                <div>
                  <span className="font-medium text-gray-700">Order ID:</span>
                  <p className="text-gray-900">#{order.id.slice(0, 8)}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Order Date:</span>
                  <p className="text-gray-900">{formatDate(order.order_date)}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Status:</span>
                  <div className="mt-1">
                    <Badge className={getStatusColor(displayStatus)}>
                      {displayStatus.charAt(0).toUpperCase() + displayStatus.slice(1)}
                    </Badge>
                  </div>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Total:</span>
                  <p className="text-gray-900 text-lg font-semibold">{formatCurrency(Number(order.total))}</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Customer Information</h3>
              <div className="space-y-3">
                <div>
                  <span className="font-medium text-gray-700">Name:</span>
                  <p className="text-gray-900">{order.customers?.name || 'Unknown'}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Customer ID:</span>
                  <p className="text-gray-900">{order.customers?.id_number || order.customer_id.slice(0, 8)}</p>
                </div>
                {order.customers?.email && (
                  <div>
                    <span className="font-medium text-gray-700">Email:</span>
                    <p className="text-gray-900">{order.customers.email}</p>
                  </div>
                )}
                {order.customers?.phone && (
                  <div>
                    <span className="font-medium text-gray-700">Phone:</span>
                    <p className="text-gray-900">{order.customers.phone}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Order Timeline</h3>
            <div className="space-y-2">
              <div className="flex items-center text-sm text-gray-600">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                Order placed on {formatDate(order.order_date)}
              </div>
              {displayStatus === "shipped" && (
                <div className="flex items-center text-sm text-gray-600">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  Order shipped (more than 7 days old)
                </div>
              )}
              {displayStatus === "returned" && (
                <div className="flex items-center text-sm text-gray-600">
                  <div className="w-2 h-2 bg-red-500 rounded-full mr-3"></div>
                  Order returned
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 pt-4 border-t">
            <Button variant="outline" onClick={onClose} className="w-full sm:w-auto">
              Close
            </Button>
            {displayStatus !== "returned" && (
              <Button 
                onClick={handleReturnOrder}
                disabled={isUpdatingOrder}
                variant="destructive"
                className="w-full sm:w-auto"
              >
                {isUpdatingOrder ? "Processing..." : "Mark as Returned"}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
