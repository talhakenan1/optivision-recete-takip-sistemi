
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useDashboardStats() {
  const { data: stats, isLoading, error } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: async () => {
      // Get total orders count
      const { count: totalOrders } = await supabase
        .from("orders")
        .select("*", { count: "exact", head: true });

      // Get active customers count (customers who have placed orders)
      const { count: activeCustomers } = await supabase
        .from("customers")
        .select("id", { count: "exact", head: true })
        .in("id", 
          supabase
            .from("orders")
            .select("customer_id")
        );

      // Get total revenue
      const { data: revenueData } = await supabase
        .from("orders")
        .select("total");
      
      const totalRevenue = revenueData?.reduce((sum, order) => sum + Number(order.total), 0) || 0;

      // Get new prescriptions count (prescriptions from last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const { count: newPrescriptions } = await supabase
        .from("prescriptions")
        .select("*", { count: "exact", head: true })
        .gte("created_at", thirtyDaysAgo.toISOString());

      return {
        totalOrders: totalOrders || 0,
        activeCustomers: activeCustomers || 0,
        totalRevenue: totalRevenue,
        newPrescriptions: newPrescriptions || 0,
      };
    },
  });

  return {
    stats,
    isLoading,
    error,
  };
}
