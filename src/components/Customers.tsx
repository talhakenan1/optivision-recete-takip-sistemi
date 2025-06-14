
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, Loader2 } from "lucide-react";
import { useCustomers } from "@/hooks/useCustomers";
import { CustomerDetailsModal } from "@/components/CustomerDetailsModal";

export function Customers() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const { customers, isLoading, error } = useCustomers();

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (customer.id_number && customer.id_number.toLowerCase().includes(searchTerm.toLowerCase()))
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
        Müşteriler yüklenirken hata oluştu. Lütfen tekrar deneyin.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background dark:bg-[#1f2937]">
      <div className="space-y-6 p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground dark:text-white">Müşteriler</h1>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Müşterilerde ara..."
            className="pl-10 bg-gray-50 border-gray-200 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-300"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Customers Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredCustomers.map((customer) => (
            <div 
              key={customer.id} 
              className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-sm border dark:border-gray-700 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => setSelectedCustomer(customer)}
            >
              <div className="flex items-center space-x-3 sm:space-x-4">
                <Avatar className="w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0">
                  <AvatarImage src="" alt={customer.name} />
                  <AvatarFallback className="text-sm">{customer.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 dark:text-white truncate">{customer.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 truncate">TC: {customer.id_number || customer.id.slice(0, 8)}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300 truncate">{customer.email}</p>
                  {customer.phone && <p className="text-sm text-gray-600 dark:text-gray-300 truncate">{customer.phone}</p>}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredCustomers.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">Müşteri bulunamadı.</p>
          </div>
        )}

        {selectedCustomer && (
          <CustomerDetailsModal
            customer={selectedCustomer}
            isOpen={!!selectedCustomer}
            onClose={() => setSelectedCustomer(null)}
          />
        )}
      </div>
    </div>
  );
}
