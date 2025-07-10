
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useDashboardStats } from "@/hooks/useDashboardStats";
import { Users, CreditCard, ClipboardList, AlertCircle, Loader2, TrendingUp, Eye, ShoppingBag, Calendar, BarChart3 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useState } from "react";
import { useDashboardCharts } from "@/hooks/useDashboardCharts";

interface DashboardProps {
  onNewPrescription: () => void;
  onNavigate: (section: string) => void;
}

// Charts now use real data from useDashboardCharts

export function Dashboard({ onNewPrescription, onNavigate }: DashboardProps) {
  const { stats, isLoading, error } = useDashboardStats();
  const { data: chartData, isLoading: chartLoading } = useDashboardCharts();
  const [selectedChart, setSelectedChart] = useState<'orders' | 'customers' | 'prescriptions' | null>(null);
  
  const handleChartClick = (chartType: 'orders' | 'customers' | 'prescriptions') => {
    setSelectedChart(chartType);
  };
  
  // Use real data from database
  const displayData = chartData || [];

  return (
    <div className="min-h-screen bg-background dark:bg-[#1f2937]">
      <div className="space-y-6 p-6">
        {/* Hero Section */}
        <div className="relative h-96 rounded-2xl overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-800">
          <div className="absolute inset-0 bg-black bg-opacity-20" />
          {/* Rastgele dağıtılmış ikonlar */}
          <div className="absolute top-8 left-12 opacity-15">
            <Eye className="w-12 h-12 text-white animate-pulse" />
          </div>
          <div className="absolute top-20 right-20 opacity-20">
            <ShoppingBag className="w-10 h-10 text-white" />
          </div>
          <div className="absolute bottom-16 left-8 opacity-15">
            <Users className="w-14 h-14 text-white animate-pulse" style={{ animationDelay: '1s' }} />
          </div>
          <div className="absolute top-12 right-32 opacity-25">
            <ClipboardList className="w-8 h-8 text-white" />
          </div>
          <div className="absolute bottom-24 right-16 opacity-20">
            <BarChart3 className="w-16 h-16 text-white animate-pulse" style={{ animationDelay: '2s' }} />
          </div>
          <div className="absolute top-32 left-24 opacity-15">
            <Calendar className="w-10 h-10 text-white" />
          </div>
          <div className="absolute bottom-8 left-32 opacity-25">
            <Eye className="w-6 h-6 text-white" />
          </div>
          <div className="absolute top-16 right-8 opacity-20">
            <Users className="w-8 h-8 text-white animate-pulse" style={{ animationDelay: '0.5s' }} />
          </div>
          <div className="relative z-10 flex flex-col items-center justify-center h-full text-white text-center px-6">
            <div className="mb-6">
              <Eye className="w-20 h-20 mx-auto mb-4 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 font-mono">Visionary Optics</h1>
            <p className="text-lg md:text-xl mb-8 max-w-2xl opacity-90">
              Gözlük satışlarınızı ve müşteri bilgilerinizi verimli bir şekilde yönetin.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 hover:text-gray-900" onClick={() => onNavigate("orders")}>
                <ShoppingBag className="w-4 h-4 mr-2" />
                Siparişleri Görüntüle
              </Button>
              <Button size="lg" variant="outline" className="border-white text-blue-600 bg-white hover:bg-blue-50 hover:text-gray-900" onClick={() => onNavigate("customers")}>
                <Users className="w-4 h-4 mr-2" />
                Müşterileri Yönet
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, index) => (
              <Card key={index}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <Skeleton className="h-4 w-2/4" />
                  <Skeleton className="h-6 w-6 rounded-full" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-1/4 mb-2" />
                  <Skeleton className="h-4 w-3/4" />
                </CardContent>
              </Card>
            ))
          ) : error ? (
            <div className="md:col-span-2 lg:col-span-3">
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Hata</AlertTitle>
                <AlertDescription>
                  Pano istatistikleri yüklenirken bir hata oluştu.
                </AlertDescription>
              </Alert>
            </div>
          ) : (
            <>
              <Dialog open={selectedChart === 'orders'} onOpenChange={() => setSelectedChart(null)}>
                <Card 
                  className="cursor-pointer hover:shadow-lg transition-shadow duration-200 border-l-4 border-l-blue-500"
                  onClick={() => handleChartClick('orders')}
                >
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Toplam Siparişler</CardTitle>
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="h-4 w-4 text-blue-500" />
                      <CreditCard className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-blue-600">{stats?.totalOrders}</div>
                    <p className="text-xs text-muted-foreground">Grafiği görmek için tıklayın</p>
                  </CardContent>
                </Card>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <CreditCard className="h-5 w-5" />
                      Günlük Sipariş Trendi
                    </DialogTitle>
                  </DialogHeader>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={displayData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="orders" stroke="#3b82f6" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </DialogContent>
              </Dialog>

              <Dialog open={selectedChart === 'customers'} onOpenChange={() => setSelectedChart(null)}>
                <Card 
                  className="cursor-pointer hover:shadow-lg transition-shadow duration-200 border-l-4 border-l-green-500"
                  onClick={() => handleChartClick('customers')}
                >
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Aktif Müşteriler</CardTitle>
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="h-4 w-4 text-green-500" />
                      <Users className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">{stats?.activeCustomers}</div>
                    <p className="text-xs text-muted-foreground">Grafiği görmek için tıklayın</p>
                  </CardContent>
                </Card>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      Günlük Müşteri Sayısı
                    </DialogTitle>
                  </DialogHeader>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={displayData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="customers" fill="#10b981" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </DialogContent>
              </Dialog>

              <Dialog open={selectedChart === 'prescriptions'} onOpenChange={() => setSelectedChart(null)}>
                <Card 
                  className="cursor-pointer hover:shadow-lg transition-shadow duration-200 border-l-4 border-l-purple-500"
                  onClick={() => handleChartClick('prescriptions')}
                >
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Yeni Reçeteler</CardTitle>
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="h-4 w-4 text-purple-500" />
                      <ClipboardList className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-purple-600">{stats?.newPrescriptions}</div>
                    <p className="text-xs text-muted-foreground">Grafiği görmek için tıklayın</p>
                  </CardContent>
                </Card>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <ClipboardList className="h-5 w-5" />
                      Günlük Reçete Trendi
                    </DialogTitle>
                  </DialogHeader>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={displayData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="prescriptions" stroke="#8b5cf6" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </DialogContent>
              </Dialog>
            </>
          )}
        </div>

        {/* Copyright Footer */}
        <div className="text-center text-gray-500 dark:text-gray-400 text-sm mt-12">
          © 2024 Visionary Optics. All rights reserved.
        </div>
      </div>
    </div>
  );
}
