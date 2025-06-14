
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Loader2 } from "lucide-react";
import { useOrders } from "@/hooks/useOrders";
import { OrderDetailsModal } from "@/components/OrderDetailsModal";

interface OrdersProps {
  onNewPrescription: () => void;
}

const statusFilters = ["All", "new", "shipped", "returned"];

export function Orders({ onNewPrescription }: OrdersProps) {
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const { orders, isLoading, error } = useOrders();

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

  const filteredOrders = orders.map(order => ({
    ...order,
    calculatedStatus: order.status === "returned" ? "returned" : getOrderStatus(order.order_date)
  })).filter(order => {
    const matchesFilter = activeFilter === "All" || order.calculatedStatus === activeFilter;
    const matchesSearch = order.customers?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "new": return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "shipped": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "returned": return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
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

  const calculateTotal = () => {
    return filteredOrders.reduce((sum, order) => sum + Number(order.total), 0);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 p-6">
        Error loading orders. Please try again.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background dark:bg-[#1f2937]">
      <div className="space-y-6 p-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-foreground dark:text-white">Orders</h1>
          <Button 
            onClick={onNewPrescription}
            className="bg-blue-500 hover:bg-blue-600 text-white"
          >
            New Prescription
          </Button>
        </div>

        {/* Filters */}
        <div className="flex gap-4">
          {statusFilters.map((filter) => (
            <Button
              key={filter}
              variant={activeFilter === filter ? "default" : "outline"}
              onClick={() => setActiveFilter(filter)}
              className={
                activeFilter === filter 
                  ? "bg-gray-900 text-white hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100" 
                  : "border-gray-300 text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:border-gray-600 dark:text-white dark:hover:bg-gray-600 dark:hover:text-white"
              }
            >
              {filter.charAt(0).toUpperCase() + filter.slice(1)}
            </Button>
          ))}
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search orders..."
            className="pl-10 bg-gray-50 border-gray-200 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-300"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Orders Table */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-100 dark:bg-[#374151]">
              <tr>
                <th className="text-left p-4 font-medium text-gray-700 dark:text-gray-300">Order ID</th>
                <th className="text-left p-4 font-medium text-gray-700 dark:text-gray-300">Customer</th>
                <th className="text-left p-4 font-medium text-gray-700 dark:text-gray-300">Date</th>
                <th className="text-left p-4 font-medium text-gray-700 dark:text-gray-300">Status</th>
                <th className="text-left p-4 font-medium text-gray-700 dark:text-gray-300">Total</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order, index) => (
                <tr 
                  key={order.id} 
                  className={`${index % 2 === 0 ? "bg-white dark:bg-gray-700" : "bg-gray-50 dark:bg-[#374151]"} hover:bg-blue-50 dark:hover:bg-gray-500 cursor-pointer`}
                  onClick={() => setSelectedOrder(order)}
                >
                  <td className="p-4 font-medium text-gray-900 dark:text-gray-200">#{order.id.slice(0, 8)}</td>
                  <td className="p-4 text-gray-600 dark:text-gray-300">{order.customers?.name || 'Unknown'}</td>
                  <td className="p-4 text-gray-600 dark:text-gray-300">{formatDate(order.order_date)}</td>
                  <td className="p-4">
                    <Badge className={getStatusColor(order.calculatedStatus)}>
                      {order.calculatedStatus.charAt(0).toUpperCase() + order.calculatedStatus.slice(1)}
                    </Badge>
                  </td>
                  <td className="p-4 font-medium text-gray-900 dark:text-gray-200">{formatCurrency(Number(order.total))}</td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-gray-100 dark:bg-[#374151]">
              <tr>
                <td colSpan={4} className="p-4 font-medium text-gray-700 dark:text-gray-300 text-right">
                  Total:
                </td>
                <td className="p-4 font-bold text-gray-900 dark:text-gray-200">
                  {formatCurrency(calculateTotal())}
                </td>
              </tr>
            </tfoot>
          </table>
          {filteredOrders.length === 0 && (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400">
              No orders found matching your criteria.
            </div>
          )}
        </div>

        {selectedOrder && (
          <OrderDetailsModal
            order={selectedOrder}
            isOpen={!!selectedOrder}
            onClose={() => setSelectedOrder(null)}
          />
        )}
      </div>
    </div>
  );
}
