
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, Plus, Loader2 } from "lucide-react";
import { useCustomers } from "@/hooks/useCustomers";
import { AddCustomerModal } from "@/components/AddCustomerModal";

export function Customers() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const { customers, isLoading, error } = useCustomers();

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        Error loading customers. Please try again.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Customers</h1>
        <Button 
          onClick={() => setIsAddModalOpen(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Customer
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          placeholder="Search customers..."
          className="pl-10 bg-gray-50 border-gray-200"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Customers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCustomers.map((customer) => (
          <div key={customer.id} className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-center space-x-4">
              <Avatar className="w-12 h-12">
                <AvatarImage src="" alt={customer.name} />
                <AvatarFallback>{customer.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{customer.name}</h3>
                <p className="text-sm text-gray-500">ID: {customer.id.slice(0, 8)}</p>
                <p className="text-sm text-gray-600">{customer.email}</p>
                {customer.phone && <p className="text-sm text-gray-600">{customer.phone}</p>}
              </div>
            </div>
          </div>
        ))}
      </div>

      <AddCustomerModal 
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
    </div>
  );
}
