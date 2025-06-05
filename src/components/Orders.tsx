
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";

interface OrdersProps {
  onNewPrescription: () => void;
}

const mockOrders = [
  { id: "#12345", customer: "Ethan Harper", date: "2023-08-15", status: "Shipped", total: "$250" },
  { id: "#12346", customer: "Olivia Bennett", date: "2023-08-14", status: "New", total: "$180" },
  { id: "#12347", customer: "Liam Carter", date: "2023-08-17", status: "Returned", total: "$300" },
  { id: "#12348", customer: "Sophia Davis", date: "2023-08-18", status: "Shipped", total: "$220" },
  { id: "#12349", customer: "Noah Evans", date: "2023-08-19", status: "New", total: "$150" },
  { id: "#12350", customer: "Ava Foster", date: "2023-08-20", status: "Shipped", total: "$280" },
  { id: "#12351", customer: "Jackson Gray", date: "2023-08-21", status: "Returned", total: "$350" },
  { id: "#12352", customer: "Isabella Hayes", date: "2023-08-22", status: "New", total: "$200" },
  { id: "#12353", customer: "Lucas Ingram", date: "2023-08-23", status: "Shipped", total: "$230" },
  { id: "#12354", customer: "Mia Jenkins", date: "2023-08-24", status: "New", total: "$170" },
];

const statusFilters = ["All", "New", "Shipped", "Returned"];

export function Orders({ onNewPrescription }: OrdersProps) {
  const [activeFilter, setActiveFilter] = useState("All");

  const getStatusColor = (status: string) => {
    switch (status) {
      case "New": return "bg-blue-100 text-blue-800";
      case "Shipped": return "bg-green-100 text-green-800";
      case "Returned": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

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
            {filter}
          </Button>
        ))}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          placeholder="Search orders..."
          className="pl-10 bg-gray-50 border-gray-200"
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
            {mockOrders.map((order, index) => (
              <tr key={order.id} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                <td className="p-4 font-medium text-gray-900">{order.id}</td>
                <td className="p-4 text-gray-600">{order.customer}</td>
                <td className="p-4 text-gray-600">{order.date}</td>
                <td className="p-4">
                  <Badge className={getStatusColor(order.status)}>
                    {order.status}
                  </Badge>
                </td>
                <td className="p-4 font-medium text-gray-900">{order.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
