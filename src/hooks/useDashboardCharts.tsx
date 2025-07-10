import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface ChartData {
  date: string;
  orders: number;
  customers: number;
  prescriptions: number;
}

export const useDashboardCharts = () => {
  return useQuery({
    queryKey: ['dashboard-charts'],
    queryFn: async (): Promise<ChartData[]> => {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 7);

      // Get orders data for the last 7 days
      const { data: orders } = await supabase
        .from('orders')
        .select('created_at')
        .gte('created_at', startDate.toISOString())
        .lte('created_at', endDate.toISOString());

      // Get customers data for the last 7 days
      const { data: customers } = await supabase
        .from('customers')
        .select('created_at')
        .gte('created_at', startDate.toISOString())
        .lte('created_at', endDate.toISOString());

      // Get prescriptions data for the last 7 days
      const { data: prescriptions } = await supabase
        .from('prescriptions')
        .select('created_at')
        .gte('created_at', startDate.toISOString())
        .lte('created_at', endDate.toISOString());

      // Create chart data for the last 7 days
      const chartData: ChartData[] = [];
      
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        
        const ordersCount = orders?.filter(order => 
          order.created_at.startsWith(dateStr)
        ).length || 0;
        
        const customersCount = customers?.filter(customer => 
          customer.created_at.startsWith(dateStr)
        ).length || 0;
        
        const prescriptionsCount = prescriptions?.filter(prescription => 
          prescription.created_at.startsWith(dateStr)
        ).length || 0;

        chartData.push({
          date: date.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' }),
          orders: ordersCount,
          customers: customersCount,
          prescriptions: prescriptionsCount
        });
      }

      return chartData;
    },
    // Chart data will be refreshed only when manually triggered or on page refresh
    // This reduces database query load significantly
    staleTime: 24 * 60 * 60 * 1000, // Data is considered fresh for 24 hours
  });
};
