
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export function useDashboardStats() {
  const { user } = useAuth();
  
  const { data: stats, isLoading, error } = useQuery({
    queryKey: ["dashboard-stats", user?.id],
    queryFn: async () => {
      if (!user) throw new Error("User not authenticated");
      
      // Get total orders count for this user
      const { count: totalOrders } = await supabase
        .from("orders")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id);

      // Get active customers count for this user (customers who have placed orders)
      const { data: ordersWithCustomers } = await supabase
        .from("orders")
        .select("customer_id")
        .eq("user_id", user.id);
      
      const uniqueCustomerIds = new Set(ordersWithCustomers?.map(order => order.customer_id) || []);
      const activeCustomers = uniqueCustomerIds.size;

      // Get total revenue for this user (excluding returned orders)
      const { data: revenueData } = await supabase
        .from("orders")
        .select("total, status")
        .eq("user_id", user.id)
        .neq("status", "returned");
      
      const totalRevenue = revenueData?.reduce((sum, order) => sum + Number(order.total), 0) || 0;

      // Get new prescriptions count for this user (prescriptions from last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const { count: newPrescriptions } = await supabase
        .from("prescriptions")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id)
        .gte("created_at", thirtyDaysAgo.toISOString());

      const statsResult = {
        totalOrders: totalOrders || 0,
        activeCustomers: activeCustomers,
        totalRevenue: totalRevenue,
        newPrescriptions: newPrescriptions || 0,
      };
      
      return statsResult;
    },
    enabled: !!user,
  });

  return {
    stats,
    isLoading,
    error,
  };
}
