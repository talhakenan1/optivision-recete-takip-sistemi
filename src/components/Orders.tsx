
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Loader2 } from "lucide-react";
import { useOrders } from "@/hooks/useOrders";

interface OrdersProps {
  onNewPrescription: () => void;
}

const statusFilters = ["All", "new", "shipped", "returned"];

export function Orders({ onNewPrescription }: OrdersProps) {
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const { orders, isLoading, error } = useOrders();

  const filteredOrders = orders.filter(order => {
    const matchesFilter = activeFilter === "All" || order.status === activeFilter;
    const matchesSearch = order.customers?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Orders</h1>
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
            className={activeFilter === filter ? "bg-gray-900" : ""}
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
          className="pl-10 bg-gray-50 border-gray-200"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left p-4 font-medium text-gray-700">Order ID</th>
              <th className="text-left p-4 font-medium text-gray-700">Customer</th>
              <th className="text-left p-4 font-medium text-gray-700">Date</th>
              <th className="text-left p-4 font-medium text-gray-700">Status</th>
              <th className="text-left p-4 font-medium text-gray-700">Total</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order, index) => (
              <tr key={order.id} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                <td className="p-4 font-medium text-gray-900">#{order.id.slice(0, 8)}</td>
                <td className="p-4 text-gray-600">{order.customers?.name || 'Unknown'}</td>
                <td className="p-4 text-gray-600">{formatDate(order.order_date)}</td>
                <td className="p-4">
                  <Badge className={getStatusColor(order.status)}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </Badge>
                </td>
                <td className="p-4 font-medium text-gray-900">{formatCurrency(Number(order.total))}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredOrders.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            No orders found matching your criteria.
          </div>
        )}
      </div>
    </div>
  );
}
