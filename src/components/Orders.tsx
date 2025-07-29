
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, Loader2 } from "lucide-react";
import { useOrders } from "@/hooks/useOrders";
import { OrderDetailsModal } from "@/components/OrderDetailsModal";

export function Orders() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const { orders, isLoading, error } = useOrders();

  const getOrderStatus = (orderDate: string, status: string) => {
    if (status === "returned") return "returned";
    
    // All non-returned orders are considered "shipped"
    return "shipped";
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.customers?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customers?.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.toString().includes(searchTerm.toLowerCase());
    
    if (statusFilter === "all") return matchesSearch;
    
    const orderStatus = getOrderStatus(order.order_date, order.status);
    return matchesSearch && orderStatus === statusFilter;
  });

  // Calculate total amount excluding returned orders
  const totalAmount = filteredOrders.reduce((sum, order) => {
    const orderStatus = getOrderStatus(order.order_date, order.status);
    if (orderStatus === "returned") {
      return sum - Number(order.total);
    }
    return sum + Number(order.total);
  }, 0);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "shipped": return "bg-green-100 text-green-800";
      case "returned": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "shipped": return "Teslim";
      case "returned": return "İade";
      default: return status;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR');
  };

  // Günlük ve aylık toplamları hesapla (order_date'e göre)
  const today = new Date();
  const todayStr = today.toISOString().split("T")[0];
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();

  const dailyTotal = filteredOrders.reduce((sum, order) => {
    const orderStatus = getOrderStatus(order.order_date, order.status);
    const orderDate = new Date(order.order_date);
    const orderDateStr = orderDate.toISOString().split("T")[0];
    if (orderStatus !== "returned" && orderDateStr === todayStr) {
      return sum + Number(order.total);
    }
    return sum;
  }, 0);

  const monthlyTotal = filteredOrders.reduce((sum, order) => {
    const orderStatus = getOrderStatus(order.order_date, order.status);
    const orderDate = new Date(order.order_date);
    if (
      orderStatus !== "returned" &&
      orderDate.getMonth() === currentMonth &&
      orderDate.getFullYear() === currentYear
    ) {
      return sum + Number(order.total);
    }
    return sum;
  }, 0);

  const statusButtons = [
    { key: "all", label: "Hepsi" },
    { key: "shipped", label: "Teslim" },
    { key: "returned", label: "İade" },
  ];

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
        Siparişler yüklenirken hata oluştu. Lütfen tekrar deneyin.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background dark:bg-[#1f2937]">
      <div className="space-y-6 p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground dark:text-white">Siparişler</h1>
        </div>

        {/* Status Filter Buttons */}
        <div className="flex flex-wrap gap-2">
          {statusButtons.map((button) => (
            <Button
              key={button.key}
              variant={statusFilter === button.key ? "default" : "outline"}
              onClick={() => setStatusFilter(button.key)}
              className={statusFilter === button.key ? "bg-blue-500 hover:bg-blue-600 text-white" : ""}
            >
              {button.label}
            </Button>
          ))}
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Siparişlerde ara..."
            className="pl-10 bg-gray-50 border-gray-200 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-300"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Orders Table */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Sipariş ID</TableHead>
                <TableHead>Müşteri</TableHead>
                <TableHead>Tarih</TableHead>
                <TableHead>Durum</TableHead>
                <TableHead>Toplam</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => {
                const orderStatus = getOrderStatus(order.order_date, order.status);
                return (
                  <TableRow
                    key={order.id}
                    className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
                    onClick={() => setSelectedOrder(order)}
                  >
                    <TableCell className="font-medium">#{order.id.slice(0, 8)}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{order.customers?.name}</p>
                        <p className="text-sm text-gray-500">{order.customers?.email}</p>
                      </div>
                    </TableCell>
                    <TableCell>{formatDate(order.order_date)}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(orderStatus)}>
                        {getStatusText(orderStatus)}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-semibold">{formatCurrency(Number(order.total))}</TableCell>
                  </TableRow>
                );
              })}
              
              {/* Total Row */}
              {filteredOrders.length > 0 && (
                <TableRow className="bg-gray-50 dark:bg-gray-700 font-semibold">
                  <TableCell colSpan={2} className="text-right">Günlük Toplam:</TableCell>
                  <TableCell className="font-bold text-lg">{formatCurrency(dailyTotal)}</TableCell>
                  <TableCell className="text-right">Aylık Toplam:</TableCell>
                  <TableCell className="font-bold text-lg">{formatCurrency(monthlyTotal)}</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          {filteredOrders.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400">Sipariş bulunamadı.</p>
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
