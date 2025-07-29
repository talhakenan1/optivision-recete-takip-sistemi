import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useOrders } from "@/hooks/useOrders";
import { TrendingUp, Calendar, DollarSign } from "lucide-react";

interface RevenueByDay {
  [date: string]: number;
}

export function Revenue() {
  const { orders, isLoading, error } = useOrders();
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);

  // Siparişlerin order_date'ine göre aylık toplamları hesapla
  const monthlyTotals: { [month: string]: number } = {};
  const dailyTotalsByMonth: { [month: string]: RevenueByDay } = {};

  orders.forEach(order => {
    if (order.status === "returned") return;
    const dateObj = new Date(order.order_date);
    const monthKey = `${dateObj.getFullYear()}-${(dateObj.getMonth()+1).toString().padStart(2, "0")}`;
    const dayKey = dateObj.toISOString().split("T")[0];
    monthlyTotals[monthKey] = (monthlyTotals[monthKey] || 0) + Number(order.total);
    if (!dailyTotalsByMonth[monthKey]) dailyTotalsByMonth[monthKey] = {};
    dailyTotalsByMonth[monthKey][dayKey] = (dailyTotalsByMonth[monthKey][dayKey] || 0) + Number(order.total);
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
    }).format(amount);
  };

  const formatMonth = (monthKey: string) => {
    const [year, month] = monthKey.split("-");
    const monthNames = [
      "Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran",
      "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"
    ];
    return `${monthNames[parseInt(month) - 1]} ${year}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      day: 'numeric',
      month: 'long'
    });
  };

  return (
    <div className="min-h-screen bg-background dark:bg-[#1f2937] p-6">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-foreground dark:text-white">Ciro</h1>
      {isLoading && <div>Yükleniyor...</div>}
      {error && <div className="text-red-600">Ciro verileri yüklenemedi.</div>}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Object.entries(monthlyTotals).sort((a, b) => b[0].localeCompare(a[0])).map(([monthKey, total]) => (
          <Card 
            key={monthKey} 
            className={`group relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-105 cursor-pointer ${
              selectedMonth === monthKey 
                ? "ring-2 ring-blue-500 shadow-lg bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20" 
                : "hover:shadow-md bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900"
            }`}
            onClick={() => setSelectedMonth(selectedMonth === monthKey ? null : monthKey)}
          >
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full -translate-y-10 translate-x-10"></div>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <CardTitle className="text-lg font-bold text-gray-800 dark:text-white">
                    {formatMonth(monthKey)}
                  </CardTitle>
                </div>
                <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex items-center space-x-2 mb-4">
                <DollarSign className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {formatCurrency(total)}
                </div>
              </div>
              
              {selectedMonth === monthKey && (
                <div className="mt-6 animate-in slide-in-from-top-2 duration-300">
                  <div className="flex items-center space-x-2 mb-4">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div className="font-semibold text-gray-700 dark:text-gray-300">Günlük Ciro Detayları</div>
                  </div>
                  <div className="max-h-48 overflow-y-auto space-y-2 pr-2">
                    {Object.entries(dailyTotalsByMonth[monthKey]).sort((a, b) => b[0].localeCompare(a[0])).map(([day, dayTotal]) => (
                      <div key={day} className="flex justify-between items-center p-2 rounded-lg bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                          {formatDate(day)}
                        </span>
                        <span className="text-sm font-bold text-gray-900 dark:text-white">
                          {formatCurrency(dayTotal)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="mt-4 text-xs text-gray-500 dark:text-gray-400 text-center">
                {selectedMonth === monthKey ? "Detayları gizlemek için tıklayın" : "Detayları görmek için tıklayın"}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}