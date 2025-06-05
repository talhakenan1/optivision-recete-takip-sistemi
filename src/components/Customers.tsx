
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search } from "lucide-react";

const mockCustomers = [
  { id: "123456789", name: "Sophia Carter", email: "sophia.carter@email.com", phone: "(555) 123-4567", avatar: "/lovable-uploads/65022451-c59a-498a-8a20-f98913e71add.png" },
  { id: "123456790", name: "Ethan Harper", email: "ethan.harper@email.com", phone: "(555) 234-5678", avatar: "" },
  { id: "123456791", name: "Olivia Bennett", email: "olivia.bennett@email.com", phone: "(555) 345-6789", avatar: "" },
  { id: "123456792", name: "Liam Carter", email: "liam.carter@email.com", phone: "(555) 456-7890", avatar: "" },
  { id: "123456793", name: "Noah Evans", email: "noah.evans@email.com", phone: "(555) 567-8901", avatar: "" },
  { id: "123456794", name: "Ava Foster", email: "ava.foster@email.com", phone: "(555) 678-9012", avatar: "" },
  { id: "123456795", name: "Jackson Gray", email: "jackson.gray@email.com", phone: "(555) 789-0123", avatar: "" },
  { id: "123456796", name: "Isabella Hayes", email: "isabella.hayes@email.com", phone: "(555) 890-1234", avatar: "" },
];

export function Customers() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCustomers = mockCustomers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Customers</h1>

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
                <AvatarImage src={customer.avatar} alt={customer.name} />
                <AvatarFallback>{customer.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{customer.name}</h3>
                <p className="text-sm text-gray-500">ID: {customer.id}</p>
                <p className="text-sm text-gray-600">{customer.email}</p>
                <p className="text-sm text-gray-600">{customer.phone}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
