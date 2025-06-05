
import { Button } from "@/components/ui/button";

interface DashboardProps {
  onNewPrescription: () => void;
}

export function Dashboard({ onNewPrescription }: DashboardProps) {
  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <div 
        className="relative h-96 rounded-2xl overflow-hidden bg-gradient-to-r from-gray-800 to-gray-600"
        style={{
          backgroundImage: 'url(/lovable-uploads/65022451-c59a-498a-8a20-f98913e71add.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-40" />
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-white text-center px-6">
          <h1 className="text-5xl font-bold mb-4">Visionary Optics</h1>
          <p className="text-xl mb-8 max-w-2xl">
            Manage your glasses sales and customer information efficiently.
          </p>
          <div className="flex gap-4">
            <Button 
              onClick={onNewPrescription}
              className="bg-white text-gray-800 hover:bg-gray-100 px-8 py-3 text-lg font-semibold rounded-full"
            >
              Orders
            </Button>
            <Button 
              variant="outline" 
              className="border-white text-white hover:bg-white hover:text-gray-800 px-8 py-3 text-lg font-semibold rounded-full"
            >
              Customers
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-sm font-medium text-gray-500">Total Orders</h3>
          <p className="text-3xl font-bold text-gray-900">1,234</p>
          <p className="text-sm text-green-600">+12% from last month</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-sm font-medium text-gray-500">Active Customers</h3>
          <p className="text-3xl font-bold text-gray-900">856</p>
          <p className="text-sm text-green-600">+8% from last month</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-sm font-medium text-gray-500">Revenue</h3>
          <p className="text-3xl font-bold text-gray-900">$45,678</p>
          <p className="text-sm text-green-600">+15% from last month</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-sm font-medium text-gray-500">New Prescriptions</h3>
          <p className="text-3xl font-bold text-gray-900">23</p>
          <p className="text-sm text-green-600">+5% from last month</p>
        </div>
      </div>

      {/* Copyright Footer */}
      <div className="text-center text-gray-500 text-sm mt-12">
        © 2024 Visionary Optics. All rights reserved.
      </div>
    </div>
  );
}
